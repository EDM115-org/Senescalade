import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  aos: {
    duration: 800,
    easing: "ease-in-out",
    mirror: false,
    offset: 100,
    once: true
  },
  build: {
    transpile: ["vuetify"],
  },
  css: ["~/assets/styles/main.scss"],
  device: {
    refreshOnResize: true
  },
  devtools: {
    enabled: true,
    telemetry: false,
    timeline: { enabled: true }
  },
  googleFonts: {
    display: "swap",
    download: true,
    families: {
      "Fira+Code": true,
      Inter: true,
      Nunito: true
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
    locales: ["en", "fr"],
    strategy: "no_prefix"
  },
  image: {
    format: ["webp", "png", "gif"],
    quality: 100
  },
  linkChecker: {
    failOnError: true,
    report: {
      html: true,
      markdown: true
    },
    runOnBuild: true,
    showLiveInspections: true
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
    "@nuxt/image",
    "@nuxtjs/device",
    "@nuxtjs/eslint-module",
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "@vueuse/nuxt",
    "nuxt-aos",
    "nuxt-icon",
    "nuxt-link-checker",
    "nuxt-lodash",
    // "nuxt-mail"
  ],
  plugins: [{
    src: "~/plugins/vuetify"
  }],
  ssr: true,
  telemetry: false,
  vite: {
    vue: {
      template: { transformAssetUrls }
    }
  }
})
