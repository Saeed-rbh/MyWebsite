const NAVY = [16, 38, 72];
const WHITE = [255, 255, 255];
const BLACK = [0, 0, 0];

export function composite(foreground, background) {
  const alpha = foreground[3] ?? 1;
  return foreground.slice(0, 3).map((channel, i) => channel * alpha + background[i] * (1 - alpha));
}
export function contrastRatio(a, b) {
  const luminance = rgb => rgb.reduce((sum, value, i) => {
    const channel = value / 255;
    return sum + (channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][i];
  }, 0);
  const light = luminance(a), dark = luminance(b);
  return (Math.max(light, dark) + .05) / (Math.min(light, dark) + .05);
}
export function readableText(background) {
  const navy = contrastRatio(NAVY, background), white = contrastRatio(WHITE, background);
  // Black is a fallback for intermediate tones where navy and white both fall short.
  const color = navy >= white && navy >= 4.5 ? NAVY : white >= 4.5 ? WHITE : BLACK;
  return { color: `rgb(${color.join(', ')})`, contrast: contrastRatio(color, background) };
}
const parse = value => {
  const channels = value.match(/^rgba?\(([^)]+)\)$/)?.[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return channels?.length >= 3 ? channels : [0, 0, 0, 0];
};

export function backgroundBehind(x, y) {
  const hit = document.elementsFromPoint(x, y).find(element => !element.closest('.HomeLandingFooter'));
  const ancestors = [];
  for (let node = hit; node; node = node.parentElement) ancestors.unshift(node);
  return ancestors.reduce((color, element) => composite(parse(getComputedStyle(element).backgroundColor), color), WHITE);
}
function gradientAt(image, rect, x, y) {
  const stops = [...image.matchAll(/(rgba?\([^)]+\)|transparent)(?:\s+([\d.]+)%)?/g)].map(match => ({
    color: parse(match[1]), position: match[2] === undefined ? undefined : Number(match[2]) / 100,
  }));
  if (stops.length < 2) return [0, 0, 0, 0];
  stops[0].position ??= 0;
  stops[stops.length - 1].position ??= 1;
  const angle = Number(image.match(/linear-gradient\(([-\d.]+)deg/)?.[1] ?? 180) * Math.PI / 180;
  const dx = Math.sin(angle), dy = -Math.cos(angle);
  const length = Math.abs(rect.width * dx) + Math.abs(rect.height * dy);
  const position = .5 + ((x - rect.left - rect.width / 2) * dx + (y - rect.top - rect.height / 2) * dy) / Math.max(1, length);
  const end = stops.findIndex(stop => stop.position >= position);
  if (end <= 0) return stops[end === 0 ? 0 : stops.length - 1].color;
  const a = stops[end - 1], b = stops[end];
  const t = Math.max(0, Math.min(1, (position - a.position) / (b.position - a.position)));
  const aa = a.color[3] ?? 1, ba = b.color[3] ?? 1;
  const alpha = aa * (1 - t) + ba * t;
  return [...a.color.slice(0, 3).map((channel, i) => alpha ? (channel * aa * (1 - t) + b.color[i] * ba * t) / alpha : 0), alpha];
}
export function throughGlass(background, glass, x, y) {
  if (!glass) return background;
  const style = getComputedStyle(glass), rect = glass.getBoundingClientRect();
  let color = composite(parse(style.backgroundColor), background);
  // Sample the existing highlight gradients at the control's position. No paint is changed.
  for (const image of [style.backgroundImage, getComputedStyle(glass, '::before').backgroundImage]) {
    color = composite(gradientAt(image, rect, x, y), color);
  }
  return color;
}
