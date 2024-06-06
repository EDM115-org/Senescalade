<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Vous êtes connecté
    </h1>
    <NuxtLink
      to="/user/adduser"
    >
      <v-btn
        color="accent"
        large
      >
        Ajouter un grimpeur
      </v-btn>
    </NuxtLink>
    <CardUser />
  </v-container>
</template>
