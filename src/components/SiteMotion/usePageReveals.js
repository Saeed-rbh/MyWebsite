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
  component: { delay: 480, duration: 750, y: 18 },
};

const entranceSelector = '[data-page-entrance], [data-graphene-entrance]';
const componentSelector = 'section, article, aside, header, footer, nav, form, table, figure, div, ul, ol, li, h1, h2, h3, h4, h5, h6, p, img, canvas, svg, button, a, [role="tablist"]';

// Cover the rest of the opening viewport without animating a component and its
// children twice. Explicit hero sequences and below-the-fold scroll effects win.
export function openingComponents(page) {
  const bounds = page.getBoundingClientRect();
  const viewport = {
    top: Math.max(0, bounds.top), left: Math.max(0, bounds.left),
    bottom: Math.min(window.innerHeight, bounds.bottom),
    right: Math.min(window.innerWidth, bounds.right),
  };
  const selected = [];
  page.querySelectorAll(componentSelector).forEach(target => {
    if (target.closest(entranceSelector) || target.querySelector(entranceSelector)) return;
    if (target.closest('[hidden], [aria-hidden="true"], [data-page-entrance-ignore="true"]')) return;
    const inertParent = target.closest('[inert]');
    if (inertParent && page.contains(inertParent)) return;
    if (selected.some(parent => parent.contains(target))) return;
    const rect = target.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2 || rect.bottom <= viewport.top ||
        rect.top >= viewport.bottom || rect.right <= viewport.left || rect.left >= viewport.right) return;
    if (getComputedStyle(target).visibility === 'hidden') return;
    // Large sections are layout scaffolding; reveal their visible components.
    if (rect.height > window.innerHeight * .85) return;
    if (!target.textContent.trim() && !target.matches('img, canvas, svg') &&
        !target.querySelector('img, canvas, svg')) return;
    selected.push(target);
  });
  return selected;
}

export default function usePageReveals(root, enabled = true, profile = null, readyToEnter = true) {
  useLayoutEffect(() => {
    const page = root.current;
    if (!enabled || !page || !Element.prototype.animate) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    const opening = [];
    const automatic = [];
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
          const frames = profile?.distance === 0
            ? [{ opacity: profile.opacity }, { opacity: 1 }]
            : [{ opacity: profile?.opacity ?? .25, transform: `translateY(${profile?.distance ?? 18}px)` }, { opacity: 1, transform: 'translateY(0)' }];
          const animation = target.animate(frames, {
            duration: profile?.duration ?? 650,
            delay: Math.min(Number(target.dataset.grapheneReveal) || 0, profile ? 3 : 4) * (profile?.stagger ?? 75),
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
      openingComponents(page).forEach(target => {
        if (profile && (target.closest('[data-graphene-reveal], [data-scroll-fade]') || target.querySelector('[data-graphene-reveal], [data-scroll-fade]'))) return;
        target.dataset.pageEntrance = 'component';
        automatic.push(target);
      });
      page.querySelectorAll(entranceSelector).forEach(target => {
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
          delay: timing.delay + (Number(target.dataset.entranceOrder) || 0) * 110 +
            Math.min(Math.max(automatic.indexOf(target), 0), 4) * 65,
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
    // The initial landing sequence also waits for React's loader handoff. DOM
    // observers alone can miss a loader mounted in the same commit as the page.
    const entranceReady = () => readyToEnter && !document.getElementById('Intro') &&
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
      automatic.forEach(target => delete target.dataset.pageEntrance);
      page.querySelectorAll('[data-graphene-revealed]')
        .forEach(element => delete element.dataset.grapheneRevealed);
    };
  }, [root, enabled, profile, readyToEnter]);
}
