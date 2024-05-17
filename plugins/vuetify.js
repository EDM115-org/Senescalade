import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

import { defineNuxtPlugin } from "#app"
import { createVuetify } from "vuetify"
import { en, fr } from "vuetify/locale"

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    locale: {
      locale: "fr",
      fallback: "en",
      messages: { fr, en }
    },
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            accent: "#53B9C8",
            background: "#020613",
            error: "#EE3124",
            info: "#53B9C8",
            primary: "#EE3124",
            secondary: "#2646CB",
            success: "#50FA7B",
            text: "#F8F8F2",
            warning: "#F5A249"
          },
          dark: true
        },
        light: {
          colors: {
            accent: "#53B9C8",
            background: "#DFDFD2",
            error: "#EE3124",
            info: "#53B9C8",
            primary: "#EE3124",
            secondary: "#803EDF",
            success: "#3CD863",
            text: "#070B1A",
            warning: "#FFB86C"
          },
          dark: false
        }
      }
    }
  })

  app.vueApp.use(vuetify)
})

