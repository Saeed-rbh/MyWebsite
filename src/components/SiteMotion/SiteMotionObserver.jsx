import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TEXT_ONLY_TAGS = new Set([
  "A",
  "ABBR",
  "B",
  "BUTTON",
  "CODE",
  "EM",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "I",
  "IMG",
  "INPUT",
  "LABEL",
  "P",
  "PATH",
  "SMALL",
  "SPAN",
  "STRONG",
  "SVG",
  "TEXT",
  "TEXTAREA",
]);

const COMPONENT_CLASS_PATTERN =
  /(action|avatar|block|box|canvas|card|chapter|close|column|container|content|control|dashboard|detail|frame|gallery|grid|group|hero|image|info|item|layout|list|media|modal|mode|option|panel|paper|popup|profile|row|scene|section|slide|stage|stat|surface|timeline|toolbar|visual|wrapper)/i;

const KIND_PATTERNS = [
  ["visual", /(canvas|gallery|graph|image|media|photo|scene|svg|visual)/i],
  ["card", /(box|card|item|paper|panel|row|stat|tile)/i],
  ["layout", /(chapter|column|container|grid|layout|list|section|slide|wrapper)/i],
];

const getClassName = (element) => {
  if (typeof element.className === "string") return element.className;
  return element.getAttribute("class") || "";
};

const getMotionKind = (className, tagName) => {
  if (tagName === "SECTION" || tagName === "ARTICLE" || tagName === "ASIDE") {
    return "layout";
  }

  const match = KIND_PATTERNS.find(([, pattern]) => pattern.test(className));
  return match?.[0] || "component";
};

const isMotionCandidate = (element, root) => {
  if (!(element instanceof HTMLElement)) return false;
  if (element === root) return false;
  if (element.dataset.siteMotion || element.dataset.siteMotionIgnore === "true") {
    return false;
  }
  if (element.closest("[data-site-motion-ignore='true']")) return false;
  if (TEXT_ONLY_TAGS.has(element.tagName)) return false;
  if (element.getAttribute("aria-hidden") === "true") return false;

  const className = getClassName(element);
  const isSemanticBlock = ["MAIN", "SECTION", "ARTICLE", "ASIDE", "FORM"].includes(element.tagName);
  const isComponentClass = COMPONENT_CLASS_PATTERN.test(className);

  if (!isSemanticBlock && !isComponentClass) return false;

  const rect = element.getBoundingClientRect();
  if (rect.width < 28 || rect.height < 24 || rect.width * rect.height < 1400) {
    return false;
  }

  const directText = Array.from(element.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
  );

  if (directText && element.children.length <= 1 && !isSemanticBlock) {
    return false;
  }

  return true;
};

const SiteMotionObserver = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const routeRoot = document.querySelector("[data-route-motion-root]");
    if (!routeRoot) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let parentCounts = new WeakMap();
    const observed = new Set();
    let frameId = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;

          if (reducedMotion) {
            element.dataset.siteMotionState = "visible";
            return;
          }

          if (entry.isIntersecting && entry.intersectionRatio > 0.08) {
            element.dataset.siteMotionState = "visible";
            return;
          }

          element.dataset.siteMotionState =
            entry.boundingClientRect.top < 0 ? "above" : "below";
        });
      },
      {
        root: null,
        rootMargin: "-8% 0px -10% 0px",
        threshold: [0, 0.08, 0.18, 0.34],
      }
    );

    const registerElement = (element) => {
      if (!isMotionCandidate(element, routeRoot)) return;

      const parent = element.parentElement || routeRoot;
      const nextIndex = parentCounts.get(parent) || 0;
      parentCounts.set(parent, nextIndex + 1);

      const className = getClassName(element);
      element.dataset.siteMotion = "component";
      element.dataset.siteMotionKind = getMotionKind(className, element.tagName);
      element.dataset.siteMotionState = "below";
      element.style.setProperty("--site-motion-delay", `${Math.min(nextIndex * 42, 252)}ms`);

      observed.add(element);
      observer.observe(element);
    };

    const scan = () => {
      frameId = 0;
      parentCounts = new WeakMap();

      routeRoot
        .querySelectorAll("main, section, article, aside, form, div, ul, ol, li")
        .forEach(registerElement);
    };

    const scheduleScan = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(scan);
    };

    scheduleScan();

    const mutationObserver = new MutationObserver(scheduleScan);
    mutationObserver.observe(routeRoot, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      mutationObserver.disconnect();
      observer.disconnect();
      observed.forEach((element) => {
        delete element.dataset.siteMotion;
        delete element.dataset.siteMotionKind;
        delete element.dataset.siteMotionState;
        element.style.removeProperty("--site-motion-delay");
      });
      observed.clear();
    };
  }, [pathname]);

  return null;
};

export default SiteMotionObserver;
