import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

export default function useSimulationPlayback() {
  const playbackRef = useRef(null);
  const visible = useInView(playbackRef, { amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const [running, setRunning] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [foreground, setForeground] = useState(() => !document.hidden);

  useEffect(() => {
    if (reduceMotion) setRunning(false);
  }, [reduceMotion]);

  useEffect(() => {
    const update = () => setForeground(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return { playbackRef, running, setRunning, active: running && visible && foreground };
}
