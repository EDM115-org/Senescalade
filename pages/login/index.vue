<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Connexion
    </h1>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
      :color="messageColor"
    />
    <FormLogin
      :inscription="false"
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
import { onMounted, ref } from "vue"

const store = useMainStore()
const route = useRoute()
const router = useRouter()

const errorMessage = ref("")
const issueMessage = ref("")
const messageColor = ref("error")

async function login(event) {
  messageColor.value = "error"

  try {
    const result = await $fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(event),
    })

    if (result.status === 200) {
      store.login(result.body.user, result.body.stayConnected)

      if (result.body.user.isAdmin === 1) {
        router.push("/admin/dashboard")
      } else {
        router.push("/user")
      }
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de la connexion"
    issueMessage.value = error
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

  if (route.query.inscription === "success") {
    errorMessage.value = "Inscription réussie, veuillez vous connecter"
    messageColor.value = "success"
    router.replace({ query: {} })
  }
})
</script>
