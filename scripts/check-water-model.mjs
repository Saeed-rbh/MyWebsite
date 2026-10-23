import assert from 'node:assert/strict';
import {test} from 'node:test';
import {ANGLE, BOND_LENGTH, BOX, STEP_FS, createWater, advanceWater, evaluateWater, minimumImage, waterContacts, waterObservables} from '../src/pages/Research/waterModel.mjs';

const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected} (tolerance ${tolerance})`);
function transform(state, index, dx = 0, dy = 0, rotation = 0) {
  const next = structuredClone(state), b = next.molecules[index], x = b.x, y = b.y;
  for (const a of next.atoms.filter(a => a.molecule === index)) {
    const px = a.x - x, py = a.y - y;
    a.x = x + dx + px * Math.cos(rotation) - py * Math.sin(rotation);
    a.y = y + dy + px * Math.sin(rotation) + py * Math.cos(rotation);
  }
  b.x += dx; b.y += dy; b.angle += rotation;
  delete next.forces; delete next.potential;
  return next;
}
function checkGeometry(state) {
  for (const [i, j] of state.bonds) close(Math.hypot(state.atoms[j].x - state.atoms[i].x, state.atoms[j].y - state.atoms[i].y), BOND_LENGTH);
  for (let m = 0; m < state.molecules.length; m++) {
    const [o, h1, h2] = state.atoms.slice(m * 3, m * 3 + 3);
    const dot = (h1.x-o.x)*(h2.x-o.x)+(h1.y-o.y)*(h2.y-o.y);
    close(dot / (BOND_LENGTH * BOND_LENGTH), Math.cos(ANGLE));
    close(o.charge + h1.charge + h2.charge, 0);
  }
}

test('thermal initialization sets temperature, removes net momentum, and is reproducible', () => {
  for (const temperature of [150, 300, 600]) {
    const state = createWater(temperature);
    close(waterObservables(state).temperature, temperature);
    close(state.atoms.reduce((sum, a) => sum + a.mass * a.vx, 0), 0);
    close(state.atoms.reduce((sum, a) => sum + a.mass * a.vy, 0), 0);
    checkGeometry(state);
    assert.deepEqual(state, createWater(temperature));
  }
});

test('forces and torques equal negative energy gradients, including the switching region', () => {
  const state = transform(createWater(), 0, .8, .35, .2);
  const {forces} = evaluateWater(state), epsilon = 1e-5;
  for (let m = 0; m < state.molecules.length; m++) {
    for (const [component, delta] of [['x', [epsilon, 0, 0]], ['y', [0, epsilon, 0]], ['torque', [0, 0, epsilon]]]) {
      const high = evaluateWater(transform(state, m, ...delta)).potential;
      const low = evaluateWater(transform(state, m, ...delta.map(d => -d))).potential;
      close(forces[m][component], -(high - low) / (2 * epsilon), 2e-7);
    }
  }
  close(forces.reduce((sum, f) => sum + f.x, 0), 0);
  close(forces.reduce((sum, f) => sum + f.y, 0), 0);
});

test('periodic images leave energies, forces and torques unchanged', () => {
  const state = createWater(), original = evaluateWater(state);
  const shifted = evaluateWater(transform(state, 0, BOX.width, -BOX.height));
  close(shifted.potential, original.potential);
  shifted.forces.forEach((f, i) => ['x', 'y', 'torque'].forEach(k => close(f[k], original.forces[i][k])));
});

test('velocity-Verlet is time reversible, including periodic crossings', () => {
  let state = createWater();
  state = transform(state, 0, 13.95, 0);
  const initial = structuredClone(state);
  for (let i = 0; i < 400; i++) state = advanceWater(state);
  state.molecules.forEach(b => { b.vx *= -1; b.vy *= -1; b.omega *= -1; });
  for (let i = 0; i < 400; i++) state = advanceWater(state);
  state.molecules.forEach((b, i) => {
    const a = initial.molecules[i];
    close(minimumImage(b.x - a.x, BOX.width), 0, 1e-7);
    close(minimumImage(b.y - a.y, BOX.height), 0, 1e-7);
    close(minimumImage(b.angle - a.angle, 2 * Math.PI), 0, 1e-7);
    close(b.vx, -a.vx, 1e-9); close(b.vy, -a.vy, 1e-9); close(b.omega, -a.omega, 1e-9);
  });
});

test('geometry, momentum and energy remain stable for 20,000 steps at each starting temperature', () => {
  for (const temperature of [150, 300, 600]) {
    let state = createWater(temperature), maximumDrift = 0;
    for (let i = 0; i < 20000; i++) {
      state = advanceWater(state);
      maximumDrift = Math.max(maximumDrift, Math.abs(waterObservables(state).driftPerMolecule));
      if (i % 200 === 0) checkGeometry(state);
      assert.ok(state.molecules.every(b => b.x >= 0 && b.x < BOX.width && b.y >= 0 && b.y < BOX.height));
    }
    close(state.timeFs, 10000);
    checkGeometry(state);
    close(state.atoms.reduce((sum, a) => sum + a.mass * a.vx, 0), 0, 1e-8);
    close(state.atoms.reduce((sum, a) => sum + a.mass * a.vy, 0), 0, 1e-8);
    assert.ok(maximumDrift < .01, `${temperature} K maximum energy error ${maximumDrift} kJ/mol per molecule`);
    console.log(`${temperature} K: maximum energy error ${maximumDrift.toFixed(6)} kJ/mol per molecule over 10 ps`);
  }
});

test('halving the timestep reduces maximum energy error', () => {
  const errors = [STEP_FS, STEP_FS / 2].map(dt => {
    let state = createWater(), error = 0;
    for (let i = 0; i < 500 / dt; i++) {
      state = advanceWater(state, dt);
      error = Math.max(error, Math.abs(waterObservables(state).driftPerMolecule));
    }
    return error;
  });
  assert.ok(errors[1] < errors[0] * .35, `energy errors: ${errors}`);
});

test('hydrogen-bond guides use the nearest periodic acceptor and reject wrong angles', () => {
  let state = createWater();
  state.molecules = state.molecules.slice(0, 2); state.atoms = state.atoms.slice(0, 6);
  state = transform(state, 0, 0, 0, Math.PI - ANGLE / 2);
  state = transform(state, 0, .4 - state.atoms[0].x, 6 - state.atoms[0].y);
  state = transform(state, 1, 14 - state.atoms[3].x, 6 - state.atoms[3].y);
  assert.deepEqual(waterContacts(state).find(([i]) => i === 1), [1, 3, -BOX.width, 0]);
  state = transform(state, 0, 0, 0, Math.PI / 2);
  assert.equal(waterContacts(state).find(([i]) => i === 1), undefined);
});
