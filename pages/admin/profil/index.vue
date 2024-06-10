<template>
  <v-container class="fillheight">
    <LayoutNavBarAdmin v-if="isLoading" />
    <div v-if="isLoading">
      <!-- Formulaire de mise à jour du mot de passe -->
      <FormUpdatePassword />
    </div>
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { useRouter } from "vue-router"

const store = useMainStore()
const router = useRouter()
const isLoading = ref(false)

onMounted(() => {
  const user = store.getUser

  if (user) {
    if (user.isAdmin !== 1) {
      router.push("/user")
    } else {
      isLoading.value = true
    }
  } else {
    router.push("/login")
  }
})
</script>
