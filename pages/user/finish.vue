<template>
  <v-container
    v-if="loading"
    class="flex-column justify-center"
  >
    <h1 class="text-center my-4">
      Terminer l'inscription du grimpeur
    </h1>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
    <h2 class="text-center">
      Vous devez payer {{ calculatePrice() }}€ pour l'inscription de votre grimpeur.
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

    <v-btn
      :disabled="!aPaye"
      color="success"
      text="Terminer l'inscription"
      variant="elevated"
      @click="addGrimpeurSeance"
    />
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { computed, onMounted, reactive, ref } from "vue"

const store = useMainStore()
const user = computed(() => store.getUser)
const router = useRouter()
const route = useRoute()

const aPaye = ref(false)
const errorMessage = ref("")
const issueMessage = ref("")
const idSeance = ref(null)
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
  idSeance,
  isFileDAttente: false
})

async function addGrimpeurSeance() {
  try {
    grimpeur.typeLicence = determineCategory(grimpeur.dateNaissance) === "Adultes" ? "A" : "J"

    await $fetch("/api/update?type=grimpeurSeance", {
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

  if (route.query.grimpeur) {
    const idGrimpeur = parseInt(route.query.grimpeur)
    const response3 = await $fetch("/api/fetch?type=grimpeur", {
      method: "POST",
      body: JSON.stringify({ idGrimpeur }),
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    grimpeur = { ...grimpeur, ...response3.body[0] }
    grimpeur.dateNaissance = new Date(grimpeur.dateNaissance).toISOString().split("T")[0]

    idSeance.value = route.query.seance
    grimpeur.idSeance = idSeance.value

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
