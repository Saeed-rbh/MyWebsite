import { useEffect } from 'react';

// Ease wheel input on the article's real scroll container, so scroll-linked
// animation and browser history continue to use the native scroll position.
export default function useSoftScroll(root) {
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let target = page.scrollTop;
    let lastTime = 0;
    let written = page.scrollTop;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      target = page.scrollTop;
    };
    const tick = time => {
      // Anchor jumps and other native scrolling take priority over momentum.
      if (Math.abs(page.scrollTop - written) > 2) { stop(); return; }
      const elapsed = Math.min(time - lastTime, 48);
      lastTime = time;
      target = Math.max(0, Math.min(target, page.scrollHeight - page.clientHeight));
      const remaining = target - page.scrollTop;
      const next = Math.abs(remaining) < .5 ? target : page.scrollTop + remaining * (1 - Math.exp(-elapsed / 95));
      const previous = page.scrollTop;
      page.scrollTop = next;
      // Some browsers round scroll offsets to whole pixels. Finish the tail.
      if (page.scrollTop === previous && elapsed > 0) page.scrollTop = target;
      written = page.scrollTop;
      if (Math.abs(target - written) < .5) { frame = 0; return; }
      frame = requestAnimationFrame(tick);
    };
    const wheel = event => {
      if (reduced.matches || event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      // Keep zoomable models and nested scrolling panels under native control.
      for (let node = event.target instanceof Element ? event.target : null; node && node !== page; node = node.parentElement) {
        if (node.matches('canvas, input, textarea, select, [contenteditable="true"]') ||
            (/(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight + 1)) { stop(); return; }
      }
      const delta = event.deltaY * (event.deltaMode === 1 ? 20 : event.deltaMode === 2 ? page.clientHeight : 1);
      if (!delta) return;
      event.preventDefault();
      if (!frame || Math.sign(delta) !== Math.sign(target - page.scrollTop)) target = page.scrollTop;
      target = Math.max(0, Math.min(target + delta, page.scrollHeight - page.clientHeight));
      if (!frame) {
        written = page.scrollTop;
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    page.addEventListener('wheel', wheel, { passive: false });
    page.addEventListener('pointerdown', stop, { passive: true });
    page.addEventListener('touchstart', stop, { passive: true });
    page.addEventListener('keydown', stop);
    reduced.addEventListener('change', stop);
    return () => {
      stop();
      page.removeEventListener('wheel', wheel);
      page.removeEventListener('pointerdown', stop);
      page.removeEventListener('touchstart', stop);
      page.removeEventListener('keydown', stop);
      reduced.removeEventListener('change', stop);
    };
  }, [root]);
}
