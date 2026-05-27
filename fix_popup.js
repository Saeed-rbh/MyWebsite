const fs = require("fs");
const path = "src/components/Popup/Popup.jsx";
let content = fs.readFileSync(path, "utf8");

content = content.replace(
  "const Popup = ({ isOpen, onClose, title, content, originRect }) => {",
  "const Popup = ({ isOpen, onClose, title, content, originRect, onNext, onPrev, hasNext, hasPrev }) => {"
);

const navButtonsHtml = `
                    <div className={styles.content} ref={contentRef} onScroll={handleScroll}>
                        {content}
                        <div className={styles.navigationButtons} style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                            {hasPrev ? (
                                <button onClick={onPrev} style={{ background: "transparent", border: "1px solid #d49d81", color: "#d49d81", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background="rgba(212,157,129,0.1)"} onMouseOut={e => e.currentTarget.style.background="transparent"}>
                                    &larr; Previous Concept
                                </button>
                            ) : <div></div>}
                            {hasNext ? (
                                <button onClick={onNext} style={{ background: "#d49d81", border: "1px solid #d49d81", color: "#1a1a1a", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background="#e0ad94"} onMouseOut={e => e.currentTarget.style.background="#d49d81"}>
                                    Next Concept &rarr;
                                </button>
                            ) : <div></div>}
                        </div>
                    </div>
`;

content = content.replace(
  "<div\r\n                        className={styles.content}\r\n                        ref={contentRef}\r\n                        onScroll={handleScroll}\r\n                    >\r\n                        {content}\r\n                    </div>",
  navButtonsHtml
);

// Fallback if line endings differ
content = content.replace(
  /<div[\s\S]*?className=\{styles\.content\}[\s\S]*?ref=\{contentRef\}[\s\S]*?onScroll=\{handleScroll\}[\s\S]*?>[\s\S]*?\{content\}[\s\S]*?<\/div>/,
  navButtonsHtml
);


fs.writeFileSync(path, content);
console.log("Refactored Popup.jsx");

