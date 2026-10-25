import { useLayoutEffect } from 'react';
import './PageReveals.css';

// The Graphene opening sequence, shared by every public page.
const entrances = {
  atmosphere: { delay: 0, duration: 1400, x: -14, y: 0 },
  eyebrow: { delay: 80, duration: 650, y: 8 },
  prefix: { delay: 150, duration: 850, y: 22 },
  title: { delay: 210, duration: 1100, y: 30, mask: true },
  kicker: { delay: 360, duration: 750, y: 12 },
  journey: { delay: 320, duration: 850, x: 20, y: 0 },
  intro: { delay: 500, duration: 800, y: 18 },
  actions: { delay: 680, duration: 750, y: 12 },
  guide: { delay: 760, duration: 650, y: 8 },
};

export default function usePageReveals(root, enabled = true) {
  useLayoutEffect(() => {
    const page = root.current;
    if (!enabled || !page || !Element.prototype.animate) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    const opening = [];
    const isGraphene = !!page.querySelector('[data-graphene-entrance]');
    let observer;
    let curtainObserver;
    let loaderObserver;
    let disposed = false;
    let started = false;

    const setOpening = state => {
      page.dataset.pageOpening = state;
      if (isGraphene) page.dataset.grapheneOpening = state;
    };
    const stop = () => {
      observer?.disconnect();
      curtainObserver?.disconnect();
      loaderObserver?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };

    const observeIllustrations = () => {
      if (preference.matches || !window.IntersectionObserver) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          target.dataset.grapheneRevealed = 'true';
          const animation = target.animate([
            { opacity: 0.25, transform: 'translateY(18px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], {
            duration: 650,
            delay: Math.min(Number(target.dataset.grapheneReveal) || 0, 4) * 75,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'backwards',
          });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      }, { root: page, threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
      page.querySelectorAll('[data-graphene-reveal]:not([data-graphene-revealed])')
        .forEach(element => observer.observe(element));
    };

    // Hold the first frame until the incoming page is actually visible.
    // Fragment links go straight to their content without replaying the hero.
    if (!preference.matches && !window.location.hash) {
      page.querySelectorAll('[data-page-entrance], [data-graphene-entrance]').forEach(target => {
        const timing = entrances[target.dataset.pageEntrance || target.dataset.grapheneEntrance];
        if (!timing) return;
        const from = { opacity: 0 };
        const to = { opacity: 1 };
        if (target.hasAttribute('data-page-entrance')) {
          // Compose with existing scroll/parallax and interactive spring transforms.
          from.translate = `${timing.x || 0}px ${timing.y || 0}px`;
          to.translate = '0px 0px';
        } else {
          from.transform = `translate(${timing.x || 0}px, ${timing.y || 0}px)`;
          to.transform = 'translate(0px, 0px)';
        }
        if (timing.mask) {
          from.clipPath = 'inset(0 0 100% 0)';
          to.clipPath = 'inset(0 0 -15% 0)';
        }
        const animation = target.animate([from, to], {
          duration: timing.duration,
          delay: timing.delay + (Number(target.dataset.entranceOrder) || 0) * 110,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards',
        });
        animation.pause();
        animation.currentTime = 0;
        animations.add(animation);
        opening.push(animation);
      });
    }

    const reveal = () => {
      if (started || disposed) return;
      started = true;
      curtainObserver?.disconnect();
      loaderObserver?.disconnect();
      setOpening(opening.length ? 'playing' : 'complete');
      opening.forEach(animation => animation.play());
      Promise.allSettled(opening.map(animation => animation.finished)).then(() => {
        if (!disposed) setOpening('complete');
        opening.forEach(animation => animations.delete(animation));
      });
      observeIllustrations();
    };
    const curtain = page.closest('.PageTransitionContent');
    const loader = document.getElementById('Intro');
    const entranceReady = () => !document.getElementById('Intro') &&
      (!curtain || ['idle', 'entering'].includes(curtain.dataset.transitionPhase));
    if (opening.length && !entranceReady()) {
      setOpening('waiting');
      const checkReady = () => { if (entranceReady()) reveal(); };
      if (curtain) {
        curtainObserver = new MutationObserver(checkReady);
        curtainObserver.observe(curtain, { attributes: true, attributeFilter: ['data-transition-phase'] });
      }
      if (loader?.parentElement) {
        loaderObserver = new MutationObserver(checkReady);
        loaderObserver.observe(loader.parentElement, { childList: true });
      }
    } else reveal();

    const onPreferenceChange = () => {
      stop();
      setOpening('complete');
      // Changing this setting mid-page must not replay the opening sequence.
      observeIllustrations();
    };
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      disposed = true;
      stop();
      preference.removeEventListener('change', onPreferenceChange);
      delete page.dataset.pageOpening;
      delete page.dataset.grapheneOpening;
      page.querySelectorAll('[data-graphene-revealed]')
        .forEach(element => delete element.dataset.grapheneRevealed);
    };
  }, [root, enabled]);
}
