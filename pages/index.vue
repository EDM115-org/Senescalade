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
          <v-col>
            <v-btn
              color="accent"
              large
              @click="fetchDb"
            >
              Fetch DB
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
async function fetchDb() {
  // eslint-disable-next-line no-undef
  const data = await $fetch("/api/db")
  console.log(data)
}
</script>

<style scoped>
</style>
