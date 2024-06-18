<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Inscription
    </h1>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
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
          variant="elevated"
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
import { onMounted, ref } from "vue"

const store = useMainStore()
const router = useRouter()

const errorMessage = ref("")
const issueMessage = ref("")

async function register(event) {
  try {
    const result = await $fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(event),
    })

    if (result.status === 200) {
      router.push("/login?inscription=success")
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de l'inscription"
    issueMessage.value = error
  }
}

onMounted(async () => {
  const user = store.getUser

  if (user) {
    if (user.isAdmin) {
      router.push("/admin/dashboard")
    } else {
      try {
        const response = await $fetch("/api/fetch?type=mailIsVerified", {
          method: "POST",
          body: JSON.stringify({ mail: user.mail })
        })

        if (response.body.isMailVerified === 1) {
          router.push("/user")
        } else {
          router.push("/login/MailVerify")
        }
      } catch (error) {
        errorMessage.value = "Erreur lors de la connexion"
        issueMessage.value = error
      }
    }
  }
})
</script>
