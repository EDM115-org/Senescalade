<template>
  <v-app>
    <v-main>
      <LayoutNavBar />
      <v-container
        class="fill-height"
      >
        <v-row
          align="center"
          align-content="center"
          justify="center"
        >
          <v-col align="center">
            <NuxtLink to="/">
              Redirection vers la page d'accueil...
            </NuxtLink>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from "vue"

onMounted(() => {
  const router = useRouter()

  router.push("/")
})
</script>
