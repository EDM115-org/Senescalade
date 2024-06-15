<template>
  <v-container
    v-if="adminLogged"
    class="fillheight"
  >
    <div>
      <h1 class="text-center mt-5 mb-5">
        Dashboard
      </h1>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-title class="text-center">
              Nombre de Grimpeurs
            </v-card-title>
            <v-card-text class="text-center">
              <v-icon size="56">
                mdi-account-group
              </v-icon>
              <h3>{{ grimpeurCount }}</h3>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-title class="text-center">
              Personnes n'ayant pas payé
            </v-card-title>
            <v-card-text class="text-center">
              <v-icon size="56">
                mdi-currency-eur-off
              </v-icon>
              <h3>{{ nonPayersCount }}</h3>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
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
const grimpeurCount = ref(0)
const nonPayersCount = ref(0)

const fetchGrimpeurCount = async () => {
  try {
    const result = await $fetch("/api/countGrimpeur")

    if (result.status === 200) {
      grimpeurCount.value = result.body.personneCount
    } else {
      console.error("Error fetching grimpeur count:", result)
    }
  } catch (error) {
    console.error("Error fetching grimpeur count:", error)
  }
}

const fetchNonPayersCount = async () => {
  try {
    const result = await $fetch("/api/countNonPayers")

    if (result.status === 200) {
      nonPayersCount.value = result.body.nonPayersCount
    } else {
      console.error("Error fetching non-payers count:", result)
    }
  } catch (error) {
    console.error("Error fetching non-payers count:", error)
  }
}

onMounted(async () => {
  const user = store.getUser

  if (user) {
    if (!user.isAdmin) {
      router.push("/user")
    } else {
      adminLogged.value = true
      fetchGrimpeurCount()
      fetchNonPayersCount()
    }
  } else {
    router.push("/login")
  }
})
</script>
