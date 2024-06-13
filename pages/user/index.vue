<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Vous êtes connecté {{ mail }}
    </h1>
    <NuxtLink
      to="/user/add"
    >
      <v-btn
        color="accent"
        class="mr-2"
        large
      >
        Ajouter un grimpeur
      </v-btn>
    </NuxtLink>
    <NuxtLink
      to="/user/profil"
    >
      <v-btn
        color="accent"
        large
      >
        modifier son profil
      </v-btn>
    </NuxtLink>
    <CardUser />
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { computed } from "vue"

const store = useMainStore()

const mail = computed(() => store.getUser.mail)
</script>
