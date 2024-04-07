import { defineStore } from "pinia"

const useMainStore = defineStore("main", {
  state: () => ({
    connected: false,
  }),
  getters: {
    isConnected() {
      return this.connected
    },
  },
  actions: {
    login() {
      this.connected = true
    },
    logout() {
      this.connected = false
    }
  }
})

export { useMainStore }

export default useMainStore
