<template>
  <v-navigation-drawer
    v-model="drawer"
    color="secondary"
    @update:model-value="displayMenu"
  >
    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :value="index"
        :to="item.to"
        link
      >
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { computed } from "vue"

const store = useMainStore()

const drawer = computed(() => store.getDisplayAdminMenu)

function displayMenu() {
  store.setDisplayAdminMenu(!store.getDisplayAdminMenu)
}

const items = [
  { text: "Dashboard", to: "/admin/dashboard" },
  { text: "Gestion des utilisateurs", to: "/admin/gestion-utilisateur" },
  { text: "Liste des grimpeurs", to: "/admin/liste-grimpeurs" },
  { text: "Gestion des crénaux", to: "/admin/gestion-crenaux" },
  { text: "Gestion admin", to: "/admin/gestion-admin" },
  { text: "Profil", to: "/admin/profil" },
]
</script>

<style scoped>
.sidebar-header {
  padding: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
