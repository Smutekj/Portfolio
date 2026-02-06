
export type RGBA = {
  r: number; // 0–255
  g: number;
  b: number;
  a: number; // 0–100
};


export function rgba(
  r: number,
  g: number,
  b: number,
  a: number = 1
): RGBA {
  r = Math.max(Math.min(r, 255), 0)
  g = Math.max(Math.min(g, 255), 0)
  b = Math.max(Math.min(b, 255), 0)
  a = Math.max(Math.min(a, 1), 0)
  return { r, g, b, a };
}

export function rgbaToCss({ r, g, b, a }: RGBA): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
export function cssToRgba(cssColor: string): RGBA {
  const components = cssColor.replace('rgba', '').replace('(', '').replace(')', '').replace(' ', '').split(',')
  const alpha = components.length == 3 ? 1 : parseFloat(components[3])
  return rgba(parseFloat(components[0]), parseFloat(components[1]), parseFloat(components[2]), alpha);
}
