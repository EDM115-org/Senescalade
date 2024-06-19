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
      :errors="errorMessage"
      :message-color="messageColor"
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
          variant="elevated"
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
  try {
    const result = await $fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(event)
    })

    const response = await $fetch("/api/fetch?type=isCompteAdmin", {
      method: "POST",
      body: JSON.stringify({ idCompte: result.body.user.id })
    })

    result.body.user = { ...result.body.user, isAdmin: response.body.isAdmin }
    store.login(result.body.user, result.body.stayConnected)

    if (result.body.user.isAdmin === true) {
      router.push("/admin/dashboard")
    } else {
      try {
        const response = await $fetch("/api/fetch?type=mailIsVerified", {
          method: "POST",
          body: JSON.stringify({ mail: result.body.user.mail })
        })

        if (response.body.mailIsVerified === 1) {
          router.push("/user")
        } else {
          try {
            await $fetch("/api/mailVerify?type=mail", {
              method: "POST",
              body: JSON.stringify({
                email: result.body.user.mail
              })
            })

            router.push("/login/MailVerify")
          } catch (error) {
            messageColor.value = "error"
            errorMessage.value = error.data.message
            issueMessage.value = error.data.statusMessage ?? ""
          }
        }
      } catch (error) {
        messageColor.value = "error"
        errorMessage.value = error.data.message
        issueMessage.value = error.data.statusMessage ?? ""
      }
    }
  } catch (error) {
    messageColor.value = "error"
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

onMounted(async () => {
  const user = store.getUser

  if (user) {
    if (user.isAdmin === 1) {
      router.push("/admin/dashboard")
    } else {
      try {
        const response = await $fetch("/api/fetch?type=mailIsVerified", {
          method: "POST",
          body: JSON.stringify({ mail: user.mail })
        })

        if (response.body.mailIsVerified === 1) {
          router.push("/user")
        } else {
          router.push("/login/MailVerify")
        }
      } catch (error) {
        messageColor.value = "error"
        errorMessage.value = error.data.message
        issueMessage.value = error.data.statusMessage ?? ""
      }
    }
  }

  if (route.query.inscription === "success") {
    errorMessage.value = "Inscription réussie, veuillez vous connecter"
    messageColor.value = "success"
    router.replace({ query: {} })
  }
})
</script>
