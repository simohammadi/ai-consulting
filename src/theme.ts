import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  globalCss: {
    "html, body": {
      bg: "#070708",
      color: "gray.200",
      fontFeatureSettings: '"cv11", "ss01"',
    },
    "::selection": {
      bg: "whiteAlpha.300",
    },
    "*": {
      scrollBehavior: "smooth",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: {
          value:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        body: {
          value:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      },
      colors: {
        // Neutral grayscale ramp used across the dark UI
        ink: {
          50: { value: "#f5f5f6" },
          100: { value: "#e6e6e8" },
          200: { value: "#c9c9cd" },
          300: { value: "#a3a3a9" },
          400: { value: "#76767d" },
          500: { value: "#52525a" },
          600: { value: "#3a3a40" },
          700: { value: "#27272b" },
          800: { value: "#19191c" },
          900: { value: "#0f0f11" },
          950: { value: "#070708" },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: "#070708" },
          subtle: { value: "#0f0f11" },
          panel: { value: "#19191c" },
        },
        border: {
          DEFAULT: { value: "rgba(255,255,255,0.08)" },
          subtle: { value: "rgba(255,255,255,0.05)" },
        },
        accent: {
          DEFAULT: { value: "#e6e6e8" },
          muted: { value: "#a3a3a9" },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
