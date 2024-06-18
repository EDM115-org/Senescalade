<template>
  <v-container class="fillheight">
    <div>
      <h1 class="text-center mt-5 mb-5">
        Réinscription
      </h1>

      <!-- Formulaire pour modifier les dates de réinscription -->
      <v-form @submit.prevent="submitDatesForm">
        <v-row>
          <v-col cols="4">
            <p class="text-center">
              Date de réinscription pour les inscrits
            </p>
            <v-date-picker
              v-model="datesForm.dateReinscriptionIsInscrit"
              label="Date de réinscription pour les inscrits"
              required
            />
          </v-col>
          <v-col cols="4">
            <p class="text-center">
              Date de réinscription pour tous
            </p>
            <v-date-picker
              v-model="datesForm.dateReinscriptionEveryone"
              label="Date de réinscription pour tous"
              required
            />
          </v-col>
          <v-col cols="4">
            <p class="text-center">
              Date de fin de réinscription
            </p>
            <v-date-picker
              v-model="datesForm.dateFinReinscription"
              label="Date de fin de réinscription"
              required
            />
          </v-col>
          <v-col
            cols="12"
            class="text-center"
          >
            <v-btn
              color="primary"
              type="submit"
            >
              Modifier les dates
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <!-- Formulaire pour changer l'état de réinscription (ouvert/fermé) -->
      <v-form @submit.prevent="submitOpenForm">
        <v-row>
          <v-col cols="12">
            <v-checkbox
              v-model="openForm.inscritionOpen"
              label="Réinscription ouverte"
            />
          </v-col>
          <v-col
            cols="12"
            class="text-center"
          >
            <v-btn
              color="primary"
              type="submit"
            >
              Modifier l'état de réinscription
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <!-- Bouton pour vider les inscriptions aux séances avec confirmation -->
      <v-row>
        <v-col
          cols="12"
          class="text-center"
        >
          <v-btn
            color="error"
            @click="openClearPopup"
          >
            Vider les inscriptions aux séances
          </v-btn>
        </v-col>
      </v-row>

      <!-- Popup de confirmation pour vider les inscriptions aux séances -->
      <v-dialog
        v-model="clearPopup"
        max-width="400"
      >
        <v-card>
          <v-card-title class="headline">
            Confirmation
          </v-card-title>
          <v-card-text>
            Êtes-vous sûr de vouloir vider toutes les inscriptions aux séances ?
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="clearReinscriptions"
            >
              Confirmer
            </v-btn>
            <v-btn
              color="secondary"
              text
              @click="clearPopup = false"
            >
              Annuler
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Message d'erreur ou de succès -->
      <v-snackbar
        v-model="snackbar"
        :color="messageColor"
        top
      >
        {{ errorMessage }}
        <v-btn
          dark
          text
          @click="snackbar = false"
        >
          Fermer
        </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"

definePageMeta({
  pageTransition: {
    name: "simple"
  },
  layout: "admin",
  layoutTransition: {
    name: "simple"
  }
})

const datesForm = ref({
  dateReinscriptionIsInscrit: new Date(),
  dateReinscriptionEveryone: new Date(),
  dateFinReinscription: new Date(),
})

const openForm = ref({
  inscritionOpen: false,
})

const clearPopup = ref(false)
const snackbar = ref(false)
const errorMessage = ref("")
const messageColor = ref("")

onMounted(async () => {
  try {
    const response = await $fetch("/api/fetch?type=reinscription", {
      method: "GET"
    })

    if (response.status === 200) {
      const reinscriptions = response.body[0]

      // Convertir les dates ISO 8601 en objets Date
      datesForm.value.dateReinscriptionIsInscrit = new Date(reinscriptions.dateReinscriptionIsInscrit)
      datesForm.value.dateReinscriptionEveryone = new Date(reinscriptions.dateReinscriptionEveryone)
      datesForm.value.dateFinReinscription = new Date(reinscriptions.dateFinReinscription)

      if (reinscriptions.inscritionOpen === 1) { openForm.value.inscritionOpen = true } else { openForm.value.inscritionOpen = false }

      console.log(reinscriptions.inscritionOpen)
    } else {
      messageColor.value = "error"
      errorMessage.value = response.body.error || "Erreur lors de la récupération des réinscriptions."
      snackbar.value = true
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    messageColor.value = "error"
    errorMessage.value = "Erreur lors de la récupération des réinscriptions."
    snackbar.value = true
  }
})

// Soumettre le formulaire pour modifier les dates de réinscription
async function submitDatesForm() {
  try {
    const response = await $fetch("/api/reinscription?type=update", {
      method: "POST",
      body: JSON.stringify({
        dateReinscriptionIsInscrit: datesForm.value.dateReinscriptionIsInscrit.toISOString(),
        dateReinscriptionEveryone: datesForm.value.dateReinscriptionEveryone.toISOString(),
        dateFinReinscription: datesForm.value.dateFinReinscription.toISOString()
      })
    })

    if (response.status === 200) {
      messageColor.value = "success"
      errorMessage.value = response.body.message || "Dates de réinscription mises à jour."
      snackbar.value = true
    } else {
      messageColor.value = "error"
      errorMessage.value = response.body.error || "Erreur lors de la mise à jour des dates de réinscription."
      snackbar.value = true
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    messageColor.value = "error"
    errorMessage.value = "Erreur lors de la mise à jour des dates de réinscription."
    snackbar.value = true
  }
}

// Soumettre le formulaire pour changer l'état de réinscription (ouvert/fermé)
async function submitOpenForm() {
  try {
    const response = await $fetch("/api/reinscription?type=open", {
      method: "POST",
      body: JSON.stringify({
        inscritionOpen: openForm.value.inscritionOpen
      })
    })

    if (response.status === 200) {
      messageColor.value = "success"
      errorMessage.value = response.body.message || "État de réinscription mis à jour."
      snackbar.value = true
    } else {
      messageColor.value = "error"
      errorMessage.value = response.body.error || "Erreur lors de la mise à jour de l'état de réinscription."
      snackbar.value = true
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    messageColor.value = "error"
    errorMessage.value = "Erreur lors de la mise à jour de l'état de réinscription."
    snackbar.value = true
  }
}

// Ouvrir la popup de confirmation pour vider les inscriptions aux séances
function openClearPopup() {
  clearPopup.value = true
}

// Vider les inscriptions aux séances
async function clearReinscriptions() {
  try {
    const response = await $fetch("/api/reinscription?type=clear", {
      method: "POST"
    })

    if (response.status === 200) {
      messageColor.value = "success"
      errorMessage.value = response.body.message || "Inscriptions aux séances vidées."
      snackbar.value = true
    } else {
      messageColor.value = "error"
      errorMessage.value = response.body.error || "Erreur lors de la suppression des inscriptions aux séances."
      snackbar.value = true
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    messageColor.value = "error"
    errorMessage.value = "Erreur lors de la suppression des inscriptions aux séances."
    snackbar.value = true
  } finally {
    clearPopup.value = false
  }
}
</script>
