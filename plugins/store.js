import { defineNuxtPlugin } from "#app"
import { useMainStore } from "~/store/main"

export default defineNuxtPlugin((nuxtApp) => {
  const store = useMainStore()

  nuxtApp.provide("store", store)
})

