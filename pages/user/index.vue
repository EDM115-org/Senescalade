<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Espace utilisateur
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
