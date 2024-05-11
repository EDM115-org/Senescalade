<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Inscription
    </h1>
    <FormLogin
      :text="'S\'inscrire'"
      @submit:register="register($event)"
    />
    <v-row>
      <v-col
        cols="12"
        class="text-center"
      >
        <v-btn
          color="secondary"
          type="submit"
          large
          @click="$router.push('/login')"
        >
          Se connecter
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
async function register(event) {
  try {
    await $fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(event),
    })
  } catch (error) {
    console.error("Error registering user :", error)
  }
}
</script>
