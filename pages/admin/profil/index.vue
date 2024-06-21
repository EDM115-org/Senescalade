<template>
  <v-container class="flex-column justify-center">
    <h1 class="text-center my-4">
      Modifier le mot de passe
    </h1>
    <FormUpdatePassword />
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"

definePageMeta({
  pageTransition: {
    name: "simple"
  },
  layout: "admin",
  layoutTransition: {
    name: "simple"
  }
})

const store = useMainStore()
const router = useRouter()

onMounted(() => {
  const user = store.getUser

  if (user) {
    if (!user.isAdmin) {
      router.push("/user")
    }
  } else {
    router.push("/login")
  }
})
</script>
