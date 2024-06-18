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

const user = store.getUser

const drawer = computed(() => store.getDisplayAdminMenu)

function displayMenu() {
  store.setDisplayAdminMenu(!store.getDisplayAdminMenu)
}

const items = [{ text: "Dashboard", to: "/admin/dashboard" }]

try {
  const response = await $fetch("/api/fetch?type=adminPerms", {
    method: "POST",
    body: JSON.stringify({ user })
  })

  if (response) {
    if (response.body[0].ReadListGrimpeur === 1) {
      items.push({ text: "Liste des grimpeurs", to: "/admin/liste-grimpeurs" })
    }

    if (response.body[0].ReadListSeance === 1) {
      items.push({ text: "Gestion des crénaux", to: "/admin/gestion-crenaux" })
    }

    if (response.body[0].ReadListAdmin === 1) {
      items.push({ text: "Gestion admin", to: "/admin/gestion-admin" })
    }

    if (response.body[0].ReadListUtilisateur === 1) {
      items.push({ text: "Gestion des utilisateurs", to: "/admin/gestion-utilisateur" })
    }

    if (response.body[0].AccessReinscription === 1) {
      items.push({ text: "Gestion Réinscription", to: "/admin/reinscription" })
    }
  } else {
    console.error("Error getPermAdmin:", response.statusText)
  }
} catch (error) {
  console.error("Error getPermAdmin:", error.message)
}

items.push({ text: "Profil", to: "/admin/profil" })


</script>

<style scoped>
.sidebar-header {
  padding: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
