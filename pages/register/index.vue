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
          text="Se connecter"
          type="submit"
          variant="elevated"
          @click="$router.push('/login')"
        />
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
    await $fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(event)
    })

    router.push("/login?inscription=success")
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
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
        errorMessage.value = error.data.message
        issueMessage.value = error.data.statusMessage ?? ""
      }
    }
  }
})
</script>
