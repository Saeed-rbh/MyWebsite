const calculateGradientValue = (start, end, ratio) => {
  return start + (end - start) * ratio;
};

const GradientColor = (index, length) => {
  const { r: r1, g: g1, b: b1, a: a1 } = { r: 250, g: 245, b: 243, a: 0.64 }; // #faf5f3a2
  const { r: r2, g: g2, b: b2, a: a2 } = { r: 255, g: 85, b: 0, a: 0.88 }; // #ff5500e0

  const ratio = index / (length - 1);

  const r = Math.floor(calculateGradientValue(r1, r2, ratio));
  const g = Math.floor(calculateGradientValue(g1, g2, ratio));
  const b = Math.floor(calculateGradientValue(b1, b2, ratio));
  const a = Number(calculateGradientValue(a1, a2, ratio).toFixed(2));

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export default GradientColor;
