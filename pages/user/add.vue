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
              color="success"
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
              variant="elevated"
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
          <FullCalendarView
            :birthdate="birthdate.toISOString().split('T')[0]"
            @event-click="showEventDetails"
            @no-events-left="handleNoEventsLeft"
          />
          <div v-if="selectedEvent">
            <p class="text-center mt-4">
              Créneau sélectionné : <strong>{{ selectedEvent.title }} {{ selectedEvent.extendedProps.niveau ? `- ${selectedEvent.extendedProps.niveau}` : "" }}</strong>
              <br>
              Jour : <strong>{{ selectedEvent.extendedProps.jour }} de {{ selectedEvent.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(":", "h") }} à {{ selectedEvent.end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(":", "h") }}</strong>
              <br>
              Nombre de places restantes : <strong>{{ selectedEvent.extendedProps.nbPlacesRestantes }}/{{ selectedEvent.extendedProps.nbPlaces }}</strong>
            </p>
          </div>
          <div v-if="noEventsLeft">
            <p class="text-center mt-4 mx-4">
              Tous les créneaux sont complets.<br>
              Vous pouvez selectionner un des créneaux complets, et vous serez mis sur liste d'attente. Nous vous enverrons un email si une place se libère, de manière à ce que vous puissiez vous inscrire.<br>
              Si cela ne vous convient pas, annulez l'inscription du grimpeur en cliquant sur le bouton ci-dessous.
            </p>
            <v-btn
              class="d-flex mx-auto mt-4"
              color="error"
              text="Annuler l'inscription"
              variant="elevated"
              @click="$router.push('/user')"
            />
          </div>

          <template #next="{ next }">
            <v-btn
              :disabled="choixCreneau === null"
              :loading="isLoading"
              color="success"
              variant="elevated"
              @click="nextLoadingClick(next)"
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
          :color="step > 2 ? 'success' : 'accent'"
          :complete="step > 2"
          bg-color="transparent"
          subtitle="Informations personnelles"
          title="Étape 3"
          value="3"
        >
          <Suspense>
            <template #default>
              <FormUser
                :grimpeur="grimpeur"
              />
            </template>
            <template #fallback>
              <v-skeleton-loader
                class="mx-auto"
                height="100%"
                type="list-item-three-line"
              />
            </template>
          </Suspense>

          <template #next="{ next }">
            <v-btn
              color="success"
              text="Ajouter un grimpeur"
              variant="elevated"
              @click="nextLoadingClick(next)"
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
          subtitle="Paiement"
          title="Étape 4"
          value="4"
        >
          <h2 class="text-center">
            Vous devez payer {{ calculatePrice() }}€ pour l'inscription de votre grimpeur.
          </h2>
          <p class="text-center">
            Si vous faites de la compétition, ajoutez 40€ au prix ci-dessus.<br>
            Si vous pensez bénéficier du tarif solidaire (RSA, chômage, étudiant.e.s), retirez 40€ au prix ci-dessus.<br>
            Remplissez le formulaire HelloAsso ci-dessous, indiquez le prix final dans le champ "Montant Libre" et suivez les instructions.
          </p>
          <iframe
            allowtransparency="true"
            frameborder="0"
            class="my-4"
            scrolling="auto"
            src="https://www.helloasso.com/associations/senescalade/boutiques/paiements-en-ligne/widget"
            style="height: 800px; width: 100%; border: none;"
          />
          <v-checkbox
            v-model="aPaye"
            class="mx-auto"
            label="Je confirme avoir payé le montant indiqué ci-dessus"
          />

          <template #next>
            <v-btn
              :disabled="!aPaye"
              color="success"
              text="Ajouter un grimpeur"
              variant="elevated"
              @click="adduser"
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
      </template>
    </v-stepper-vertical>
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { onMounted, reactive, ref, watch } from "vue"
import { useDisplay } from "vuetify"

const store = useMainStore()
const { mdAndUp } = useDisplay()
const router = useRouter()

