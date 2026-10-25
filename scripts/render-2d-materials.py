"""Render the article's ideal 2D crystals from reproducible atomic coordinates.

Requires numpy and Pillow. Run from any directory with Python 3.
These are finite, unrelaxed patches of periodic crystals, not molecular clusters.
Displayed radii/colours are illustrative. Coordinates and bonds are not AI-inferred.
"""

import json
from pathlib import Path

import numpy as np
from PIL import Image

OUTPUT = Path(__file__).resolve().parents[1] / "public/images/graphene"
ASE = "https://ase.gitlab.io/ase/_modules/ase/build/surface.html"
PHOSPHORENE = "https://doi.org/10.1103/PhysRevB.94.165419"


def hexagonal(a):
    return np.array([[a, 0, 0], [-a / 2, a * np.sqrt(3) / 2, 0]])


def crystals():
    cell = hexagonal(2.50)
    yield dict(id="hbn", cell=cell, elements=["B", "N"],
               basis=np.array([[0, 0, 0], (2 * cell[0] + cell[1]) / 3]),
               cutoff=1.50, coordination={"B": 3, "N": 3}, repeat=(7, 7),
               elevation=76, azimuth=90, radii={"B": .32, "N": .32},
               colours={"B": [189, 115, 75], "N": [229, 209, 178]},
               sources=[ASE, "https://arxiv.org/abs/1005.4917"],
               description="Ideal planar BN honeycomb; representative a=2.50 angstrom. B and N alternate on the two sublattices.")
    cell = hexagonal(3.18)
    s = (2 * cell[0] + cell[1]) / 3
    yield dict(id="mos2", cell=cell, elements=["Mo", "S", "S"],
               basis=np.array([[0, 0, 0], s + [0, 0, 1.595], s - [0, 0, 1.595]]),
               cutoff=2.50, coordination={"Mo": 6, "S": 3}, repeat=(5, 3),
               elevation=5, azimuth=90, radii={"Mo": .43, "S": .38},
               colours={"Mo": [132, 145, 154], "S": [212, 153, 94]},
               sources=[ASE],
               description="Trigonal-prismatic 1H monolayer, the monolayer used by ASE mx2(kind='2H'). a=3.18 angstrom; S-plane separation=3.19 angstrom. Top/bottom S sites align in projection.")
    a, c, b, u, v = 3.314, 4.376, 10.48, .08056, .10168
    A, B = np.array([u * c, 0, v * b]), np.array([(.5 - u) * c, a / 2, v * b])
    basis = np.array([A, B, -A, -B])
    basis[:, :2] %= [c, a]
    yield dict(id="phosphorene", cell=np.array([[c, 0, 0], [0, a, 0]]),
               elements=["P"] * 4, basis=basis, cutoff=2.30,
               coordination={"P": 3}, repeat=(4, 7), elevation=29, azimuth=4,
               radii={"P": .40}, colours={"P": [196, 127, 88]},
               sources=[PHOSPHORENE],
               description="Black-phosphorus monolayer. Four-atom basis and constants from Paez et al., PRB 94, 165419 (2016), section II and table I. Two heights form a puckered honeycomb, not a flat graphene lattice.")


def validate(spec):
    basis, cell = spec["basis"], spec["cell"]
    counts, lengths = [], []
    for n, p in enumerate(basis):
        neighbours = []
        for i in range(-2, 3):
            for j in range(-2, 3):
                for m, q in enumerate(basis):
                    d = np.linalg.norm(q + i * cell[0] + j * cell[1] - p)
                    if 1e-7 < d < spec["cutoff"]:
                        neighbours.append((m, d))
        element = spec["elements"][n]
        assert len(neighbours) == spec["coordination"][element], (spec["id"], n, neighbours)
        if spec["id"] != "phosphorene":
            assert all(spec["elements"][m] != element for m, _ in neighbours)
        counts.append({"element": element, "neighbours": len(neighbours)})
        lengths.extend(d for _, d in neighbours)
    lengths = sorted(set(round(d, 4) for d in lengths))
    if spec["id"] == "hbn":
        assert np.all(basis[:, 2] == 0)
    elif spec["id"] == "mos2":
        assert np.allclose(basis[1, :2], basis[2, :2])
        assert np.allclose(basis[:, 2], [0, 1.595, -1.595])
    else:
        assert np.allclose(lengths, [2.224, 2.244], atol=.001)
        assert len(set(basis[:, 2])) == 2
    return dict(periodic_neighbours=counts, nearest_bond_lengths_angstrom=lengths,
                atomic_planes_angstrom=sorted(set(basis[:, 2].tolist())))


