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
              :allowed-dates="date => date < new Date()"
              class="d-flex mx-auto"
              clearable
              icon="mdi-calendar-account-outline"
              label="Date de naissance"
              prepend-icon=""
              prepend-inner-icon="mdi-calendar-account-outline"
              :max-width="mdAndUp ? '30em' : '100em'"
              @click:clear="birthdate = null"
            />
          </div>

          <template #next="{ next }">
            <v-btn
              :color="birthdate ? 'success' : 'error'"
              :variant="birthdate ? 'elevated' : 'outlined'"
              :disabled="!birthdate"
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
            :birthdate="birthdate.toLocaleDateString('fr-FR').split('/').reverse().join('-')"
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
  const currentYear = new Date().getFullYear()
  const birthYear = parseInt(birthDate.split("-")[0])
  const age = currentYear - birthYear

  if (age < 6) {
    return "Babygrimpe"
  } else if (age < 10) {
    return "U10"
  } else if (age < 12) {
    return "U12"
  } else if (age < 14) {
    return "U14"
  } else if (age < 16) {
    return "U16"
  } else if (age < 18) {
    return "U18"
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
  opacity: 1;
}
</style>
