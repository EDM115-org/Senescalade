<template>
  <v-container
    v-if="loading"
    class="flex-column justify-center"
  >
    <h1 class="text-center my-4">
      Espace utilisateur
    </h1>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
    <v-row justify="center">
      <v-col
        cols="12"
        md="6"
        class="text-center"
      >
        <NuxtLink
          to="/user/add"
        >
          <v-btn
            color="success"
            class="mr-2"
            text="Inscrire un grimpeur"
            variant="elevated"
          />
        </NuxtLink>
        <NuxtLink
          to="/user/profil"
        >
          <v-btn
            color="secondary"
            class="mr-2"
            text="Modifier son profil"
            variant="elevated"
          />
        </NuxtLink>
      </v-col>
    </v-row>
    <CardUser />
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { computed, onMounted, ref } from "vue"

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
      errorMessage.value = error.data?.message ?? error
      issueMessage.value = error.data?.statusMessage ?? ""
    }
  } else {
    return router.push("/login")
  }
})
</script>
