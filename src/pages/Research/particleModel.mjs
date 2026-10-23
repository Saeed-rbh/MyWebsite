// Two-dimensional, monatomic Lennard–Jones teaching systems in reduced units.
// m = sigma = epsilon = kB = 1. The force-shifted cutoff is continuous in U and F.
export const PARTICLE_STEP = 0.002;
export const CUTOFF = 2.5;
export const nearestImage = (d, length) => d - length * Math.round(d / length);
const wrap = (x, length) => ((x % length) + length) % length;
const cutoffEnergy = 4 * (CUTOFF ** -12 - CUTOFF ** -6);
const cutoffSlope = 24 * (CUTOFF ** -7 - 2 * CUTOFF ** -13);

export function pairInteraction(r) {
  if (r >= CUTOFF) return {energy: 0, derivative: 0};
  if (r < 0.2) throw new Error('Atoms approached too closely. Reset the model.');
  const sixth = r ** -6;
  return {
    energy: 4 * (sixth * sixth - sixth) - cutoffEnergy - (r - CUTOFF) * cutoffSlope,
    derivative: 24 * (sixth - 2 * sixth * sixth) / r - cutoffSlope,
  };
}

export function evaluateParticles(state) {
  const forces = state.atoms.map(() => ({x: 0, y: 0}));
  let potential = 0;
  for (let i = 0; i < state.atoms.length; i++) for (let j = i + 1; j < state.atoms.length; j++) {
    const a = state.atoms[i], b = state.atoms[j];
    const dx = nearestImage(b.x - a.x, state.box.width), dy = nearestImage(b.y - a.y, state.box.height);
    const r = Math.hypot(dx, dy);
    if (r >= CUTOFF) continue;
    const pair = pairInteraction(r), coefficient = pair.derivative / r;
    potential += pair.energy;
    forces[i].x += coefficient * dx; forces[i].y += coefficient * dy;
    forces[j].x -= coefficient * dx; forces[j].y -= coefficient * dy;
  }
  return {forces, potential};
}

export function particleObservables(state) {
  const kinetic = state.atoms.reduce((sum, a) => sum + (a.vx * a.vx + a.vy * a.vy) / 2, 0);
  const potential = state.potential ?? evaluateParticles(state).potential;
  const total = kinetic + potential, n = state.atoms.length;
  const msd = state.atoms.reduce((sum, a) => sum + (a.ux - a.x0) ** 2 + (a.uy - a.y0) ** 2, 0) / n;
  return {kinetic, potential, total, temperature: kinetic / (n - 1), rmsDisplacement: Math.sqrt(msd), energyError: (total - (state.initialEnergy ?? total)) / n};
}

export function createParticles({kind = 'solid', temperature = kind === 'solid' ? .08 : 1.5, vacancy = false, compressed = false, seed = 73021} = {}) {
  if (!['solid', 'gas'].includes(kind) || !Number.isFinite(temperature) || temperature <= 0) throw new Error('Choose a valid system and a positive temperature.');
  const spacing = 1.12;
  const box = kind === 'solid' ? {width: 8 * spacing, height: 6 * spacing * Math.sqrt(3) / 2} : {width: compressed ? 12 : 16, height: compressed ? 7.5 : 10};
  const count = kind === 'solid' ? 48 : 24;
  let randomState = seed >>> 0;
  const random = () => { randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0; return (randomState + .5) / 4294967296; };
  const gaussian = () => Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random());
  const atoms = Array.from({length: count}, (_, i) => {
    const row = Math.floor(i / (kind === 'solid' ? 8 : 6)), col = i % (kind === 'solid' ? 8 : 6);
    const x = kind === 'solid' ? (col + .25 + (row % 2) / 2) * spacing : (col + .5) * box.width / 6;
    const y = kind === 'solid' ? (row + .5) * spacing * Math.sqrt(3) / 2 : (row + .5) * box.height / 4;
    return {id: i, x, y, ux: x, uy: y, x0: x, y0: y, vx: gaussian() * Math.sqrt(temperature), vy: gaussian() * Math.sqrt(temperature)};
  }).filter(a => !(kind === 'solid' && vacancy && a.id === 28));
  const meanX = atoms.reduce((sum, a) => sum + a.vx, 0) / atoms.length, meanY = atoms.reduce((sum, a) => sum + a.vy, 0) / atoms.length;
  atoms.forEach(a => { a.vx -= meanX; a.vy -= meanY; });
  const kinetic = atoms.reduce((sum, a) => sum + (a.vx * a.vx + a.vy * a.vy) / 2, 0);
  const scale = Math.sqrt((atoms.length - 1) * temperature / kinetic);
  atoms.forEach(a => { a.vx *= scale; a.vy *= scale; });
  const state = {kind, box, atoms, temperature, vacancy, compressed, steps: 0, time: 0};
  Object.assign(state, evaluateParticles(state));
  state.initialEnergy = particleObservables(state).total;
  return state;
}

export function advanceParticles(state, dt = PARTICLE_STEP) {
  const before = state.forces ?? evaluateParticles(state).forces;
  const atoms = state.atoms.map((a, i) => {
    const vx = a.vx + before[i].x * dt / 2, vy = a.vy + before[i].y * dt / 2;
    return {...a, vx, vy, ux: a.ux + vx * dt, uy: a.uy + vy * dt, x: wrap(a.x + vx * dt, state.box.width), y: wrap(a.y + vy * dt, state.box.height)};
  });
  const next = {...state, atoms, steps: state.steps + 1, time: state.time + dt};
  const after = evaluateParticles(next);
  atoms.forEach((a, i) => { a.vx += after.forces[i].x * dt / 2; a.vy += after.forces[i].y * dt / 2; });
  return {...next, ...after};
}
