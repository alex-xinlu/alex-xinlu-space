import type { FontData } from "astro:assets";

export function getFontPathByWeight(
  fonts: FontData[],
  weight: number,
  options?: {
    style?: "normal" | "italic";
    format?: string;
  }
): string | undefined {
  const style = options?.style ?? "normal";
  const format = options?.format ?? "truetype";

  return fonts
    .find(font => font.style === style && supportsWeight(font.weight, weight))
    ?.src.find(file => file.format === format)?.url;
}

function supportsWeight(fontWeight: string | undefined, targetWeight: number) {
  if (fontWeight === undefined) return false;

  const weights = fontWeight.split(/\s+/).map(Number);

  if (weights.length === 1) {
    return weights[0] === targetWeight;
  }

  const [minWeight, maxWeight] = weights;
  return targetWeight >= minWeight && targetWeight <= maxWeight;
}
