import eslintStylisticRules from "./eslint-stylistic.json"

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  aos: {
    duration: 800,
    easing: "ease-in-out",
    mirror: false,
    offset: 100,
    once: true
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" }
  },
  build: {
    transpile: [ "vuetify" ],
  },
  css: [ "~/assets/styles/main.scss" ],
  device: {
    refreshOnResize: true
  },
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
  lodash: {
    prefix: "ldsh",
    prefixSkip: false,
    upperAfterPrefix: true
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    "@nuxt/devtools",
    "@nuxt/eslint",
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "@vueuse/nuxt",
    "nuxt-aos",
    "nuxt-lodash"
  ],
  nitro: {
    esbuild: {
      options: {
        target: "esnext"
      }
    }
  },
  plugins: [
    {
      src: "~/plugins/vuetify"
    },
    {
      src: "~/plugins/store"
    }
  ],
  ssr: false,
  telemetry: false,
  vite: {
    vue: {
      template: { transformAssetUrls }
    }
  }
})
