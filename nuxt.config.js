import eslintStylisticRules from "./eslint-stylistic.json"

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" }
  },
  build: {
    transpile: [ "vuetify" ],
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
    "@pinia/nuxt",
    "@vite-pwa/nuxt"
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
  pwa: {
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      type: "module"
    },
    includeAssets: [ "favicon.ico", "apple-touch-icon.jpg" ],
    manifest: {
      name: "Senescalade",
      short_name: "Senescalade",
      description: "La webapp pour s'inscrire à l'association Senescalade",
      theme_color: "#020613",
      lang: "fr",
      icons: [
        {
          src: "/pwa-192.jpeg",
          sizes: "192x192",
          type: "image/jpg"
        },
        {
          src: "/pwa-192.jpeg",
          sizes: "512x512",
          type: "image/jpg"
        }
      ]
    },
    workbox: {
      navigateFallback: "/",
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
