// Pointy-top honeycomb with unit bond length, matching the original model's
// central hexagon and its six surrounding cells. Growth adds columns at both ends.
export function buildExtendedLattice(extraColumns = 0, extraRows = 0) {
  const points = [], bonds = [], keys = new Map(), edges = new Set();
  const vertexKey = (x, z) => `${Math.round(x * 10000)},${Math.round(z * 10000)}`;
  const baseKeys = new Set();
  function addCells(extension, rows, collectBase) {
    for (let r = -1 - rows; r <= 1 + rows; r++) {
      for (let q = -2 - extension - rows; q <= 2 + extension + rows; q++) {
        if (Math.abs(2 * q + r) > 2 + 2 * extension - Math.abs(r % 2)) continue;
        const ring = [];
        for (let k = 0; k < 6; k++) {
          const angle = Math.PI / 6 + k * Math.PI / 3;
          const x = Math.sqrt(3) * (q + r / 2) + Math.cos(angle);
          const z = 1.5 * r + Math.sin(angle);
          const key = vertexKey(x, z);
          if (collectBase) { baseKeys.add(key); continue; }
          if (!keys.has(key)) { keys.set(key, points.length); points.push({ position: [x, 0, z], original: baseKeys.has(key) }); }
          ring.push(keys.get(key));
        }
        if (collectBase) continue;
        ring.forEach((a, i) => {
          const b = ring[(i + 1) % 6], key = [a, b].sort((a, b) => a - b).join(',');
          if (!edges.has(key)) { edges.add(key); bonds.push([a, b]); }
        });
      }
    }
  }
  addCells(0, 0, true);
  addCells(extraColumns, extraRows, false);
  return { points, bonds, addedAtoms: points.filter(p => !p.original), addedBonds: bonds.filter(([a, b]) => !points[a].original || !points[b].original) };
}
