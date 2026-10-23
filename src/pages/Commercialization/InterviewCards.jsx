import React, { useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import HalftonePortrait from './HalftonePortrait';
import s from './InterviewCards.module.css';

const insights = [
  ['Scalable production', 'Customers need a process that can grow with demand. Scale-up must preserve useful material performance as production expands.'],
  ['Affordable cost', 'Cost needs to fit the intended application. The commercial case depends on producing useful material at a price customers can adopt.'],
  ['Consistent quality', 'Customers need dependable material specifications. Consistent output and application-level benchmarks are central to qualification.'],
  ['Industrial volume', 'Promising lab results need to translate into reliable supply. Customers require enough usable material to support their production needs.'],
];
const portraits = [
  'executive-portrait-cutout.png',
  'interview-executive-woman.png',
  'interview-executive-man.png',
  'interview-executive-woman-2.png',
];

export default function InterviewCards({ root }) {
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const viewport = useRef(null);
  const reduce = useReducedMotion();
  const visible = useInView(viewport, { root, amount: .2 });
  const stopped = paused || hovered || focused || reduce || !visible;
  const cards = duplicate => <div className={s.group} aria-hidden={duplicate || undefined} key={String(duplicate)}>
    {insights.map(([title, text], i) => <article key={title} className={s.card}>
      <div className={s.portrait}><HalftonePortrait src={`/images/commercialization/${portraits[i]}`} className={s.person} playing={!stopped}/></div>
      <div className={s.copy}><span className={s.label}>Interview summary / 0{i + 1}</span><h3>{title}</h3><p>{text}</p><span className={s.source}>Customer discovery · Interview synthesis</span></div>
    </article>)}
  </div>;
  return <div className={s.carousel} role="region" aria-label="Customer interview findings">
    <div className={s.controls}>
      <span>Four perspectives from customer discovery</span>
      {!reduce && <button type="button" className={s.pause} aria-label={paused ? 'Play interview cards' : 'Pause interview cards'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▷' : 'Ⅱ'}</button>}
    </div>
    <div ref={viewport} className={s.viewport} tabIndex={0} aria-label="Interview summaries. Movement pauses while focused." onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
      <div className={s.track} data-paused={stopped}>
        {cards(false)}
        {!reduce && cards(true)}
      </div>
    </div>
    <p className={s.caption}>Four recurring themes from 40+ interviews. Summaries, not direct quotations.</p>
  </div>;
}
