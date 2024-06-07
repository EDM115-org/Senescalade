import cookie from "cookiejs"

import { defineStore } from "pinia"

const useMainStore = defineStore("main", {
  state: () => ({
    connected: false,
    theme: "dark",
    user: null
  }),
  getters: {
    getTheme() {
      let theme = cookie.get("theme")

      if (theme) {
        this.setTheme(theme)
      } else {
        theme = this.theme
      }

      return theme
    },
    getUser() {
      return this.user
    },
    isConnected() {
      return this.connected
    }
  },
  actions: {
    createCookie(name, value, days) {
      cookie(name, value, days)

      return value
    },
    login(user) {
      if (this.connected) {
        return
      }

      this.connected = true
      this.user = user
    },
    logout() {
      this.connected = false
      this.user = null
    },
    setTheme(theme) {
      this.theme = this.createCookie("theme", theme, 30)
    }
  }
})

export { useMainStore }

export default useMainStore
