<template>
  <v-container class="fillheight">
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
              Grimpeurs n'ayant pas payé
            </v-card-title>
            <v-card-text class="text-center">
              <v-icon size="56">
                mdi-currency-eur-off
              </v-icon>
              <h3>{{ nonPayeCount }}</h3>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from "vue"
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
const grimpeurCount = ref(0)
const nonPayeCount = ref(0)
const user = computed(() => store.getUser)

const fetchGrimpeurCount = async () => {
  const result = await $fetch("/api/count?type=grimpeur", {
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  grimpeurCount.value = result.body.grimpeurCount
}

const fetchNonPayeCount = async () => {
  const result = await $fetch("/api/count?type=nonPaye", {
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  nonPayeCount.value = result.body.nonPayeCount
}

onMounted(async () => {
  const user = store.getUser

  if (user) {
    if (!user.isAdmin) {
      router.push("/user")
    } else {
      await fetchGrimpeurCount()
      await fetchNonPayeCount()
    }
  } else {
    router.push("/login")
  }
})
</script>
