import { defineStore } from "pinia"

const useMainStore = defineStore("main", {
  state: () => ({
    connected: false,
    user: null
  }),
  getters: {
    isConnected() {
      return this.connected
    },
  },
  actions: {
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
    }
  }
})

export { useMainStore }

export default useMainStore
