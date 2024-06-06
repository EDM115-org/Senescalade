<template>
  <v-form @submit.prevent="submit">
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.nom"
          label="Nom"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.prenom"
          label="Prenom"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <!-- <v-text-field
          v-model="formattedDate"
          label="Date de Naissance"
          readonly
          outlined
          @click="datePickerMenu = !datePickerMenu"
        />
        <v-menu
          v-model="datePickerMenu"
          close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <v-date-picker
            v-model="date"
            no-title
            scrollable
            @input="updateDate"
          />
        </v-menu> -->
        <v-menu
          v-model="datePickerMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="formattedDate"
              label="Date de naissance"
              readonly
              v-bind="props"
              required
            />
          </template>
          <v-date-picker
            v-model="date"
            no-title
            scrollable
            @input="updateDate"
          />
        </v-menu>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="personne.sexe"
          :items="['H', 'F']"
          label="Sexe"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.nationalite"
          label="Nationalité"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.adresse"
          label="Adresse"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.complementAdresse"
          label="Complément d'Adresse"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.codePostal"
          label="Code Postal"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.ville"
          label="Ville"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="personne.pays"
          :items="['FR', 'US', 'CA']"
          label="Pays"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.telephone"
          label="Téléphone"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.mobile"
          label="Mobile"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.courriel2"
          label="Email Secondaire"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.personneNom"
          label="Nom de la Personne de Contact"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.personnePrenom"
          label="Prénom de la Personne de Contact"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.personneTelephone"
          label="Téléphone de la Personne de Contact"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.personneCourriel"
          label="Email de la Personne de Contact"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="personne.numLicence"
          label="Numéro de Licence"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="personne.typeLicence"
          :items="['J', 'A', 'F']"
          label="Type de Licence"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="personne.assurance"
          :items="['RC', 'B', 'B+', 'B++']"
          label="Assurance"
          required
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-checkbox
          v-model="personne.optionSki"
          label="Option Ski"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-checkbox
          v-model="personne.optionSlackline"
          label="Option Slackline"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-checkbox
          v-model="personne.optionTrail"
          label="Option Trail"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-checkbox
          v-model="personne.optionVTT"
          label="Option VTT"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-checkbox
          v-model="personne.optionAssurance"
          label="Option Assurance"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        class="text-center"
      >
        <v-btn
          color="accent"
          type="submit"
          large
        >
          Soumettre
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { ref, computed, watch } from "vue"

const store = useMainStore()

const personne = ref({
  action: "R",
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
  lInscription: store.getUser.id
})

const datePickerMenu = ref(false)
const date = ref(personne.value.dateNaissance ? new Date(personne.value.dateNaissance) : null)

const formattedDate = computed(() => {
  return date.value ? date.value.toLocaleDateString("fr-CA") : ""
})

watch(date, (newDate) => {
  personne.value.dateNaissance = newDate ? newDate.toISOString().substr(0, 10) : ""
})

const updateDate = (newDate) => {
  date.value = newDate
  datePickerMenu.value = false
}

const emit = defineEmits([ "submit:adduser" ])

function submit() {
  emit("submit:adduser", personne.value)
}

</script>

<style scoped>
.input-field {
  max-width: 400px;
}
</style>
