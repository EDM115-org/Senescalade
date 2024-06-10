<template>
  <v-container class="fillheight">
    <LayoutNavBarAdmin v-if="isLoading" />
    <div v-if="isLoading">
      <h1 class="text-center mt-5 mb-5">
        Connexion
      </h1>
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
