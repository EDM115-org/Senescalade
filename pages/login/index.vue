<template>
  <v-container class="flex-column justify-center">
    <h1 class="text-center my-4">
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
          text="S'inscrire"
          type="submit"
          variant="elevated"
          @click="$router.push('/register')"
        />
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
    const result = await performLogin(event)
    const user = await enrichUserWithAdminStatus(result)

    store.login(user, result.body.stayConnected)

    if (user.isAdmin) {
      router.push("/admin/dashboard")
    } else {
      await handleNonAdminUser(user)
    }
  } catch (error) {
    handleError(error)
  }
}

async function performLogin(event) {
  return await $fetch("/api/login", {
    method: "POST",
    body: JSON.stringify(event)
  })
}

async function enrichUserWithAdminStatus(result) {
  const response = await $fetch("/api/fetch?type=isCompteAdmin", {
    method: "POST",
    body: JSON.stringify({ idCompte: result.body.user.id }),
    headers: { Authorization: `Bearer ${result.body.token}` }
  })

  return {
    ...result.body.user,
    isAdmin: response.body.isAdmin,
    token: result.body.token
  }
}

async function handleNonAdminUser(user) {
  try {
    const response = await checkMailVerification(user.mail, user.token)

    if (response.body.mailIsVerified === 1) {
      router.push("/user")
    } else {
      await sendMailVerification(user.mail)
      router.push("/login/MailVerify")
    }
  } catch (error) {
    handleError(error)
  }
}

async function checkMailVerification(mail, token) {
  return await $fetch("/api/fetch?type=mailIsVerified", {
    method: "POST",
    body: JSON.stringify({ mail }),
    headers: { Authorization: `Bearer ${token}` }
  })
}

async function sendMailVerification(mail) {
  try {
    await $fetch("/api/mailVerify?type=mail", {
      method: "POST",
      body: JSON.stringify({ email: mail })
    })
  } catch (error) {
    handleError(error)
  }
}

function handleError(error) {
  messageColor.value = "error"
  errorMessage.value = error.data?.message ?? error
  issueMessage.value = error.data?.statusMessage ?? ""
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
          body: JSON.stringify({ mail: user.mail }),
          headers: { Authorization: `Bearer ${user.token}` }
        })

        if (response.body.mailIsVerified === 1) {
          router.push("/user")
        } else {
          router.push("/login/MailVerify")
        }
      } catch (error) {
        messageColor.value = "error"
        errorMessage.value = error.data?.message ?? error
        issueMessage.value = error.data?.statusMessage ?? ""
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
