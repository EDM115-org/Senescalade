<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Connexion
    </h1>
    <FormLogin
      text="Se connecter"
      @submit:login="login($event)"
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
          @click="$router.push('/register')"
        >
          S'inscrire
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"

const store = useMainStore()
const router = useRouter()

async function login(event) {
  try {
    const result = await $fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(event),
    })

    if (result.status === 200) {
      store.login(result.body.user)

      if (result.body.user.isAdmin === 1) {
        router.push("/admin")
      } else {
        router.push("/user")
      }
    } else {
      console.error("Error logging in user :", result)
    }
  } catch (error) {
    console.error("Error logging in user :", error)
  }
}
</script>
