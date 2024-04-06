import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  css: ['~/assets/styles/main.scss'],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    },
    telemetry: false
  },
  modules: [
    ['@nuxtjs/google-fonts', {
      display: 'swap',
      families: { Nunito: true }
    }],
    ['@nuxtjs/i18n', {
      locales: ['fr', 'en'],
      defaultLocale: 'fr',
      strategy: 'no_prefix',
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_lang'
      }
    }],
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],
  plugins: [
    { src: '~/plugins/vuetify' }
  ],
  telemetry: false,
  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    }
  }
})
