import eslintStylisticRules from "./eslint-stylistic.json"

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" }
  },
  build: {
    transpile: [ "vuetify" ]
  },
  css: [ "~/assets/styles/main.scss" ],
  devtools: {
    enabled: true,
    telemetry: false,
    timeline: { enabled: true }
  },
  eslint: {
    config: {
      stylistic: eslintStylisticRules
    }
  },
  googleFonts: {
    display: "swap",
    download: true,
    families: {
      "Fira+Code": true,
      "Inter": true,
      "Nunito": true
    },
    inject: true,
    preconnect: true,
    prefetch: true
  },
  i18n: {
    defaultLocale: "fr",
    detectBrowserLanguage: {
      cookieKey: "i18n_lang",
      fallbackLocale: "fr",
      useCookie: true
    },
    langDir: "locales/",
    locales: [
      { code: "en", file: "en.json" },
      { code: "fr", file: "fr.json" }
    ],
    strategy: "no_prefix"
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins.push(vuetify({ autoImport: { labs: true } }))
      })
    },
    "@nuxt/devtools",
    "@nuxt/eslint",
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@pinia/nuxt"
  ],
  nitro: {
    esbuild: {
      options: {
        target: "esnext"
      }
    }
  },
  ssr: false,
  telemetry: false,
  vite: {
    vue: {
      template: { transformAssetUrls }
    }
  }
})
