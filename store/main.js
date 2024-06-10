import cookie from "cookiejs"

import { defineStore } from "pinia"

const useMainStore = defineStore("main", {
  state: () => ({
    connected: false,
    displayAdminMenu: true,
    theme: "dark",
    user: null
  }),
  getters: {
    getDisplayAdminMenu() {
      return this.displayAdminMenu
    },
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
    setDisplayAdminMenu(val) {
      this.displayAdminMenu = val
    },
    setTheme(theme) {
      this.theme = this.createCookie("theme", theme, 30)
    }
  }
})

export { useMainStore }

export default useMainStore
