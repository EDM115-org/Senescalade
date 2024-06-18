<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Réinscription
    </h1>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
      :color="messageColor"
    />

    <!-- Formulaire pour modifier les dates de réinscription -->
    <v-form @submit.prevent="submitDatesForm">
      <v-row justify="center">
        <v-col
          cols="12"
          md="4"
          class="text-center"
        >
          <p>Date de réinscription pour les inscrits</p>
          <v-date-picker
            v-model="datesForm.dateReinscriptionIsInscrit"
            required
            class="mx-auto"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="text-center"
        >
          <p>Date de réinscription pour tous</p>
          <v-date-picker
            v-model="datesForm.dateReinscriptionEveryone"
            required
            class="mx-auto"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="text-center"
        >
          <p>Date de fin de réinscription</p>
          <v-date-picker
            v-model="datesForm.dateFinReinscription"
            required
            class="mx-auto"
          />
        </v-col>
        <v-col
          cols="12"
          class="text-center"
        >
          <!-- Bouton de validation pour les dates -->
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
    <v-row justify="center">
      <v-col
        cols="12"
        md="4"
        class="d-flex justify-center"
      >
        <v-checkbox
          v-model="openForm.inscritionOpen"
          label="Ouvrir la réinscription"
          @change="submitOpenForm"
        />
      </v-col>
    </v-row>

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
    <PopupClearSeanceGrimpeur
      ref="clearDialog"
      @confirm-clear="clearReinscriptions"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { format } from "date-fns"

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
  inscritionOpen: false
})

const clearDialog = ref(null)
const errorMessage = ref("")
const messageColor = ref("")
const issueMessage = ref("")

onMounted(async () => {
  try {
    const response = await $fetch("/api/fetch?type=reinscription")

    const reinscriptions = response.body

    // Convertir les dates ISO 8601 en objets Date
    datesForm.value.dateReinscriptionIsInscrit = new Date(reinscriptions.dateReinscriptionIsInscrit)
    datesForm.value.dateReinscriptionEveryone = new Date(reinscriptions.dateReinscriptionEveryone)
    datesForm.value.dateFinReinscription = new Date(reinscriptions.dateFinReinscription)

    if (reinscriptions.inscritionOpen === 1) { openForm.value.inscritionOpen = true } else { openForm.value.inscritionOpen = false }
  } catch (error) {
    messageColor.value = "error"
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
})

// Soumettre le formulaire pour modifier les dates de réinscription
async function submitDatesForm() {
  try {
    const response = await $fetch("/api/reinscription?type=update", {
      method: "POST",
      body: JSON.stringify({
        dateReinscriptionIsInscrit: format(datesForm.value.dateReinscriptionIsInscrit, "yyyy-MM-dd"),
        dateReinscriptionEveryone: format(datesForm.value.dateReinscriptionEveryone, "yyyy-MM-dd"),
        dateFinReinscription: format(datesForm.value.dateFinReinscription, "yyyy-MM-dd")
      })
    })

    if (response.status === 200) {
      messageColor.value = "success"
      errorMessage.value = "Dates de réinscription mises à jour"
      issueMessage.value = response.body.message ?? ""
    } else {
      messageColor.value = "error"
      errorMessage.value = "Erreur lors de la mise à jour des dates de réinscription"
      issueMessage.value = response.body.error ?? ""
    }
  } catch (error) {
    messageColor.value = "error"
    errorMessage.value = "Erreur lors de la mise à jour des dates de réinscription"
    issueMessage.value = error
  }
}

// Soumettre la modification de l'état de réinscription (ouvert/fermé)
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
      issueMessage.value = "Mise à jour de l'état de réinscription"
    } else {
      messageColor.value = "error"
      errorMessage.value = response.body.error || "Erreur lors de la mise à jour de l'état de réinscription."
      issueMessage.value = "Mise à jour de l'état de réinscription"
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    messageColor.value = "error"
    errorMessage.value = "Erreur lors de la mise à jour de l'état de réinscription."
    issueMessage.value = "Mise à jour de l'état de réinscription"
  }
}

// Ouvrir la popup de confirmation pour vider les inscriptions aux séances
function openClearPopup() {
  clearDialog.value.open()
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
      issueMessage.value = "Suppression des inscriptions aux séances"
    } else {
      messageColor.value = "error"
      errorMessage.value = response.body.error || "Erreur lors de la suppression des inscriptions aux séances."
      issueMessage.value = "Suppression des inscriptions aux séances"
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    messageColor.value = "error"
    errorMessage.value = "Erreur lors de la suppression des inscriptions aux séances."
    issueMessage.value = "Suppression des inscriptions aux séances"
  }
}
</script>
