<template>
  <v-container
    v-if="adminLogged"
    class="fillheight"
  >
    <LayoutNavBarAdmin />
    <div>
      <CardUser />
    </div>
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { useRouter } from "vue-router"

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

