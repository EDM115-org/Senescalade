<template>
  <v-container
    v-if="adminLogged"
    class="fillheight"
  >
    <div>
      <h1 class="text-center mt-5 mb-5">
        Dashboard
      </h1>
    </div>
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
const adminLogged = ref(false)

onMounted(() => {
  const user = store.getUser

  if (user) {
    if (user.isAdmin !== 1) {
      router.push("/user")
    } else {
      adminLogged.value = true
    }
  } else {
    router.push("/login")
  }
})
</script>
