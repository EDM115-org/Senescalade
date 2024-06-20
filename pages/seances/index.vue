<template>
  <v-container class="h-screen">
    <h1 class="text-center mt-5 mb-5">
      <v-btn
        color="primary"
        class="mr-2"
        prepend-icon="mdi-chevron-left"
        text="Retour"
        @click="$router.push('/')"
      />
      Séances
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
          text="Tous"
          @click="filterSeances('Tous')"
        />
      </v-col>
      <v-col>
        <v-btn
          color="secondary"
          text="Adultes"
          @click="filterSeances('Adultes')"
        />
      </v-col>
      <v-col>
        <v-btn
          color="secondary"
          text="Jeunes"
          @click="filterSeances('Jeunes')"
        />
      </v-col>
      <v-col>
        <v-btn
          color="secondary"
          text="Competition"
          @click="filterSeances('Competition')"
        />
      </v-col>
      <v-col>
        <v-btn
          color="secondary"
          text="Babygrimpe"
          @click="filterSeances('Babygrimpe')"
        />
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
          <v-card-title>{{ seance.typeSeance }} {{ seance.niveau ? `(${seance.niveau})` : "" }} - {{ seance.jour }}</v-card-title>
          <v-card-text>
            Horaires : {{ seance.heureDebutSeance }} - {{ seance.heureFinSeance }}<br>
            Nombre de places : {{ seance.nbPlaces }}<br>
            Places restantes : {{ seance.nbPlacesRestantes }}
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
import { onMounted, ref } from "vue"

const seances = ref([])
const filteredSeances = ref([])
const errorMessage = ref("")
const issueMessage = ref("")

onMounted(async () => {
  try {
    const response = await $fetch("/api/fetch?type=seance")

    seances.value = response.body
    filteredSeances.value = response.body
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
})

function filterSeances(category) {
  if (category === "Tous") {
    filteredSeances.value = seances.value
  } else if (category === "Competition") {
    filteredSeances.value = seances.value.filter((seance) => seance.niveau === "Compétition")
  } else {
    filteredSeances.value = seances.value.filter((seance) => seance.typeSeance === category)
  }
}
</script>
