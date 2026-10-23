import assert from 'node:assert/strict';
import {test} from 'node:test';
import {CUTOFF, PARTICLE_STEP, pairInteraction, createParticles, advanceParticles, evaluateParticles, particleObservables, nearestImage} from '../src/pages/Research/particleModel.mjs';
const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}; tolerance ${tolerance}`);

test('the cutoff is continuous in energy and force, with forces matching the energy gradient', () => {
  assert.deepEqual(pairInteraction(CUTOFF), {energy: 0, derivative: 0});
  assert.ok(Math.abs(pairInteraction(CUTOFF - 1e-6).energy) < 1e-10);
  assert.ok(Math.abs(pairInteraction(CUTOFF - 1e-6).derivative) < 1e-6);
  for (const r of [.95, 1.12, 1.8, 2.49]) {
    const h = 1e-6;
    close(pairInteraction(r).derivative, (pairInteraction(r + h).energy - pairInteraction(r - h).energy) / (2 * h), 1e-6);
  }
});

test('thermal starts have the requested kinetic temperature and no net momentum', () => {
  for (const kind of ['solid', 'gas']) for (const changed of [false, true]) {
    const state = createParticles({kind, temperature: kind === 'solid' ? .08 : 1.5, vacancy: changed, compressed: changed});
    close(particleObservables(state).temperature, state.temperature);
    close(state.atoms.reduce((sum, a) => sum + a.vx, 0), 0);
    close(state.atoms.reduce((sum, a) => sum + a.vy, 0), 0);
    close(particleObservables(state).rmsDisplacement, 0);
    assert.deepEqual(state, createParticles({kind, temperature: state.temperature, vacancy: changed, compressed: changed}));
  }
});

test('the vacancy removes one central lattice site and gas compression increases density', () => {
  const perfect = createParticles(), vacancy = createParticles({vacancy: true});
  assert.equal(perfect.atoms.length, 48); assert.equal(vacancy.atoms.length, 47);
  assert.equal(vacancy.atoms.find(a => a.id === 28), undefined);
  assert.ok(evaluateParticles(vacancy).forces.some(f => Math.hypot(f.x, f.y) > .01));
  const roomy = createParticles({kind: 'gas'}), dense = createParticles({kind: 'gas', compressed: true});
  assert.equal(roomy.atoms.length, dense.atoms.length);
  assert.ok(dense.box.width * dense.box.height < roomy.box.width * roomy.box.height);
});

test('pair forces obey Newton’s third law and are invariant to periodic images', () => {
  const state = createParticles(), result = evaluateParticles(state);
  close(result.forces.reduce((sum, f) => sum + f.x, 0), 0);
  close(result.forces.reduce((sum, f) => sum + f.y, 0), 0);
  const image = structuredClone(state); image.atoms[0].x += state.box.width; image.atoms[0].y -= state.box.height;
  const shifted = evaluateParticles(image);
  close(result.potential, shifted.potential);
  shifted.forces.forEach((f, i) => { close(f.x, result.forces[i].x); close(f.y, result.forces[i].y); });
});

test('velocity-Verlet is time reversible', () => {
  const original = createParticles({kind: 'gas'});
  let state = original;
  for (let i = 0; i < 500; i++) state = advanceParticles(state);
  state.atoms.forEach(a => { a.vx *= -1; a.vy *= -1; });
  for (let i = 0; i < 500; i++) state = advanceParticles(state);
  state.atoms.forEach((a, i) => {
    close(nearestImage(a.x - original.atoms[i].x, state.box.width), 0, 1e-8);
    close(nearestImage(a.y - original.atoms[i].y, state.box.height), 0, 1e-8);
    close(a.vx, -original.atoms[i].vx, 1e-8); close(a.vy, -original.atoms[i].vy, 1e-8);
  });
});

test('displacement tracks travel across periodic boundaries without jumping', () => {
  let state = createParticles({kind: 'gas'});
  state.atoms = [state.atoms[0], state.atoms[10]].map((a, i) => ({...a, x: i ? 8 : 15.999, y: 5, ux: i ? 8 : 15.999, uy: 5, x0: i ? 8 : 15.999, y0: 5, vx: i ? 0 : 1, vy: 0}));
  delete state.forces; delete state.potential;
  state = advanceParticles(state);
  assert.ok(state.atoms[0].x < .01);
  close(state.atoms[0].ux, 16.001);
  close(particleObservables(state).rmsDisplacement, PARTICLE_STEP / Math.sqrt(2));
});

test('solid atoms stay localized while dilute gas atoms travel, with stable energy and momentum', () => {
  const cases = [{kind: 'solid', temperature: .03}, {kind: 'solid', temperature: .16}, {kind: 'solid', temperature: .16, vacancy: true}, {kind: 'gas', temperature: .75}, {kind: 'gas', temperature: 3}, {kind: 'gas', temperature: 3, compressed: true}];
  for (const options of cases) {
    let state = createParticles(options), maxError = 0;
    for (let i = 0; i < 10000; i++) {
      state = advanceParticles(state);
      maxError = Math.max(maxError, Math.abs(particleObservables(state).energyError));
      assert.ok(state.atoms.every(a => Number.isFinite(a.vx) && Number.isFinite(a.vy) && a.x >= 0 && a.x < state.box.width && a.y >= 0 && a.y < state.box.height));
    }
    assert.ok(maxError < .003, `${JSON.stringify(options)} energy error ${maxError}`);
    close(state.atoms.reduce((sum, a) => sum + a.vx, 0), 0, 1e-8);
    close(state.atoms.reduce((sum, a) => sum + a.vy, 0), 0, 1e-8);
    const rms = particleObservables(state).rmsDisplacement;
    assert.ok(options.kind === 'solid' ? rms < .3 : rms > 2, `${options.kind} displacement ${rms}`);
    console.log(`${JSON.stringify(options)}: max energy error ${maxError.toExponential(2)} ε/atom, RMS displacement ${rms.toFixed(3)} σ`);
  }
});
