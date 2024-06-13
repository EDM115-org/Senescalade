<template>
  <v-container class="fillheight">
    <h1 class="text-center my-4">
      Ajouter un grimpeur
    </h1>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
    <v-stepper-vertical
      bg-color="transparent"
      eager
      flat
      variant="accordion"
    >
      <template #default="{ step }">
        <v-stepper-vertical-item
          :color="step > 1 ? 'success' : 'accent'"
          :complete="step > 1"
          bg-color="transparent"
          subtitle="Date de naissance"
          title="Étape 1"
          value="1"
        >
          <div class="d-flex justify-center">
            <v-date-input
              v-model="birthdate"
              :allowed-dates="date => date < new Date(new Date().setHours(0, 0, 0, 0))"
              class="d-flex mx-auto"
              clearable
              icon="mdi-calendar-account-outline"
              label="Date de naissance (MM/DD/YYYY)"
              prepend-icon=""
              prepend-inner-icon="mdi-calendar-account-outline"
              :max-width="mdAndUp ? '30em' : '100em'"
              @click:clear="birthdate = null"
            />
            <v-btn
              class="ml-2"
              color="accent"
              icon="mdi-tooltip-question-outline"
              @click="displayBirthdateHelpText = !displayBirthdateHelpText"
            />
          </div>
          <p
            v-if="displayBirthdateHelpText"
            class="text-center"
          >
            Si vous écrivez la date au clavier, écrivez-la au format <strong>MM/DD/YYYY</strong> (mois/jour/année), puis appuyez sur <v-kbd>↩ Entrée</v-kbd>.<br>
            Elle sera ensuite affichée au format <strong>DD/MM/YYYY</strong> (jour/mois/année), c'est normal.
          </p>
          <p
            v-if="(birthdate && determineCategory(birthdate.toISOString().split('T')[0]) === -1) || displayBirthdateHelpText"
            class="text-center mt-4"
          >
            Votre enfant doit avoir au moins 4 ans pour pouvoir grimper.
          </p>

          <template #next="{ next }">
            <v-btn
              :color="birthdate && determineCategory(birthdate.toISOString().split('T')[0]) !== -1 ? 'success' : 'error'"
              :variant="birthdate && determineCategory(birthdate.toISOString().split('T')[0]) !== -1 ? 'elevated' : 'outlined'"
              :disabled="!birthdate || determineCategory(birthdate.toISOString().split('T')[0]) === -1"
              @click="next"
            />
          </template>

          <template #prev />
        </v-stepper-vertical-item>

        <v-stepper-vertical-item
          :color="step > 2 ? 'success' : 'accent'"
          :complete="step > 2"
          bg-color="transparent"
          subtitle="Choix du créneau"
          title="Étape 2"
          value="2"
        >
          {{ events }}
          <v-sheet>
            <v-calendar
              ref="calendar"
              :allowed-dates="daysOfTheCurrentWeek"
              interval-format="fullTime24h"
              hide-header
              view-mode="week"
            />
          </v-sheet>

          <template #next="{ next }">
            <v-btn
              color="success"
              variant="elevated"
              @click="next"
            />
          </template>

          <template #prev="{ prev }">
            <v-btn
              color="accent"
              variant="outlined"
              @click="prev"
            />
          </template>
        </v-stepper-vertical-item>

        <v-stepper-vertical-item
          bg-color="transparent"
          color="accent"
          subtitle="Informations personnelles"
          title="Étape 3"
          value="3"
          @click:next="console.log('next')"
        >
          <FormUser
            :birthdate="birthdate.toISOString().split('T')[0]"
            @submit:adduser="adduser($event)"
          />

          <template #next="{ next }">
            <v-btn
              color="success"
              text="Finish"
              variant="elevated"
              @click="next"
            />
          </template>

          <template #prev="{ prev }">
            <v-btn
              v-if="!finished"
              color="accent"
              variant="outlined"
              @click="prev"
            />

            <v-btn
              v-else
              text="Reset"
              variant="outlined"
              @click="console.log('reset')"
            />
          </template>
        </v-stepper-vertical-item>
      </template>
    </v-stepper-vertical>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useDisplay } from "vuetify"

const { mdAndUp } = useDisplay()
const router = useRouter()

const birthdate = ref(null)
const displayBirthdateHelpText = ref(false)
const errorMessage = ref("")
const events = ref([])
const finished = ref(false)
const issueMessage = ref("")

async function adduser(event) {
  try {
    const result = await $fetch("/api/addGrimpeur", {
      method: "POST",
      body: JSON.stringify(event),
    })

    if (result.status === 200) {
      router.push("/user")
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de l'ajout du grimpeur"
    issueMessage.value = error
  }
}

function daysOfTheCurrentWeek() {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(today.setDate(diff))
  const days = []

  for (let i = 0; i < 7; i++) {
    days.push(new Date(monday))
    monday.setDate(monday.getDate() + 1)
  }

  return days
}

function determineCategory(birthDate) {
  const today = new Date()
  const currentYear = today.getFullYear()
  const birthYear = parseInt(birthDate.slice(0, 4))
  const birthMonth = parseInt(birthDate.slice(5, 7))

  let ageAtEndOfYear = currentYear - birthYear

  if (birthMonth > 6) {
    ageAtEndOfYear -= 1
  }

  if (ageAtEndOfYear < 4) {
    return -1
  } else if (ageAtEndOfYear <= 8) {
    return "Babygrimpe"
  } else if (ageAtEndOfYear <= 10) {
    return "U10"
  } else if (ageAtEndOfYear <= 12) {
    return "U12"
  } else if (ageAtEndOfYear <= 14) {
    return "U14"
  } else if (ageAtEndOfYear <= 16) {
    return "U16"
  } else if (ageAtEndOfYear <= 18) {
    return "U18"
  } else if (ageAtEndOfYear <= 20) {
    return "U20"
  } else {
    return "Adultes"
  }
}

function dayToDayNumber(day) {
  switch (day.toLowerCase()) {
    case "lundi":
      return 1
    case "mardi":
      return 2
    case "mercredi":
      return 3
    case "jeudi":
      return 4
    case "vendredi":
      return 5
    case "samedi":
      return 6
    case "dimanche":
      return 7
    default:
      return 0
  }
}

onMounted(async () => {
  const response = await $fetch("/api/fetchSeance")

  events.value = response.body
})
</script>

<style scoped>
.v-btn--disabled {
  opacity: 1
}
</style>
