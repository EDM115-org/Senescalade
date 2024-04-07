<template>
  <v-container
    class="fill-height"
  >
    <v-row
      align="center"
      align-content="center"
      justify="center"
    >
      <v-col
        align="center"
      >
        Bienvenue sur le site d'inscription de Senescalade.
        <v-divider class="my-4" />
        <v-row>
          <v-col>
            <NuxtLink
              to="/register"
            >
              <v-btn
                color="accent"
                large
              >
                Inscription
              </v-btn>
            </NuxtLink>
          </v-col>
          <v-col>
            <NuxtLink
              to="/login"
            >
              <v-btn
                color="accent"
                large
              >
                Connexion
              </v-btn>
            </NuxtLink>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped>
</style>
