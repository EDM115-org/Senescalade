<template>
  <v-container
    v-if="loading"
    class="flex-column justify-center"
  >
    <h1 class="text-center my-4">
      Réinscription du grimpeur
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
          subtitle="Choix de la séance"
          title="Étape 1"
          value="1"
        >
          <FullCalendarView
            :birthdate="grimpeur.dateNaissance"
            @event-click="showEventDetails"
            @no-events-left="handleNoEventsLeft"
          />
          <div v-if="selectedEvent">
            <p class="text-center mt-4">
              Séance sélectionnée : <strong>{{ selectedEvent.title }} {{ selectedEvent.extendedProps.niveau ? `- ${selectedEvent.extendedProps.niveau}` : "" }}</strong>
              <br>
              Jour : <strong>{{ selectedEvent.extendedProps.jour }} de {{ selectedEvent.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(":", "h") }} à {{ selectedEvent.end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(":", "h") }}</strong>
              <br>
              Nombre de places restantes : <strong>{{ selectedEvent.extendedProps.nbPlacesRestantes }}/{{ selectedEvent.extendedProps.nbPlaces }}</strong>
            </p>
          </div>
          <div v-if="noEventsLeft">
            <p class="text-center mt-4 mx-4">
              Toutes les séances sont complètes.<br>
              Vous pouvez selectionner une des séances complètes, et vous serez mis sur liste d'attente. Nous vous enverrons un email si une place se libère, de manière à ce que vous puissiez vous inscrire.<br>
              Si cela ne vous convient pas, annulez la réinscription du grimpeur en cliquant sur le bouton ci-dessous.
            </p>
            <v-btn
              class="d-flex mx-auto mt-4"
              color="error"
              text="Annuler la réinscription"
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
          bg-color="transparent"
          color="accent"
          subtitle="Paiement"
          title="Étape 2"
          value="2"
        >
          <div v-if="!isFileDAttente">
            <h2 class="text-center">
              Vous devez payer {{ calculatePrice() }}€ pour la réinscription de votre grimpeur.
            </h2>
            <p class="text-center">
              Si vous faites de la compétition, ajoutez 40€ au prix ci-dessus.<br>
              Si vous pensez bénéficier du tarif solidaire (RSA, chômage, étudiant.e.s), retirez 40€ au prix ci-dessus.<br>
              Remplissez le formulaire HelloAsso ci-dessous, indiquez le prix final dans le champ "Montant Libre" et suivez les instructions.
            </p>
            <iframe
              class="my-4"
              src="https://www.helloasso.com/associations/senescalade/boutiques/paiements-en-ligne/widget"
              style="height: 800px; width: 100%;"
              title="Paiement en ligne - Senescalade"
            />
            <v-checkbox
              v-model="aPaye"
              class="mx-auto"
              label="Je confirme avoir payé le montant indiqué ci-dessus"
            />
          </div>
          <div v-else>
            <h2 class="text-center">
              Vous êtes sur liste d'attente pour la séance sélectionnée.
            </h2>
            <p class="text-center">
              Vous ne pouvez pas payer pour le moment. Nous vous enverrons un email si une place se libère, de manière à ce que vous puissiez vous inscrire. Le paiement se fera à ce moment-là.
            </p>
          </div>

          <template #next>
            <v-btn
              :disabled="!isFileDAttente && !aPaye"
              color="success"
              text="Réinscription"
              variant="elevated"
              @click="addGrimpeurSeance"
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
import { computed, onMounted, reactive, ref, watch } from "vue"

const store = useMainStore()
const user = computed(() => store.getUser)
const router = useRouter()
const route = useRoute()

const aPaye = ref(false)
const calendarEvents = ref([])
const choixCreneau = ref(null)
const errorMessage = ref("")
const events = ref([])
const isLoading = ref(false)
const issueMessage = ref("")
const selectedEvent = ref(null)
const noEventsLeft = ref(false)
const isFileDattente = ref(false)
const loading = ref(false)

let grimpeur = reactive({
  action: "R",
  nom: "",
  prenom: "",
  dateNaissance: "",
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

async function addGrimpeurSeance() {
  try {
    grimpeur.typeLicence = determineCategory(grimpeur.dateNaissance) === "Adultes" ? "A" : "J"

    await $fetch("/api/add?type=grimpeurSeance", {
      method: "POST",
      body: JSON.stringify(grimpeur),
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    router.push("/user")
  } catch (error) {
    errorMessage.value = error.data?.message ?? error
    issueMessage.value = error.data?.statusMessage ?? ""
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

function determineCategory(dateNaissance) {
  const today = new Date()
  const currentYear = today.getFullYear()
  const birthYear = parseInt(dateNaissance.slice(0, 4))
  const birthMonth = parseInt(dateNaissance.slice(5, 7))

  let ageAtEndOfYear = currentYear - birthYear

  if (birthMonth > 6) {
    ageAtEndOfYear -= 1
  }

  if (ageAtEndOfYear < 4) {
    return "error"
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
    grimpeur.idSeance = choixCreneau.value

    if (value.extendedProps.nbPlacesRestantes === 0) {
      isFileDattente.value = true
      grimpeur.isFileDAttente = isFileDattente.value
      noEventsLeft.value = true
    } else {
      isFileDattente.value = false
      grimpeur.isFileDAttente = isFileDattente.value
      noEventsLeft.value = false
    }
  }
})

onMounted(async () => {
  if (user.value) {
    try {
      const response = await $fetch("/api/fetch?type=mailIsVerified", {
        method: "POST",
        body: JSON.stringify({ mail: user.value.mail }),
        headers: { Authorization: `Bearer ${user.value.token}` }
      })

      if (response.body.mailIsVerified !== 1) {
        return router.push("/login/MailVerify")
      }
    } catch (error) {
      errorMessage.value = error.data?.message ?? error
      issueMessage.value = error.data?.statusMessage ?? ""
    }
  } else {
    return router.push("/login")
  }

  const response2 = await $fetch("/api/fetch?type=seance", {
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  events.value = response2.body

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
      description: event.niveau
    }
  })

  if (route.query.grimpeur) {
    const idGrimpeur = parseInt(route.query.grimpeur)
    const response3 = await $fetch("/api/fetch?type=grimpeur", {
      method: "POST",
      body: JSON.stringify({ idGrimpeur }),
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    grimpeur = { ...grimpeur, ...response3.body[0] }
    grimpeur.dateNaissance = new Date(grimpeur.dateNaissance).toISOString().split("T")[0]

    router.replace({ query: {} })
    loading.value = true
  } else {
    router.push("/user")
  }
})
</script>

<style scoped>
.v-btn--disabled {
  opacity: 1;
}
</style>