def patch(spec):
    positions, elements = [], []
    for i in range(spec["repeat"][0]):
        for j in range(spec["repeat"][1]):
            for element, p in zip(spec["elements"], spec["basis"]):
                positions.append(p + i * spec["cell"][0] + j * spec["cell"][1])
                elements.append(element)
    positions = np.array(positions)
    if spec["id"] == "hbn":
        # Select 19 complete rings from the periodic lattice for a regular hexagonal patch.
        radius = np.linalg.norm(spec["cell"][0]) / np.sqrt(3)
        origin = 3 * spec["cell"].sum(axis=0) + [0, radius, 0]
        centres = np.array([origin + i * spec["cell"][0] + j * spec["cell"][1]
                            for i in range(-2, 3) for j in range(-2, 3)
                            if max(abs(i), abs(j), abs(i - j)) <= 2])
        distances = np.linalg.norm(positions[:, None] - centres[None, :], axis=2)
        keep = np.any(np.isclose(distances, radius, atol=1e-6), axis=1)
        positions, elements = positions[keep], [e for e, k in zip(elements, keep) if k]
    bonds = [(i, j) for i in range(len(positions)) for j in range(i)
             if np.linalg.norm(positions[i] - positions[j]) < spec["cutoff"]]
    return positions, elements, bonds


