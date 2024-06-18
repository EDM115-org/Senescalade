<template>
  <v-container
    v-if="loading"
    class="fillheight"
  >
    <h1
      class="text-center mt-5 mb-5"
    >
      Espace utilisateur
    </h1>
    <NuxtLink
      to="/user/add"
    >
      <v-btn
        color="secondary"
        class="mr-2"
        variant="elevated"
      >
        Ajouter un grimpeur
      </v-btn>
    </NuxtLink>
    <NuxtLink
      to="/user/profil"
    >
      <v-btn
        color="secondary"
        variant="elevated"
      >
        modifier son profil
      </v-btn>
    </NuxtLink>
    <CardUser />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useMainStore } from "~/store/main"

const store = useMainStore()
const router = useRouter()
const user = store.getUser

const loading = ref(false)

onMounted(async () => {
  if (user) {
    try {
      const response = await $fetch("/api/fetch?type=mailIsVerified", {
        method: "POST",
        body: JSON.stringify({ mail: user.mail })
      })

      if (response.body.mailIsVerified === 1) {
        loading.value = true
      } else {
        return router.push("/login/MailVerify")
      }
    } catch (error) {
      console.error(error)
    }
  } else {
    return router.push("/login")
  }
})
</script>
