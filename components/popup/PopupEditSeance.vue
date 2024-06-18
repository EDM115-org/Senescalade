<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>{{ isEdit ? "Modifier la séance" : "Ajouter une séance" }}</v-card-title>
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
            v-model="seance.heureDebutSeance"
            label="Heure de Debut"
            :rules="[rules.required, rules.heure]"
          />
          <v-text-field
            v-model="seance.heureFinSeance"
            label="Heure de Fin"
            :rules="[rules.required, rules.duree]"
          />
          <v-number-input
            v-model="seance.nbPlaces"
            inset
            label="Nombre de places"
            type="number"
            :rules="[rules.required, rules.nbPlaces]"
          />
          <v-number-input
            v-model="seance.nbPlacesRestantes"
            inset
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
          variant="elevated"
          @click="close"
        >
          Annuler
        </v-btn>
        <v-btn
          color="accent"
          variant="elevated"
          :disabled="!valid"
          @click="confirmEdit"
        >
          {{ isEdit ? "Sauvegarder" : "Ajouter" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue"

const isEdit = ref(true)
const isOpen = ref(false)
const seance = ref({
  idSeance: null,
  jour: "",
  heureDebutSeance: "",
  heureFinSeance: "",
  typeSeance: "",
  niveau: "",
  nbPlaces: 0,
  nbPlacesRestantes: 0,
  professeur: "",
})

const valid = ref(false)

const emit = defineEmits([ "confirm-add", "confirm-edit" ])

const rules = {
  required: (value) => Boolean(value) || "Requis",
  jour: (value) => [ "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche" ].includes(value.toLowerCase()) || "Jour invalide",
  heure: (value) => (/^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/).test(value) || "Heure invalide (hh:mm:ss)",
  duree: (value) => (/^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/).test(value) || "Durée invalide (hh:mm:ss)",
  nbPlaces: (value) => value > 0 || "Le nombre de places doit être supérieur à 0",
  nbPlacesRestantes: (value) => (value >= 0 && value <= seance.value.nbPlaces) || "Nombre de places restantes invalide",
}

const open = (seanceData) => {
  if (seanceData === null) {
    isEdit.value = false
  }
  seance.value = { ...seanceData }
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirmEdit = () => {
  if (isEdit.value) {
    emit("confirm-edit", seance.value)
  } else {
    emit("confirm-add", seance.value)
  }
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
