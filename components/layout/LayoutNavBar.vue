<template>
  <v-app-bar
    class="px-8"
    color="secondary"
    dense
    floating
    :rounded="adminPage ? 'none' : 'b-xl'"
    scroll-behavior="elevate"
  >
    <template #prepend>
      <NuxtLink
        v-if="!adminPage"
        to="/"
        class="flex items-center"
      >
        <v-img
          src="/images/salamandre.png"
          alt="Senescalade"
          :draggable="false"
          min-height="40"
          max-height="40"
          min-width="40"
          max-width="40"
          style="filter: invert(1);"
        />
      </NuxtLink>
      <v-btn
        v-else
        icon="mdi-menu"
        @click="displayMenu"
      />
    </template>
    <v-app-bar-title v-if="smAndUp">
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
          variant="outlined"
        />
      </NuxtLink>
    </v-app-bar-title>
    <v-spacer />
    <v-btn
      :prepend-icon="accountIcon"
      :text="accountText"
      variant="tonal"
      @click="handleConnect"
    />
    <v-btn
      id="animateTheme"
      :icon="iconTheme"
      @click="toggleTheme"
    />
  </v-app-bar>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { computed, onMounted, ref, watch } from "vue"
import { useDisplay, useTheme } from "vuetify"

const route = useRoute()
const router = useRouter()
const store = useMainStore()
const vuetifyTheme = useTheme()

const accountIcon = ref("mdi-login")
const accountText = computed(() => (store.getUser ? "Déconnexion" : "Connexion"))
const connected = computed(() => store.getUser)
const theme = ref(store.getTheme)
const adminPage = computed(() => route.fullPath.includes("admin"))
const iconTheme = computed(() => (vuetifyTheme.name.value === "light" ? "mdi-weather-night" : "mdi-weather-sunny"))

const { smAndUp } = useDisplay()

watch(connected, (value) => {
  accountIcon.value = value ? "mdi-logout" : "mdi-login"
})

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark"
  store.setTheme(theme.value)
  vuetifyTheme.global.name.value = theme.value
}

function displayMenu() {
  store.setDisplayAdminMenu(!store.getDisplayAdminMenu)
}

onMounted(() => {
  store.setTheme(store.getTheme)
  vuetifyTheme.global.name.value = store.getTheme
})

function handleConnect() {
  if (connected.value) {
    store.logout()
    router.push("/")
  } else {
    router.push("/login")
  }
}
</script>

<style scoped>
#animateTheme:focus {
  animation: spin 0.3s ease-in-out 0s 1,
             spin 0.3s ease-in-out 0.5s 1,
             spin 0.3s ease-in-out 1s 1;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
