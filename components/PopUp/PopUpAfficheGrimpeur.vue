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
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Action</v-list-item-title>
                <v-list-item-subtitle>{{ personne.action }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Nom</v-list-item-title>
                <v-list-item-subtitle>{{ personne.nom }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Prénom</v-list-item-title>
                <v-list-item-subtitle>{{ personne.prenom }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Date de Naissance</v-list-item-title>
                <v-list-item-subtitle>{{ formattedDateNaissance }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Sexe</v-list-item-title>
                <v-list-item-subtitle>{{ personne.sexe }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Nationalité</v-list-item-title>
                <v-list-item-subtitle>{{ personne.nationalite }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Adresse</v-list-item-title>
                <v-list-item-subtitle>{{ personne.adresse }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="personne.complementAdresse">
              <v-list-item-content>
                <v-list-item-title>Complément d'adresse</v-list-item-title>
                <v-list-item-subtitle>{{ personne.complementAdresse }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Code Postal</v-list-item-title>
                <v-list-item-subtitle>{{ personne.codePostal }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Ville</v-list-item-title>
                <v-list-item-subtitle>{{ personne.ville }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Pays</v-list-item-title>
                <v-list-item-subtitle>{{ personne.pays }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="personne.telephone">
              <v-list-item-content>
                <v-list-item-title>Téléphone</v-list-item-title>
                <v-list-item-subtitle>{{ personne.telephone }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="personne.mobile">
              <v-list-item-content>
                <v-list-item-title>Mobile</v-list-item-title>
                <v-list-item-subtitle>{{ personne.mobile }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="personne.courriel2">
              <v-list-item-content>
                <v-list-item-title>Courriel</v-list-item-title>
                <v-list-item-subtitle>{{ personne.courriel2 }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="personne.personneNom">
              <v-list-item-content>
                <v-list-item-title>Nom de la personne à contacter</v-list-item-title>
                <v-list-item-subtitle>{{ personne.personneNom }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="personne.personnePrenom">
              <v-list-item-content>
                <v-list-item-title>Prénom de la personne à contacter</v-list-item-title>
                <v-list-item-subtitle>{{ personne.personnePrenom }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="personne.personneTelephone">
              <v-list-item-content>
                <v-list-item-title>Téléphone de la personne à contacter</v-list-item-title>
                <v-list-item-subtitle>{{ personne.personneTelephone }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="personne.personneCourriel">
              <v-list-item-content>
                <v-list-item-title>Courriel de la personne à contacter</v-list-item-title>
                <v-list-item-subtitle>{{ personne.personneCourriel }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Numéro de Licence</v-list-item-title>
                <v-list-item-subtitle>{{ personne.numLicence }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Type de Licence</v-list-item-title>
                <v-list-item-subtitle>{{ personne.typeLicence }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Assurance</v-list-item-title>
                <v-list-item-subtitle>{{ personne.assurance }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Option Ski</v-list-item-title>
                <v-list-item-subtitle>{{ personne.optionSki ? 'Oui' : 'Non' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Option Slackline</v-list-item-title>
                <v-list-item-subtitle>{{ personne.optionSlackline ? 'Oui' : 'Non' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Option Trail</v-list-item-title>
                <v-list-item-subtitle>{{ personne.optionTrail ? 'Oui' : 'Non' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Option VTT</v-list-item-title>
                <v-list-item-subtitle>{{ personne.optionVTT ? 'Oui' : 'Non' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Option Assurance</v-list-item-title>
                <v-list-item-subtitle>{{ personne.optionAssurance ? 'Oui' : 'Non' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Inscription</v-list-item-title>
                <v-list-item-subtitle>{{ personne.lInscription }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Payé</v-list-item-title>
                <v-list-item-subtitle>{{ personne.isPaye ? 'Oui' : 'Non' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          text
          @click="close"
        >
          Fermer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue"
import { DateTime } from "luxon"

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
  return DateTime.fromISO(personne.value.dateNaissance).toLocaleString(DateTime.DATE_MED)
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
