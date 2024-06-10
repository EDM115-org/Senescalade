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
    isConnected() {
      return this.connected
    },
    isLogged() {
      let loggedInCookie = cookie.get("isLoggedIn")

      if (loggedInCookie) {
        this.isLoggedIn = true
      }

      return this.isLoggedIn
    },
    getUser() {
      let userCookie = cookie.get("user")

      if (userCookie) {
        this.user = JSON.parse(decodeURI(userCookie))
      }

      return this.user
    }
  },
  actions: {
    createCookie(name, value, days) {
      cookie(name, value, days)

      return value
    },
    login(user) {
      this.isLoggedIn = this.createCookie("isLoggedIn", true, 1)
      this.user = this.createCookie("user", JSON.stringify(user), 1)
    },
    logout() {
      this.isLoggedIn = false
      this.user = null
      cookie.remove("isLoggedIn", "user")
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
