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
          <v-btn
            color="primary"
            type="submit"
          >
            Modifier les dates
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-row justify="center">
      <v-col
        cols="12"
        md="4"
        class="d-flex justify-center"
      >
        <v-checkbox
          v-model="openForm.inscriptionOpen"
          label="Ouvrir la réinscription"
          @change="submitOpenForm"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        class="text-center"
      >
        <v-btn
          color="error"
          @click="openClearPopup"
        >
          Lancer la réinscription
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
import { useMainStore } from "~/store/main"
import { computed, onMounted, ref } from "vue"

const store = useMainStore()
const user = computed(() => store.getUser)

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
  dateFinReinscription: new Date()
})

const openForm = ref({
  inscriptionOpen: false
})

const clearDialog = ref(null)
const errorMessage = ref("")
const messageColor = ref("")
const issueMessage = ref("")

onMounted(async () => {
  try {
    const response = await $fetch("/api/fetch?type=reinscription", {
      headers: { Authorization: `Bearer ${user.value.token}` }
    })
    const reinscriptions = response.body

    datesForm.value.dateReinscriptionIsInscrit = new Date(reinscriptions.dateReinscriptionIsInscrit)
    datesForm.value.dateReinscriptionEveryone = new Date(reinscriptions.dateReinscriptionEveryone)
    datesForm.value.dateFinReinscription = new Date(reinscriptions.dateFinReinscription)

    if (reinscriptions.inscriptionOpen === 1) {
      openForm.value.inscriptionOpen = true
    } else {
      openForm.value.inscriptionOpen = false
    }
  } catch (error) {
    messageColor.value = "error"
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
})

const formatDateToYYYYMMDD = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

async function submitDatesForm() {
  try {
    const response = await $fetch("/api/reinscription?type=update", {
      method: "POST",
      body: JSON.stringify({
        dateReinscriptionIsInscrit: formatDateToYYYYMMDD(datesForm.value.dateReinscriptionIsInscrit),
        dateReinscriptionEveryone: formatDateToYYYYMMDD(datesForm.value.dateReinscriptionEveryone),
        dateFinReinscription: formatDateToYYYYMMDD(datesForm.value.dateFinReinscription)
      }),
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    messageColor.value = "success"
    errorMessage.value = "Dates de réinscription mises à jour"
    issueMessage.value = response.body.message ?? ""
  } catch (error) {
    messageColor.value = "error"
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

async function submitOpenForm() {
  try {
    const response = await $fetch("/api/reinscription?type=open", {
      method: "POST",
      body: JSON.stringify({
        inscriptionOpen: openForm.value.inscriptionOpen
      }),
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    messageColor.value = "success"
    errorMessage.value = response.body.message || "État de réinscription mis à jour."
    issueMessage.value = "Mise à jour de l'état de réinscription"
  } catch (error) {
    messageColor.value = "error"
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

function openClearPopup() {
  clearDialog.value.open()
}

async function clearReinscriptions() {
  try {
    const response = await $fetch("/api/reinscription?type=clear", {
      method: "POST",
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    messageColor.value = "success"
    errorMessage.value = response.body.message || "Inscriptions aux séances vidées."
    issueMessage.value = "Suppression des inscriptions aux séances"
  } catch (error) {
    messageColor.value = "error"
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}
</script>
