<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Inscription
    </h1>
    <FormLogin
      :inscription="true"
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
          @click="$router.push('/login')"
        >
          Se connecter
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { onMounted } from "vue"

const store = useMainStore()
const router = useRouter()

async function register(event) {
  try {
    await $fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(event),
    })
    router.push("/login")
  } catch (error) {
    console.error("Error registering user :", error)
  }
}

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
