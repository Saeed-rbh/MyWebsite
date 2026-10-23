import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { popupsData } from "../../data/homePopupsData";
import semImage from "../../assets/gallery/sem.png";
import styles from "./AnimatedWord.module.css";

const previewImages = {
  "materials-scientist": "/images/commercialization/graphene-concept-v2-1000.webp",
  "2d-nanomaterials": "/images/commercialization/graphene-concept-v2-1000.webp",
  "materials-processing": "/images/commercialization/cfe-process-concept-v2-600.webp",
  "compressible-flow-exfoliation": "/images/commercialization/cfe-process-concept-v2-600.webp",
  "experimental-characterization": semImage,
  "computational-modeling": "/journal-figures/graphene-sliding.jpg",
  "commercialization": "/images/commercialization/pilot-concept-v2-600.webp",
  "heat-transfer": "/images/commercialization/thermal-transparent.webp",
};

const AnimatedWord = ({ word, onClick }) => {
  const [preview, setPreview] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hoverLeaving, setHoverLeaving] = useState(false);
  const closeTimer = useRef(null);
  const titleId = useId();
  const closeRef = useRef(null);
  const restoringFocus = useRef(false);
  const cardRef = useRef(null);
  const closeCard = () => {
    if (closeTimer.current) return;
    if (!expanded) {
      setPreview(null);
      return;
    }
    if (cardRef.current) cardRef.current.scrollTop = 0;
    window.clearTimeout(dismissTimer.current);
    const finish = () => {
      closeTimer.current = null;
      setExpanded(false);
      setPreview(null);
      setClosing(false);
      restoringFocus.current = true;
      triggerRef.current?.focus();
      restoringFocus.current = false;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(finish, 440);
  };
  const triggerRef = useRef(null);
  const dismissTimer = useRef(null);
  const keepPreview = () => {
    window.clearTimeout(dismissTimer.current);
    setHoverLeaving(false);
  };
  const hidePreviewSoon = () => {
    keepPreview();
    if (expanded || closing) return;
    dismissTimer.current = window.setTimeout(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPreview(null);
        return;
      }
      setHoverLeaving(true);
      dismissTimer.current = window.setTimeout(() => {
        setPreview(null);
        setHoverLeaving(false);
      }, 200);
    }, 150);
  };
  useEffect(() => () => {
    window.clearTimeout(dismissTimer.current);
    window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!preview) return;
    const dismiss = () => { if (!expanded) setPreview(null); };
    const escape = (event) => { if (event.key === "Escape") closeCard(); };
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    window.addEventListener("keydown", escape);

  return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("keydown", escape);
    };
  }, [preview, expanded, closing]);

  useEffect(() => {
    if (!expanded) return;
    closeRef.current?.focus();
  }, [expanded]);

  const position = (x, y) => {
    const width = Math.min(260, window.innerWidth - 32);
    const height = 202;
    return {
      left: Math.max(16, Math.min(x - width / 2, window.innerWidth - width - 16)),
      top: y - height - 24 >= 16 ? y - height - 24 : Math.min(y + 32, window.innerHeight - height - 16),
    };
  };

  let displayWord = word;
  let punctuation = "";
  let isSpecialWord = false;

  if (word.startsWith("<") || word.startsWith("$(")) {
    const match = word.match(/^([<$].*?>|\$\([^)]+\))(.*)$/);
    if (match) {
      isSpecialWord = true;
      punctuation = match[2];
      displayWord = match[1].startsWith("<")
        ? match[1].slice(1, -1).replace(/-/g, " ")
        : match[1].slice(2, -1);
    }
  }

  const topic = isSpecialWord && popupsData.find(item =>
    item.keywordMatches.some(keyword => displayWord.toLowerCase().includes(keyword))
  );
  const showPreview = (event) => {
    keepPreview();
    if (expanded || closing || restoringFocus.current) return;
    if (!topic || (event.type !== "focus" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = event.type === "focus"
      ? position(rect.left + rect.width / 2, rect.top)
      : position(event.clientX, event.clientY);
    setPreview(point);
  };

  const expandCard = () => {
    keepPreview();
    if (preview && cardRef.current) {
      setPreview({ left: parseFloat(cardRef.current.style.left), top: parseFloat(cardRef.current.style.top) });
    }
    if (!preview) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPreview(position(rect.left + rect.width / 2, rect.top));
    }
    setExpanded(true);
  };

  return (
    <>
      {isSpecialWord ? (
        <span className={styles.wordWrapper}>
          <button
            ref={triggerRef}
            className={styles.specialBackground}
            onClick={(event) => { if (topic) expandCard(); else onClick?.(displayWord, event); }}
            onPointerEnter={showPreview}
            onPointerMove={(event) => {
              if (!cardRef.current || !preview || expanded) return;
              const point = position(event.clientX, event.clientY);
              cardRef.current.style.left = `${point.left}px`;
              cardRef.current.style.top = `${point.top}px`;
            }}
            onPointerLeave={hidePreviewSoon}
            onFocus={showPreview}
            onBlur={(event) => { if (!cardRef.current?.contains(event.relatedTarget)) hidePreviewSoon(); }}
            type="button"
            aria-label={`Explore ${displayWord}`}
          >
            <span className={styles.pillText}>{displayWord}</span>
          </button>
          {punctuation}
        </span>
      ) : (
        <span>{displayWord}</span>
      )}{" "}
      {preview && topic && createPortal(
        <>
          {expanded && <div className={`${styles.previewBackdrop} ${closing ? styles.backdropClosing : ""}`} onClick={closeCard} />}
          <div
            ref={cardRef}
            className={`${styles.preview} ${expanded ? styles.previewExpanded : ""} ${closing ? styles.previewClosing : ""} ${hoverLeaving && !expanded ? styles.hoverLeaving : ""}`}
            style={{ ...preview, "--preview-left": `${preview.left}px`, "--preview-top": `${preview.top}px` }}
            role={expanded ? "dialog" : undefined}
            aria-modal={expanded ? true : undefined}
            aria-labelledby={expanded ? titleId : undefined}
            onPointerEnter={keepPreview}
            onPointerLeave={hidePreviewSoon}
            onFocus={keepPreview}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== triggerRef.current) hidePreviewSoon();
            }}
            onKeyDown={(event) => {
              if (expanded && event.key === "Tab") {
                event.preventDefault();
                closeRef.current?.focus();
              }
            }}
          >
            <button
              className={styles.previewOpen}
              type="button"
              aria-label={`Read about ${topic.shortTitle}`}
              onClick={expandCard}
              disabled={expanded}
              tabIndex={expanded ? -1 : 0}
            >
              <span className={styles.previewImage}>
                <img src={previewImages[topic.id]} alt="" />
              </span>
              <span className={styles.previewCaption}>
                <span id={titleId}>{topic.shortTitle}</span>
                {!expanded && <span aria-hidden="true">↗</span>}
              </span>
            </button>
            {expanded && <>
              <button ref={closeRef} type="button" className={styles.previewClose} onClick={closeCard} aria-label="Close research description" />
              <div className={styles.previewDescription}>
                <p className={styles.previewLead}>{topic.lead}</p>
                <p>{topic.description}</p>
                <h3>My work</h3>
                <p>{topic.work}</p>
                <p className={styles.previewEvidence}>{topic.evidence}</p>
                <h3>Why it matters</h3>
                <p>{topic.value}</p>
                {topic.id === "computational-modeling" && <Link to="/simulate-atoms" onClick={closeCard}>Matter, atom by atom: explore atomistic simulation ↗</Link>}
              </div>
            </>}
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default AnimatedWord;
