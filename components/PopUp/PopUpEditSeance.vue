<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>Modifier la séance</v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field
            v-model="seance.jour"
            label="Jour"
            :rules="[rules.required, rules.jour]"
          />
          <v-text-field
            v-model="seance.heureSeance"
            label="Heure"
            :rules="[rules.required, rules.heure]"
          />
          <v-text-field
            v-model="seance.dureeSeance"
            label="Durée"
            :rules="[rules.required, rules.duree]"
          />
          <v-text-field
            v-model="seance.nbPlaces"
            label="Nombre de places"
            type="number"
            :rules="[rules.required, rules.nbPlaces]"
          />
          <v-text-field
            v-model="seance.nbPlacesRestantes"
            label="Places restantes"
            type="number"
            :rules="[rules.required, rules.nbPlacesRestantes]"
          />
          <v-text-field
            v-model="seance.typeSeance"
            label="Type"
            :rules="[rules.required]"
          />
          <v-text-field
            v-model="seance.niveau"
            label="Niveau"
            :rules="[rules.required]"
          />
          <v-text-field
            v-model="seance.professeur"
            label="Professeur"
            :rules="[rules.required]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          text
          @click="close"
        >
          Annuler
        </v-btn>
        <v-btn
          color="accent"
          text
          :disabled="!valid"
          @click="confirmEdit"
        >
          Sauvegarder
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue"

const isOpen = ref(false)
const seance = ref({
  idSeance: "",
  jour: "",
  heureSeance: "",
  dureeSeance: "",
  typeSeance: "",
  niveau: "",
  nbPlaces: "",
  nbPlacesRestantes: "",
  professeur: "",
})

const valid = ref(false)

const emit = defineEmits([ "confirm-edit" ])

const rules = {
  required: (value) => !!value || "Requis",
  jour: (value) => [ "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche" ].includes(value.toLowerCase()) || "Jour invalide",
  heure: (value) => (/^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/).test(value) || "Heure invalide (hh:mm:ss)",
  duree: (value) => (/^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/).test(value) || "Durée invalide (hh:mm:ss)",
  nbPlaces: (value) => value > 0 || "Le nombre de places doit être supérieur à 0",
  nbPlacesRestantes: (value) => (value >= 0 && value <= seance.value.nbPlaces) || "Nombre de places restantes invalide",
}

const open = (seanceData) => {
  seance.value = { ...seanceData }
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirmEdit = () => {
  emit("confirm-edit", seance.value)
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