def render(spec, positions, elements, bonds):
    # Orthographic, z-buffered ball-and-stick rendering with directional lighting.
    # Rendering changes only camera projection, never the relative atomic positions.
    w, h = 1800, 1200
    yy, xx = np.mgrid[:h, :w]
    glow = np.exp(-(((xx - w * .48) / (w * .36)) ** 2 + ((yy - h * .5) / (h * .34)) ** 2))
    pixels = np.array([16, 14, 12], float) + glow[..., None] * np.array([13, 8, 4])
    depth = np.full((h, w), -np.inf)
    az, el = np.radians([spec["azimuth"], spec["elevation"]])
    view = np.array([np.cos(el) * np.cos(az), np.cos(el) * np.sin(az), np.sin(el)])
    right = np.array([-np.sin(az), np.cos(az), 0])
    up = np.cross(view, right)
    camera = (positions - positions.mean(axis=0)) @ np.array([right, up, view]).T
    margin = max(spec["radii"].values()) * 2
    scale = min(w * .86 / (np.ptp(camera[:, 0]) + margin), h * .77 / (np.ptp(camera[:, 1]) + margin))
    camera[:, 0] -= (camera[:, 0].max() + camera[:, 0].min()) / 2
    camera[:, 1] -= (camera[:, 1].max() + camera[:, 1].min()) / 2
    camera *= scale
    camera[:, 0] += w / 2
    camera[:, 1] = h / 2 - camera[:, 1]
    light = np.array([-.45, -.65, .8]); light /= np.linalg.norm(light)
    half = light + [0, 0, 1]; half /= np.linalg.norm(half)

    def sphere(center, radius, colour):
        x, y, z = center
        x0, x1 = max(0, int(x - radius - 1)), min(w, int(x + radius + 2))
        y0, y1 = max(0, int(y - radius - 1)), min(h, int(y + radius + 2))
        gy, gx = np.mgrid[y0:y1, x0:x1]
        nx, ny = (gx - x) / radius, (gy - y) / radius
        r2 = nx * nx + ny * ny
        nz = np.sqrt(np.maximum(0, 1 - r2))
        surface = z + radius * nz
        visible = (r2 <= 1) & (surface > depth[y0:y1, x0:x1])
        diffuse = np.maximum(0, nx * light[0] + ny * light[1] + nz * light[2])
        specular = np.maximum(0, nx * half[0] + ny * half[1] + nz * half[2]) ** 42
        shade = np.array(colour) * (.31 + .69 * diffuse[..., None]) + specular[..., None] * 115
        pixels[y0:y1, x0:x1][visible] = np.minimum(255, shade[visible])
        depth[y0:y1, x0:x1][visible] = surface[visible]

    def cylinder(start, end, radius):
        # Analytic ray/cylinder intersections avoid the bead-like highlights of a sphere sweep.
        axis = end - start
        length = np.linalg.norm(axis)
        axis /= length
        x0, x1 = max(0, int(min(start[0], end[0]) - radius - 1)), min(w, int(max(start[0], end[0]) + radius + 2))
        y0, y1 = max(0, int(min(start[1], end[1]) - radius - 1)), min(h, int(max(start[1], end[1]) + radius + 2))
        gy, gx = np.mgrid[y0:y1, x0:x1]
        dx, dy = gx - start[0], gy - start[1]
        projection = dx * axis[0] + dy * axis[1]
        a = 1 - axis[2] ** 2
        if a < 1e-8:
            return
        b = -2 * projection * axis[2]
        c = dx * dx + dy * dy - projection * projection - radius * radius
        discriminant = b * b - 4 * a * c
        dz = (-b + np.sqrt(np.maximum(0, discriminant))) / (2 * a)
        along = projection + dz * axis[2]
        z = start[2] + dz
        visible = (discriminant >= 0) & (along >= 0) & (along <= length) & (z > depth[y0:y1, x0:x1])
        nx, ny, nz = (dx - along * axis[0]) / radius, (dy - along * axis[1]) / radius, (dz - along * axis[2]) / radius
        diffuse = np.maximum(0, nx * light[0] + ny * light[1] + nz * light[2])
        specular = np.maximum(0, nx * half[0] + ny * half[1] + nz * half[2]) ** 30
        shade = np.array([154, 132, 110]) * (.32 + .68 * diffuse[..., None]) + specular[..., None] * 45
        pixels[y0:y1, x0:x1][visible] = np.minimum(255, shade[visible])
        depth[y0:y1, x0:x1][visible] = z[visible]

    for i, j in bonds:
        cylinder(camera[i], camera[j], scale * .065)
    for element, pos in zip(elements, camera):
        sphere(pos, spec["radii"][element] * scale, spec["colours"][element])
    Image.fromarray(pixels.astype(np.uint8)).resize((1200, 800), Image.Resampling.LANCZOS).save(OUTPUT / f"beyond-{spec['id']}-v2.png", optimize=True)


def main():
    report = {"method": "Deterministic rendering from ideal crystal coordinates; no generated-image atom placement.",
              "units": "angstrom", "limitations": "Finite patches of unrelaxed periodic crystals. Cut edges have missing neighbours. Spheres are display radii, not atomic boundaries. Colours are illustrative.", "materials": []}
    for spec in crystals():
        checks = validate(spec)
        positions, elements, bonds = patch(spec)
        render(spec, positions, elements, bonds)
        xyz = [str(len(positions)), spec["description"]] + [f"{e} {p[0]:.7f} {p[1]:.7f} {p[2]:.7f}" for e, p in zip(elements, positions)]
        (OUTPUT / f"beyond-{spec['id']}-v2.xyz").write_text("\n".join(xyz) + "\n")
        report["materials"].append(dict(id=spec["id"], description=spec["description"], sources=spec["sources"],
            lattice_vectors=spec["cell"].tolist(), unit_cell_basis=spec["basis"].tolist(), unit_cell_elements=spec["elements"],
            validation=checks, rendered_atoms=len(positions), rendered_bonds=len(bonds)))
        print(spec["id"], json.dumps(checks))
    (OUTPUT / "structure-validation.json").write_text(json.dumps(report, indent=2) + "\n")


if __name__ == "__main__":
    main()
