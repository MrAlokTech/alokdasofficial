import { ColorAdjustments } from "./types";

export interface FilterPreset {
  id: string;
  name: string;
  category: "Style" | "Film" | "Mood" | "Clean";
  description: string;
  adjustments: Partial<ColorAdjustments>;
}

export const DEFAULT_ADJUSTMENTS: ColorAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  hue: 0,
  blur: 0,
  sharpen: 0,
  lutFilter: "none",
};

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: "none",
    name: "Original",
    category: "Clean",
    description: "Natural, unprocessed original colors.",
    adjustments: { ...DEFAULT_ADJUSTMENTS },
  },
  {
    id: "cinematic",
    name: "Cinematic Teal & Orange",
    category: "Film",
    description: "Hollywood blockbuster aesthetic with warm skin tones and cool shadows.",
    adjustments: {
      lutFilter: "cinematic",
      contrast: 15,
      saturation: 10,
      exposure: 5,
    },
  },
  {
    id: "vintage",
    name: "Vintage 1980s",
    category: "Style",
    description: "Faded film emulation with warm amber glow and retro charm.",
    adjustments: {
      lutFilter: "vintage",
      contrast: -5,
      saturation: -10,
      brightness: 5,
    },
  },
  {
    id: "warm",
    name: "Golden Warmth",
    category: "Mood",
    description: "Sun-drenched warmth highlighting golden highlights.",
    adjustments: {
      lutFilter: "warm",
      brightness: 6,
      saturation: 15,
    },
  },
  {
    id: "cool",
    name: "Nordic Frost",
    category: "Mood",
    description: "Crisp blue undertones and clean winter cooling.",
    adjustments: {
      lutFilter: "cool",
      brightness: 4,
      contrast: 8,
    },
  },
  {
    id: "noir",
    name: "Classic Noir B&W",
    category: "Film",
    description: "Deep dramatic shadows, striking silver highlights, and rich contrast.",
    adjustments: {
      lutFilter: "noir",
      contrast: 25,
      sharpen: 20,
    },
  },
  {
    id: "sepia",
    name: "Antique Sepia",
    category: "Style",
    description: "Timeless antique photographic plate with brown-gold tone.",
    adjustments: {
      lutFilter: "sepia",
      contrast: 5,
      brightness: -2,
    },
  },
  {
    id: "dramatic",
    name: "Dramatic HDR",
    category: "Mood",
    description: "Boosted dynamic range and punchy micro-contrast.",
    adjustments: {
      lutFilter: "dramatic",
      contrast: 30,
      sharpen: 25,
      saturation: 12,
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Neon",
    category: "Style",
    description: "Vibrant electric magenta highlights and deep cyan night shadows.",
    adjustments: {
      lutFilter: "cyberpunk",
      contrast: 20,
      saturation: 30,
      exposure: 8,
    },
  },
  {
    id: "forest",
    name: "Deep Emerald",
    category: "Mood",
    description: "Enriched botanical greens with calming earthy tones.",
    adjustments: {
      lutFilter: "forest",
      contrast: 10,
      saturation: 18,
    },
  },
  {
    id: "sunset",
    name: "Sunset Ember",
    category: "Mood",
    description: "Dramatic twilight orange, scarlet radiance, and soft highlights.",
    adjustments: {
      lutFilter: "sunset",
      brightness: 8,
      contrast: 12,
      saturation: 22,
    },
  },
  {
    id: "vibrant",
    name: "Vivid Color Pop",
    category: "Clean",
    description: "Crisp clarity and lively color saturation without clipping.",
    adjustments: {
      lutFilter: "vibrant",
      saturation: 35,
      contrast: 10,
      sharpen: 15,
    },
  },
];
