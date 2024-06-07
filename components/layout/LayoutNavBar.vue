<template>
  <v-app-bar
    class="px-8"
    color="secondary"
    dense
    floating
    rounded="b-xl"
    scroll-behavior="elevate"
  >
    <template #prepend>
      <NuxtLink
        to="/"
        class="flex items-center"
      >
        <v-img
          src="~/public/images/salamandre.png"
          alt="Senescalade"
          min-height="40"
          max-height="40"
          min-width="40"
          max-width="40"
        />
      </NuxtLink>
    </template>
    <v-app-bar-title>
      <NuxtLink
        to="/"
        class="text-h6"
      >
        Senescalade
      </NuxtLink>
      <NuxtLink
        to="/dev"
      >
        <v-btn
          class="mx-2"
          color="warning"
          text="Dev"
        />
      </NuxtLink>
    </v-app-bar-title>
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
import { computed, onMounted, ref, watch } from "vue"
import { useTheme } from "vuetify"

const router = useRouter()
const store = useMainStore()
const vuetifyTheme = useTheme()

const accountIcon = ref("mdi-login")
const accountText = computed(() => (store.isConnected ? "Déconnexion" : "Connexion"))
const connected = computed(() => store.isConnected)
const theme = ref("dark")

watch(connected, (value) => {
  accountIcon.value = value ? "mdi-logout" : "mdi-login"
})

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark"
  store.setTheme(theme.value)
  vuetifyTheme.global.name.value = theme.value
}

onMounted(() => {
  store.setTheme(store.getTheme)
  vuetifyTheme.global.name.value = store.getTheme
})

function handleConnect() {
  if (connected.value) {
    store.logout()
  } else {
    router.push("/login")
  }
}
</script>
