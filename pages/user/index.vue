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
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
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
        class="mr-2"
        variant="elevated"
      >
        modifier son profil
      </v-btn>
    </NuxtLink>
    <NuxtLink
      to="/user/cours"
    >
      <v-btn
        color="secondary"
        variant="elevated"
      >
        Voir les créneaux disponibles
      </v-btn>
    </NuxtLink>
    <CardUser />
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from "vue"
import { useMainStore } from "~/store/main"

const store = useMainStore()
const router = useRouter()
const user = computed(() => store.getUser)

const loading = ref(false)

const errorMessage = ref("")
const issueMessage = ref("")

onMounted(async () => {
  if (user.value) {
    try {
      const response = await $fetch("/api/fetch?type=mailIsVerified", {
        method: "POST",
        body: JSON.stringify({ mail: user.value.mail }),
        headers: { Authorization: `Bearer ${user.value.token}` }
      })

      if (response.body.mailIsVerified === 1) {
        loading.value = true
      } else {
        return router.push("/login/MailVerify")
      }
    } catch (error) {
      errorMessage.value = error.data.message
      issueMessage.value = error.data.statusMessage ?? ""
    }
  } else {
    return router.push("/login")
  }
})
</script>
