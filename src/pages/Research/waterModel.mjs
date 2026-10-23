// Planar rigid-water teaching model. TIP3P (original) geometry/site parameters,
// with a finite, molecule-switched periodic interaction (not bulk TIP3P/PME).
// Units: angstrom, femtosecond, atomic mass unit, kcal/mol, elementary charge.
export const BOX = { width: 16, height: 12 };
export const ANGLE = 104.52 * Math.PI / 180;
export const BOND_LENGTH = 0.9572;
export const STEP_FS = 0.5;
const MASS_O = 15.9994, MASS_H = 1.008, MASS = MASS_O + 2 * MASS_H;
const ACCEL = 4.184e-4, KB = 0.00198720426, COULOMB = 332.06371;
const SIGMA = 3.1507, EPSILON = 0.1521;
const SWITCH_ON = 4.5, CUTOFF = 5.5;
const c = BOND_LENGTH * Math.cos(ANGLE / 2), h = BOND_LENGTH * Math.sin(ANGLE / 2);
const shift = 2 * MASS_H * c / MASS;
const LOCAL = [[-shift, 0, MASS_O, -.834, 'O'], [c-shift, h, MASS_H, .417, 'H'], [c-shift, -h, MASS_H, .417, 'H']];
const INERTIA = LOCAL.reduce((sum, [x,y,m]) => sum + m*(x*x+y*y), 0);
export const minimumImage = (d, length) => d - length * Math.round(d / length);
const wrap = (x, length) => ((x % length) + length) % length;
function sites(molecules) {
  return molecules.flatMap((b, molecule) => LOCAL.map(([x,y,mass,charge,element]) => {
    const dx=x*Math.cos(b.angle)-y*Math.sin(b.angle), dy=x*Math.sin(b.angle)+y*Math.cos(b.angle);
    return {x:b.x+dx,y:b.y+dy,vx:b.vx-b.omega*dy,vy:b.vy+b.omega*dx,mass,charge,element,molecule};
  }));
}
function gaussianGenerator(seed) {
  let value=seed>>>0;
  const uniform=()=>{value=(Math.imul(1664525,value)+1013904223)>>>0;return (value+.5)/4294967296;};
  return ()=>Math.sqrt(-2*Math.log(uniform()))*Math.cos(2*Math.PI*uniform());
}
export function createWater(temperature=300, seed=78121) {
  const gaussian=gaussianGenerator(seed);
  const molecules=Array.from({length:12},(_,m)=>({
    x:2+(m%4)*4,y:2+Math.floor(m/4)*4,angle:m*2.4,
    vx:gaussian()*Math.sqrt(ACCEL*KB*temperature/MASS),
    vy:gaussian()*Math.sqrt(ACCEL*KB*temperature/MASS),
    omega:gaussian()*Math.sqrt(ACCEL*KB*temperature/INERTIA),
  }));
  const vx=molecules.reduce((sum,b)=>sum+b.vx,0)/molecules.length;
  const vy=molecules.reduce((sum,b)=>sum+b.vy,0)/molecules.length;
  molecules.forEach(b=>{b.vx-=vx;b.vy-=vy;});
  const kinetic=molecules.reduce((sum,b)=>sum+(MASS*(b.vx*b.vx+b.vy*b.vy)+INERTIA*b.omega*b.omega)/(2*ACCEL),0);
  const scale=Math.sqrt((3*molecules.length-2)*KB*temperature/(2*kinetic));
  molecules.forEach(b=>{b.vx*=scale;b.vy*=scale;b.omega*=scale;});
  const state={molecules,atoms:sites(molecules),bonds:molecules.flatMap((_,m)=>[[m*3,m*3+1,BOND_LENGTH],[m*3,m*3+2,BOND_LENGTH]]),steps:0,timeFs:0};
  const evaluation=evaluateWater(state);
  state.forces=evaluation.forces;state.potential=evaluation.potential;
  state.initialEnergy=waterObservables(state).total;
  return state;
}
// Quintic switching is applied to the entire neutral molecule-pair energy.
// The derivative contributes a COM force; omitting it would violate energy conservation.
export function evaluateWater(state) {
  const f=state.atoms.map(()=>({x:0,y:0}));
  const extra=state.molecules.map(()=>({x:0,y:0}));
  let potential=0;
  for(let m=0;m<state.molecules.length;m++) for(let n=m+1;n<state.molecules.length;n++) {
    const a=state.molecules[m],b=state.molecules[n];
    const dx=minimumImage(b.x-a.x,BOX.width),dy=minimumImage(b.y-a.y,BOX.height),r=Math.hypot(dx,dy);
    if(r>=CUTOFF)continue;
    const offsetX=dx-(b.x-a.x),offsetY=dy-(b.y-a.y);
    const t=Math.max(0,(r-SWITCH_ON)/(CUTOFF-SWITCH_ON));
    const sw=1-10*t**3+15*t**4-6*t**5;
    const derivative=(-30*t*t+60*t**3-30*t**4)/(CUTOFF-SWITCH_ON);
    let pairEnergy=0;
    for(let k=0;k<3;k++)for(let l=0;l<3;l++) {
      const i=3*m+k,j=3*n+l,ai=state.atoms[i],aj=state.atoms[j];
      const sx=aj.x+offsetX-ai.x,sy=aj.y+offsetY-ai.y,r2=sx*sx+sy*sy,d=Math.sqrt(r2);
      if(d<.2)throw new Error('Atoms overlapped; reset the simulation.');
      const charge=COULOMB*ai.charge*aj.charge;
      let energy=charge/d, coefficient=-charge/(r2*d);
      if(k===0&&l===0){const sr6=(SIGMA/d)**6;energy+=4*EPSILON*(sr6*sr6-sr6);coefficient+=24*EPSILON*(sr6-2*sr6*sr6)/r2;}
      pairEnergy+=energy;
      const fx=sw*coefficient*sx,fy=sw*coefficient*sy;
      f[i].x+=fx;f[i].y+=fy;f[j].x-=fx;f[j].y-=fy;
    }
    potential+=sw*pairEnergy;
    const correction=derivative*pairEnergy/r;
    extra[m].x+=correction*dx;extra[m].y+=correction*dy;
    extra[n].x-=correction*dx;extra[n].y-=correction*dy;
  }
  const forces=state.molecules.map((b,m)=>{
    let x=extra[m].x,y=extra[m].y,torque=0;
    for(let k=0;k<3;k++){const i=m*3+k,a=state.atoms[i];x+=f[i].x;y+=f[i].y;torque+=(a.x-b.x)*f[i].y-(a.y-b.y)*f[i].x;}
    return {x,y,torque};
  });
  return {forces,potential};
}
export function advanceWater(state,dt=STEP_FS) {
  const before=state.forces??evaluateWater(state).forces;
  const molecules=state.molecules.map((b,i)=>{
    const vx=b.vx+ACCEL*before[i].x/MASS*dt/2,vy=b.vy+ACCEL*before[i].y/MASS*dt/2;
    const omega=b.omega+ACCEL*before[i].torque/INERTIA*dt/2;
    return {...b,vx,vy,omega,x:wrap(b.x+vx*dt,BOX.width),y:wrap(b.y+vy*dt,BOX.height),angle:(b.angle+omega*dt)%(2*Math.PI)};
  });
  const next={...state,molecules,atoms:sites(molecules),steps:state.steps+1,timeFs:state.timeFs+dt};
  const after=evaluateWater(next);
  molecules.forEach((b,i)=>{b.vx+=ACCEL*after.forces[i].x/MASS*dt/2;b.vy+=ACCEL*after.forces[i].y/MASS*dt/2;b.omega+=ACCEL*after.forces[i].torque/INERTIA*dt/2;});
  next.atoms=sites(molecules);next.forces=after.forces;next.potential=after.potential;
  return next;
}
export function waterObservables(state) {
  const kinetic=state.molecules.reduce((sum,b)=>sum+(MASS*(b.vx*b.vx+b.vy*b.vy)+INERTIA*b.omega*b.omega)/(2*ACCEL),0);
  const potential=state.potential??evaluateWater(state).potential;
  const total=kinetic+potential;
  return {kinetic,potential,total,temperature:2*kinetic/((3*state.molecules.length-2)*KB),driftPerMolecule:4.184*(total-(state.initialEnergy??total))/state.molecules.length};
}
export function waterContacts(state) {
  const candidates=[];
  state.atoms.forEach((h,i)=>{if(h.element!=='H')return;const donor=state.atoms[h.molecule*3];state.atoms.forEach((o,j)=>{
    if(o.element!=='O'||o.molecule===h.molecule)return;
    const donorCom=state.molecules[h.molecule],acceptorCom=state.molecules[o.molecule];
    const ox=minimumImage(acceptorCom.x-donorCom.x,BOX.width)-(acceptorCom.x-donorCom.x);
    const oy=minimumImage(acceptorCom.y-donorCom.y,BOX.height)-(acceptorCom.y-donorCom.y);
    const ux=h.x-donor.x,uy=h.y-donor.y,vx=o.x+ox-h.x,vy=o.y+oy-h.y,d=Math.hypot(vx,vy);
    const oo=Math.hypot(o.x+ox-donor.x,o.y+oy-donor.y),cos=(ux*vx+uy*vy)/(Math.hypot(ux,uy)*d);
    if(oo<3.5&&d<2.5&&cos>Math.cos(Math.PI/6))candidates.push({i,j,d,ox,oy});
  });});
  const used=new Set();return candidates.sort((a,b)=>a.d-b.d).filter(({i})=>{if(used.has(i))return false;used.add(i);return true;}).map(({i,j,ox,oy})=>[i,j,ox,oy]);
}
