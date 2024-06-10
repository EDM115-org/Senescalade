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
        Bienvenue sur le site d'inscription de Senescalade
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
import { useMainStore } from "~/store/main"
import { onMounted } from "vue"

const store = useMainStore()
const router = useRouter()

onMounted(() => {
  const user = store.getUser

  if (user) {
    if (user.isAdmin === 1) {
      router.push("/admin/dashboard")
    } else {
      router.push("/user")
    }
  }
})
</script>
