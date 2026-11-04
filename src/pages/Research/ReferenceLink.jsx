import React, { useEffect, useId, useState } from 'react';
import styles from './GrapheneArticle.module.css';

function softlyNavigate(event, target) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !target) return false;
  event.preventDefault();
  target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  target.focus({ preventScroll: true });
  window.history.replaceState(null, '', `#${target.id}`);
  return true;
}

// Remember the exact occurrence, including when several citations share a source.
export default function ReferenceLink({ number, children, ...props }) {
  const citationId = `citation-${useId()}`;
  const id = `reference-${number}`;
  function navigate(event) {
    if (softlyNavigate(event, document.getElementById(id))) {
      window.dispatchEvent(new CustomEvent('article-citation-selected', { detail: { number, citationId } }));
    }
  }
  return <a {...props} id={citationId} href={`#${id}`} onClick={navigate}>{children ?? `[${number}]`}</a>;
}

export function BackToText({ number }) {
  const [citationId, setCitationId] = useState(null);
  useEffect(() => {
    setCitationId(document.querySelector(`a[href="#reference-${number}"]`)?.id || null);
    const select = event => {
      if (event.detail.number === number) setCitationId(event.detail.citationId);
    };
    window.addEventListener('article-citation-selected', select);
    return () => window.removeEventListener('article-citation-selected', select);
  }, [number]);
  if (!citationId) return null;
  return <a className={styles.backToText} href={`#${citationId}`} aria-label={`Back to text citing reference ${number}`} onClick={event => softlyNavigate(event, document.getElementById(citationId))}>Back to text ↑</a>;
}
