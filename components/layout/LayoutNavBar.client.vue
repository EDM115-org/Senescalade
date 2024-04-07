<template>
  <v-app-bar
    class="px-8"
    color="secondary"
    floating
    rounded="b-xl"
    scroll-behavior="elevate"
  >
    <v-app-bar-title text="Senescalade" />
    <v-spacer />
    <v-btn
      :prepend-icon="accountIcon"
      :text="accountText"
      @click="handleConnect"
    />
    <v-btn
      icon="mdi-theme-light-dark"
      @click="toggleTheme"
    />
  </v-app-bar>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { useTheme } from "vuetify"
import { computed, ref, watch } from "vue"

const theme = useTheme()
const store = useMainStore()

const connected = computed(() => store.isConnected)
const accountIcon = ref("mdi-login")
const accountText = computed(() => connected.value ? "Déconnexion" : "Connexion")

watch(connected, (value) => {
  accountIcon.value = value ? "mdi-logout" : "mdi-login"
})

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark"
}

function handleConnect () {
  if (connected.value) {
    store.logout()
  } else {
    store.login()
  }
}
</script>

<style scoped>
</style>
