<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>Détails du grimpeur</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-list>
              <v-list-item
                v-for="(value, key) in displayedFields"
                :key="key"
              >
                <v-list-item-title>{{ key }}</v-list-item-title>
                <v-list-item-subtitle>{{ formatValue(value) }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          variant="elevated"
          @click="close"
        >
          Fermer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { ref, computed } from "vue"

const store = useMainStore()
const user = computed(() => store.getUser)

const isOpen = ref(false)
const grimpeur = ref({
  idGrimpeur: null,
  action: "",
  nom: "",
  prenom: "",
  dateNaissance: "",
  sexe: "",
  nationalite: "",
  adresse: "",
  complementAdresse: "",
  codePostal: "",
  ville: "",
  pays: "",
  telephone: "",
  mobile: "",
  courriel2: "",
  personneNom: "",
  personnePrenom: "",
  personneTelephone: "",
  personneCourriel: "",
  numLicence: "",
  typeLicence: "",
  assurance: "",
  optionSki: false,
  optionSlackline: false,
  optionTrail: false,
  optionVTT: false,
  optionAssurance: "",
  optionProtectionAgression: false,
  fkCompte: 0,
  aPaye: false,
  idSeance: null
})

const formattedDateNaissance = computed(() => {
  return grimpeur.value.dateNaissance
    ? new Intl.DateTimeFormat("default", { year: "numeric", month: "short", day: "numeric" }).format(new Date(grimpeur.value.dateNaissance))
    : "Aucun"
})

const formatValue = (value) => {
  return value ? value : "Aucun"
}

const displayedFields = computed(() => {
  return {
    "Action": grimpeur.value.action,
    "Nom": grimpeur.value.nom,
    "Prénom": grimpeur.value.prenom,
    "Date de Naissance": formattedDateNaissance.value,
    "Sexe": grimpeur.value.sexe,
    "Nationalité": grimpeur.value.nationalite,
    "Adresse": grimpeur.value.adresse,
    "Complément d'adresse": grimpeur.value.complementAdresse,
    "Code Postal": grimpeur.value.codePostal,
    "Ville": grimpeur.value.ville,
    "Pays": grimpeur.value.pays,
    "Téléphone": grimpeur.value.telephone,
    "Mobile": grimpeur.value.mobile,
    "Courriel": grimpeur.value.courriel2,
    "Nom de la personne à contacter": grimpeur.value.personneNom,
    "Prénom de la personne à contacter": grimpeur.value.personnePrenom,
    "Téléphone de la personne à contacter": grimpeur.value.personneTelephone,
    "Courriel de la personne à contacter": grimpeur.value.personneCourriel,
    "Numéro de Licence": grimpeur.value.numLicence,
    "Type de Licence": grimpeur.value.typeLicence,
    "Assurance": grimpeur.value.assurance,
    "Option Ski": grimpeur.value.optionSki ? "Oui" : "Non",
    "Option Slackline": grimpeur.value.optionSlackline ? "Oui" : "Non",
    "Option Trail": grimpeur.value.optionTrail ? "Oui" : "Non",
    "Option VTT": grimpeur.value.optionVTT ? "Oui" : "Non",
    "Option Assurance": grimpeur.value.optionAssurance,
    "Option Protection Agression": grimpeur.value.optionProtectionAgression ? "Oui" : "Non",
    "Compte": grimpeur.value.fkCompte,
    "Payé": grimpeur.value.aPaye ? "Oui" : "Non",
    "ID Séance": grimpeur.value.idSeance
  }
})

const open = async (grimpeurData) => {
  grimpeur.value = { ...grimpeurData }

  try {
    const result = await $fetch("/api/fetch?type=grimpeurSeance", {
      method: "POST",
      body: JSON.stringify({
        idGrimpeur: grimpeur.value.idGrimpeur
      }),
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    if (result.body.length > 0) {
      grimpeur.value.idSeance = result.body.idSeance
    } else {
      grimpeur.value.idSeance = null
    }
  } catch (error) {
    grimpeur.value.idSeance = null
    // TODO
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }

  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
