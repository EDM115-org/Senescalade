<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Vous êtes connecté {{ mail }}
    </h1>
    <NuxtLink
      to="/user/add"
    >
      <v-btn
        color="secondary"
        class="mr-2"
        variant="elevated"
      >
        Ajouter un grimpeur
      </v-btn>
    </NuxtLink>
    <NuxtLink
      to="/user/profil"
    >
      <v-btn
        color="secondary"
        variant="elevated"
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