const aPaye = ref(false)
const birthdate = ref(null)
const calendarEvents = ref([])
const choixCreneau = ref(null)
const displayBirthdateHelpText = ref(false)
const errorMessage = ref("")
const events = ref([])
const isLoading = ref(false)
const issueMessage = ref("")
const selectedEvent = ref(null)
const noEventsLeft = ref(false)
const isFileDattente = ref(false)

const grimpeur = reactive({
  action: "C",
  nom: "",
  prenom: "",
  dateNaissance: birthdate.value?.toISOString().split("T")[0] ?? "",
  sexe: "",
  nationalite: "FR",
  adresse: "",
  complementAdresse: "",
  codePostal: "",
  ville: "",
  pays: "FR",
  telephone: "",
  mobile: "",
  courriel2: "",
  personneNom: "",
  personnePrenom: "",
  personneTelephone: "",
  personneCourriel: "",
  numLicence: "",
  typeLicence: "",
  assurance: "B",
  optionSki: false,
  optionSlackline: false,
  optionTrail: false,
  optionVTT: false,
  optionAssurance: "NON",
  optionProtectionAgression: false,
  fkCompte: store.getUser.id,
  idSeance: choixCreneau,
  isFileDAttente: isFileDattente
})

function nextLoadingClick(callback) {
  isLoading.value = true

  if (typeof callback === "function") {
    callback()
  }

  nextTick(() => {
    setTimeout(() => {
      isLoading.value = false
    }, 3000)
  })
}

async function adduser() {
  try {
    grimpeur.typeLicence = determineCategory(grimpeur.dateNaissance) === "Adultes" ? "A" : "J"
    const result = await $fetch("/api/add?type=grimpeur", {
      method: "POST",
      body: JSON.stringify(grimpeur),
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

function calculatePrice() {
  let price = determineCategory(grimpeur.dateNaissance) === "Babygrimpe" ? 95 : 140

  if (grimpeur.assurance === "B+") {
    price += 3
  } else if (grimpeur.assurance === "B++") {
    price += 10
  }

  if (grimpeur.optionSki) {
    price += 5
  }

  if (grimpeur.optionSlackline) {
    price += 5
  }

  if (grimpeur.optionTrail) {
    price += 10
  }

  if (grimpeur.optionVTT) {
    price += 30
  }

  if (grimpeur.optionProtectionAgression) {
    price += 1.70
  }

  if (grimpeur.optionAssurance === "IJ1") {
    price += 18
  } else if (grimpeur.optionAssurance === "IJ2") {
    price += 30
  } else if (grimpeur.optionAssurance === "IJ3") {
    price += 35
  }

  return price
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

function getEventColor(event) {
  return event.nbPlacesRestantes > 0 ? "success" : "error"
}

function showEventDetails(event) {
  selectedEvent.value = event
}

function handleNoEventsLeft() {
  noEventsLeft.value = true
}

watch(selectedEvent, (value) => {
  if (value) {
    choixCreneau.value = parseInt(value.id)

    if (value.extendedProps.nbPlacesRestantes === 0) {
      isFileDattente.value = true
    }
  }
})

watch(birthdate, (value) => {
  grimpeur.dateNaissance = value?.toISOString().split("T")[0] ?? ""
})

onMounted(async () => {
  const response = await $fetch("/api/fetch?type=seance")

  events.value = response.body

  const startOfWeek = daysOfTheCurrentWeek()[0]

  calendarEvents.value = events.value.map((event) => {
    const eventDay = dayToDayNumber(event.jour)
    const eventDate = new Date(startOfWeek)

    eventDate.setDate(startOfWeek.getDate() + eventDay - 1)

    return {
      title: event.typeSeance,
      start: new Date(`${eventDate.toISOString().split("T")[0]}T${event.heureDebutSeance}`),
      end: new Date(`${eventDate.toISOString().split("T")[0]}T${event.heureFinSeance}`),
      ...event,
      color: getEventColor(event),
      description: event.niveau,
    }
  })
})
</script>

<style scoped>
.v-btn--disabled {
  opacity: 1;
}
</style>
