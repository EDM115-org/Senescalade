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

onMounted(async () => {
  const user = store.getUser

  try {
    const response = await $fetch("/api/getPermAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: user
      })
    })

    if (response) {
      if (response.body[0].ReadListGrimpeur !== 1) {
        return router.push("/admin/dashboard")
      }
    } else {
      console.error("Error getPermAdmin:", response.statusText)
    }
  } catch (error) {
    console.error("Error getPermAdmin:", error.message)
  }

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

