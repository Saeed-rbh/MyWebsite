import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import s from './GrapheneArticle.module.css';

export default function AtomsStoryNavigation({ chapters, active, navigate, groupTitles = ['Understand the model', 'Follow the evidence', 'Keep exploring'] }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null), trigger = useRef(null);
  const reduced = useReducedMotion();
  const index = Math.max(0, chapters.findIndex(chapter => chapter.id === active));
  useEffect(() => {
    if (!open) return;
    const dismiss = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    const escape = event => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <nav ref={root} className={`${s.contents} ${s.storyNavigation}`} aria-label="In this story" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <div className={s.storyRail}><div className={s.railWindow} style={{height:(index === 0 || index === chapters.length - 1 ? 2 : 3)*72}}><motion.ol className={s.railChapters} initial={false} animate={{y:-Math.max(0,Math.min(chapters.length-2,index-1))*72}} transition={{duration:reduced ? 0 : .5}}>{chapters.map((chapter,i) => <li key={chapter.id} aria-hidden={Math.abs(i-index)>1 || undefined} data-visited={i<index || undefined}><a href={`#${chapter.id}`} tabIndex={Math.abs(i-index)>1 ? -1 : 0} aria-current={active===chapter.id ? 'location' : undefined} onClick={event => {event.preventDefault();navigate(chapter.id);}}><span className={s.railMarker} aria-hidden="true"/><span className={s.railNumber}>{chapter.number}</span><span className={s.railLinkText}>{chapter.nav}</span></a></li>)}</motion.ol></div></div>
    <button ref={trigger} className={s.storyTrigger} type="button" aria-expanded={open} aria-controls="atoms-story-index" onClick={() => setOpen(value=>!value)}><span className={s.storyTriggerCopy}><span className={s.storyCurrent}>{chapters[index].nav}</span></span><span className={s.storyPosition}>{String(index+1).padStart(2,'0')} / {chapters.length}</span><svg className={s.storyChevron} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5"/></svg></button>
    <div className={s.storyPanel} id="atoms-story-index" hidden={!open}><div className={s.storyGroups}>{[[groupTitles[0],chapters.slice(0,3)],[groupTitles[1],chapters.slice(3,6)],[groupTitles[2],chapters.slice(6)]].map(([title,items])=><section key={title} aria-label={title}><h2>{title}</h2><ol>{items.map(chapter=><li key={chapter.id}><a href={`#${chapter.id}`} aria-current={chapter.id===active ? 'location' : undefined} onClick={event=>{event.preventDefault();navigate(chapter.id);setOpen(false);trigger.current?.focus({preventScroll:true});}}><span className={s.storyItemMarker}>{chapter.number}</span><span>{chapter.nav}</span></a></li>)}</ol></section>)}</div></div>
  </nav>;
}
