// web-vitals v5 uses on* observers; FID has been replaced by INP.
const reportWebVitals = onPerfEntry => {
  if (typeof onPerfEntry !== 'function') return;
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    const options = { reportAllChanges: true };
    onCLS(onPerfEntry, options);
    onINP(onPerfEntry, options);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry, options);
    onTTFB(onPerfEntry);
  });
};
export default reportWebVitals;
