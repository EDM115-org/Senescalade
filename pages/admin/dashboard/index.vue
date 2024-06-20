<template>
  <v-container class="fillheight">
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
            Nombre de grimpeurs
          </v-card-title>
          <v-card-text class="text-center">
            <v-icon
              icon="mdi-account-group-outline"
              size="56"
            />
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
            Grimpeurs dont le paiement n'est pas confirmé
          </v-card-title>
          <v-card-text class="text-center">
            <v-icon
              icon="mdi-currency-eur-off"
              size="56"
            />
            <h3>{{ nonPayeCount }}</h3>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title class="text-center">
            Grimpeurs n'ayant pas été exporté
          </v-card-title>
          <v-card-text class="text-center">
            <v-icon
              icon="mdi-file-account-outline"
              size="56"
            />
            <h3>{{ isExportedCount }}</h3>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title class="text-center">
            Grimpeurs en file d'attente
          </v-card-title>
          <v-card-text class="text-center">
            <v-icon
              icon="mdi-account-clock-outline"
              size="56"
            />
            <h3>{{ isFileDAttenteCount }}</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { computed, onMounted, ref } from "vue"

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
const isExportedCount = ref(0)
const isFileDAttenteCount = ref(0)
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

const fetchIsExported = async () => {
  const result = await $fetch("/api/count?type=isExported", {
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  isExportedCount.value = result.body.isExportedCount
}

const fetchIsFileDAttente = async () => {
  const result = await $fetch("/api/count?type=isFileDAttente", {
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  isFileDAttenteCount.value = result.body.isFileDAttenteCount
}

onMounted(async () => {
  if (user.value) {
    if (!user.value.isAdmin) {
      router.push("/user")
    } else {
      await fetchGrimpeurCount()
      await fetchNonPayeCount()
      await fetchIsExported()
      await fetchIsFileDAttente()
    }
  } else {
    router.push("/login")
  }
})
</script>
