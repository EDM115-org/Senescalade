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
import { ref, computed } from "vue"

const isOpen = ref(false)
const personne = ref({
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
  optionAssurance: false,
  lInscription: 0,
  isPaye: false,
})

const formattedDateNaissance = computed(() => {
  return personne.value.dateNaissance
    ? new Intl.DateTimeFormat("default", { year: "numeric", month: "short", day: "numeric" }).format(new Date(personne.value.dateNaissance))
    : "Aucun"
})

const formatValue = (value) => {
  return value ? value : "Aucun"
}

const displayedFields = computed(() => {
  return {
    "Action": personne.value.action,
    "Nom": personne.value.nom,
    "Prénom": personne.value.prenom,
    "Date de Naissance": formattedDateNaissance.value,
    "Sexe": personne.value.sexe,
    "Nationalité": personne.value.nationalite,
    "Adresse": personne.value.adresse,
    "Complément d'adresse": personne.value.complementAdresse,
    "Code Postal": personne.value.codePostal,
    "Ville": personne.value.ville,
    "Pays": personne.value.pays,
    "Téléphone": personne.value.telephone,
    "Mobile": personne.value.mobile,
    "Courriel": personne.value.courriel2,
    "Nom de la personne à contacter": personne.value.personneNom,
    "Prénom de la personne à contacter": personne.value.personnePrenom,
    "Téléphone de la personne à contacter": personne.value.personneTelephone,
    "Courriel de la personne à contacter": personne.value.personneCourriel,
    "Numéro de Licence": personne.value.numLicence,
    "Type de Licence": personne.value.typeLicence,
    "Assurance": personne.value.assurance,
    "Option Ski": personne.value.optionSki ? "Oui" : "Non",
    "Option Slackline": personne.value.optionSlackline ? "Oui" : "Non",
    "Option Trail": personne.value.optionTrail ? "Oui" : "Non",
    "Option VTT": personne.value.optionVTT ? "Oui" : "Non",
    "Option Assurance": personne.value.optionAssurance ? "Oui" : "Non",
    "Compte": personne.value.lInscription,
    "Payé": personne.value.isPaye ? "Oui" : "Non",
  }
})

const open = (personneData) => {
  personne.value = { ...personneData }
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
