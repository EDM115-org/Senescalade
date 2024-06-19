<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      <v-btn
        color="primary"
        prepend-icon="mdi-arrow-left"
        @click="goBack"
      >
        Retour
      </v-btn>
      Créneaux Disponibles
    </h1>

    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
    <v-row class="mb-3">
      <v-col>
        <v-btn
          color="secondary"
          @click="filterSeances('Adultes')"
        >
          Adultes
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          color="secondary"
          @click="filterSeances('Jeunes')"
        >
          Jeunes
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          color="secondary"
          @click="filterSeances('Competition')"
        >
          Compétition
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          color="secondary"
          @click="filterSeances('Babygrimpe')"
        >
          BabyGrimpe
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="filteredSeances.length">
      <v-col
        v-for="seance in filteredSeances"
        :key="seance.idSeance"
        cols="12"
        md="6"
      >
        <v-card class="mb-3">
          <v-card-title>{{ seance.typeSeance }} - {{ seance.jour }}</v-card-title>
          <v-card-subtitle>{{ seance.professeur }}</v-card-subtitle>
          <v-card-text>
            <div>Heure: {{ seance.heureDebutSeance }} - {{ seance.heureFinSeance }}</div>
            <div>Nombre de places: {{ seance.nbPlaces }}</div>
            <div>Places restantes: {{ seance.nbPlacesRestantes }}</div>
            <div>Niveau: {{ seance.niveau || 'Tous niveaux' }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col class="text-center">
        <p>Aucun créneau disponible pour cette catégorie</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useMainStore } from "~/store/main"

const store = useMainStore()
const router = useRouter()
const user = computed(() => store.getUser)

const seances = ref([])
const filteredSeances = ref([])
const loading = ref(false)
const errorMessage = ref("")
const issueMessage = ref("")

onMounted(async () => {
  if (!user.value) {
    return router.push("/login")
  }

  try {
    const response = await $fetch("/api/fetch?type=seance", {
      method: "GET",
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    if (response.status === 200) {
      seances.value = response.body
      filteredSeances.value = response.body
      loading.value = true
    } else {
      errorMessage.value = response.body.error || "Erreur lors de la récupération des créneaux."
      issueMessage.value = response.body.message || ""
    }
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
})

function filterSeances(category) {
  if (category === "Competition") {
    filteredSeances.value = seances.value.filter((seance) => seance.niveau === "Compétition")
  } else {
    filteredSeances.value = seances.value.filter((seance) => seance.typeSeance === category)
  }
}

function goBack() {
  router.push("/user")
}
</script>

<style scoped>
.fillheight {
  min-height: 100vh;
}
</style>
