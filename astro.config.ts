import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: [
              "./src/assets/fonts/google-sans-code/GoogleSansCode-Light.ttf",
            ],
            weight: 300,
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/google-sans-code/GoogleSansCode-Regular.ttf",
            ],
            weight: 400,
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/google-sans-code/GoogleSansCode-Medium.ttf",
            ],
            weight: 500,
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/google-sans-code/GoogleSansCode-SemiBold.ttf",
            ],
            weight: 600,
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/google-sans-code/GoogleSansCode-Bold.ttf",
            ],
            weight: 700,
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/google-sans-code/GoogleSansCode-LightItalic.ttf",
            ],
            weight: 300,
            style: "italic",
          },
          {
            src: [
              "./src/assets/fonts/google-sans-code/GoogleSansCode-Italic.ttf",
            ],
            weight: 400,
            style: "italic",
          },
          {
            src: [
              "./src/assets/fonts/google-sans-code/GoogleSansCode-MediumItalic.ttf",
            ],
            weight: 500,
            style: "italic",
          },
          {
            src: [
              "./src/assets/fonts/google-sans-code/GoogleSansCode-SemiBoldItalic.ttf",
            ],
            weight: 600,
            style: "italic",
          },
          {
            src: [
              "./src/assets/fonts/google-sans-code/GoogleSansCode-BoldItalic.ttf",
            ],
            weight: 700,
            style: "italic",
          },
        ],
      },
      fallbacks: [],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["ttf"],
    },
    {
      name: "Noto Sans SC",
      cssVariable: "--font-noto-sans-sc",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: [
              "./src/assets/fonts/noto-sans-sc/files/noto-sans-sc-chinese-simplified-300-normal.woff2",
              "./src/assets/fonts/noto-sans-sc/files/noto-sans-sc-chinese-simplified-300-normal.woff",
            ],
            weight: 300,
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff2",
              "./src/assets/fonts/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff",
            ],
            weight: 400,
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/noto-sans-sc/files/noto-sans-sc-chinese-simplified-500-normal.woff2",
              "./src/assets/fonts/noto-sans-sc/files/noto-sans-sc-chinese-simplified-500-normal.woff",
            ],
            weight: 500,
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/noto-sans-sc/files/noto-sans-sc-chinese-simplified-600-normal.woff2",
              "./src/assets/fonts/noto-sans-sc/files/noto-sans-sc-chinese-simplified-600-normal.woff",
            ],
            weight: 600,
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/noto-sans-sc/files/noto-sans-sc-chinese-simplified-700-normal.woff2",
              "./src/assets/fonts/noto-sans-sc/files/noto-sans-sc-chinese-simplified-700-normal.woff",
            ],
            weight: 700,
            style: "normal",
          },
        ],
      },
      fallbacks: [
        "Microsoft YaHei UI",
        "Microsoft YaHei",
        "PingFang SC",
        "sans-serif",
      ],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      formats: ["woff2", "woff"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
