import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

// Retain photographic facial planes at low resolution. Coarse sampling and
// gently altered proportions obscure fine detail without flattening the face.
// Only the visible, selected portrait runs an animation loop.
export default function HalftonePortrait({ src, playing, className }) {
  const canvas = useRef(null);
  const onScreen = useInView(canvas, { amount: .1 });
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (failed) return;
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) { setFailed(true); return; }
    let frame = 0;
    let cancelled = false;
    let previous = 0;
    let started = 0;
    let render;
    const image = new Image();
    const width = 240;
    const height = 330;
    image.onload = () => {
      if (cancelled) return;
      const buffer = document.createElement('canvas');
      buffer.width = width;
      buffer.height = height;
      const source = buffer.getContext('2d', { willReadFrequently: true });
      if (!source) { setFailed(true); return; }
      const scale = Math.max(width / image.width, height / image.height);
      source.drawImage(image, (width - image.width * scale) / 2, (height - image.height * scale) / 2, image.width * scale, image.height * scale);
      const pixels = source.getImageData(0, 0, width, height).data;
      // Downsample before drawing dots: retain natural eye sockets, nose and
      // mouth shadows, while discarding skin texture and small facial details.
      const thumbnail = document.createElement('canvas');
      thumbnail.width = 40;
      thumbnail.height = 55;
      const small = thumbnail.getContext('2d');
      if (!small) { setFailed(true); return; }
      small.drawImage(buffer, 0, 0, 40, 55);
      source.clearRect(0, 0, width, height);
      source.imageSmoothingEnabled = true;
      source.imageSmoothingQuality = 'high';
      source.drawImage(thumbnail, 0, 0, width, height);
      const softened = source.getImageData(0, 0, width, height).data;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      render = time => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#16345d';
        const angle = Math.sin(time * .55) * .009;
        const breath = Math.sin(time * .8) * .65;
        for (let y = 3; y < height; y += 5.5) {
          for (let x = 3; x < width; x += 5.5) {
            const head = Math.max(0, Math.min(1, (250 - y) / 65));
            const sx = Math.round(x + ((y - 185) * angle + Math.sin(time * .4) * .65) * head);
            const sy = Math.round(y - (x - 120) * angle * head + breath);
            if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;
            const offset = (sy * width + sx) * 4;
            const alpha = pixels[offset + 3] / 255;
            if (alpha < .1) continue;
            // A broad, smooth remap changes proportions rather than adding
            // invented drawn features. The photographic shading stays natural.
            const faceWeight = Math.max(0, Math.min(1, (240 - sy) / 45));
            const sampleX = Math.max(0, Math.min(width - 1, Math.round(120 + (sx - 120) * (1 + .12 * faceWeight))));
            const sampleY = Math.max(0, Math.min(height - 1, Math.round(sy + Math.sin(sy / 38) * 5 * faceWeight)));
            const toneOffset = (sampleY * width + sampleX) * 4;
            const luminance = (softened[toneOffset] * .2126 + softened[toneOffset + 1] * .7152 + softened[toneOffset + 2] * .0722) / 255;
            // Wide tonal separation leaves open highlights and defined shadow
            // dots, closer to a printed halftone than a filled silhouette.
            const ink = Math.max(0, Math.min(1, (0.88 - luminance) / .7));
            const radius = Math.pow(ink, 1.2) * 2.5 * alpha;
            if (radius < .16) continue;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      };
      const tick = now => {
        if (cancelled || document.hidden) return;
        if (!started) started = now;
        if (now - previous >= 50) { render((now - started) / 1000); previous = now; }
        frame = requestAnimationFrame(tick);
      };
      render(0);
      if (playing && onScreen && !document.hidden) frame = requestAnimationFrame(tick);
      resume = () => {
        cancelAnimationFrame(frame);
        if (playing && onScreen && !document.hidden) frame = requestAnimationFrame(tick);
      };
    };
    let resume = () => {};
    const visibility = () => resume();
    document.addEventListener('visibilitychange', visibility);
    image.onerror = () => { if (!cancelled) setFailed(true); };
    image.src = src;
    return () => { cancelled = true; cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', visibility); };
  }, [src, playing, onScreen, failed]);
  return failed
    ? <svg className={className} viewBox="0 0 240 330" role="img" aria-label="Anonymous interview participant silhouette"><ellipse cx="120" cy="100" rx="48" ry="65" fill="#8498b6"/><path d="M30 330v-65q0-70 90-70t90 70v65Z" fill="#8498b6"/></svg>
    : <canvas ref={canvas} className={className} width="480" height="660" role="img" aria-label="Anonymous interview participant rendered in animated halftone dots"/>;
}
