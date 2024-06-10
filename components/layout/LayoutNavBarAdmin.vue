<template>
  <v-navigation-drawer
    app
    color="#FF7712"
    dark
  >
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="sidebar-header">
            Senescalade
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list-item-group v-model="selectedItem">
        <v-list-item
          v-for="item in items"
          :key="item.text"
          :to="item.to"
          link
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue"

const selectedItem = ref(0)

const items = [
  { text: "DashBoard", to: "/admin/dashboard" },
  { text: "Liste Grimpeur", to: "/admin/liste-grimpeur" },
  { text: "Gestion crénaux", to: "/admin/gestion-crénaux" },
  { text: "BDD", to: "/admin/bdd" },
  { text: "Gestion admin", to: "/admin/gestion-admin" },
  { text: "Profil", to: "/admin/profil" },
]
</script>

<style scoped>
.sidebar-header {
  padding: 20px;
  background: #FF6C00;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.v-list-item--active {
  background-color: #FF6C00 !important;
}

.v-list-item:hover {
  background-color: white;
  color: #FF7712 !important;
}
</style>
