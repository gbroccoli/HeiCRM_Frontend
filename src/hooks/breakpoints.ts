/**
 * Стандартные breakpoints для использования с useMediaQuery
 * Соответствуют Tailwind CSS breakpoints
 */
export const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

/**
 * Mobile-first breakpoints
 */
export const MOBILE_BREAKPOINTS = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
} as const;

/**
 * Другие полезные media queries
 */
export const MEDIA_QUERIES = {
  darkMode: "(prefers-color-scheme: dark)",
  lightMode: "(prefers-color-scheme: light)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",
  touchDevice: "(hover: none) and (pointer: coarse)",
} as const;
