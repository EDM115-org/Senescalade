import cookie from "cookiejs"

import { defineStore } from "pinia"

const useMainStore = defineStore("main", {
  state: () => ({
    displayAdminMenu: true,
    theme: "light",
    user: null
  }),
  getters: {
    getDisplayAdminMenu() {
      return this.displayAdminMenu
    },
    getTheme() {
      const theme = cookie.get("theme")

      if (theme) {
        this.setTheme(theme)
      }

      return this.theme
    },
    getUser() {
      const userCookie = cookie.get("user")

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
    login(user, stayConnected = false) {
      if (!stayConnected) {
        this.user = this.createCookie("user", encodeURI(JSON.stringify(user)), 1)
      } else {
        this.user = this.createCookie("user", encodeURI(JSON.stringify(user)), 30)
      }
    },
    logout() {
      this.user = null
      cookie.remove("user")
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
