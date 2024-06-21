<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>{{ isEdit ? "Modifier la séance" : "Ajouter une séance" }}</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select
            v-model="seance.jour"
            label="Jour"
            variant="outlined"
            :items="jours"
            :error-messages="v$.jour.$errors.map(e => e.$message)"
            @blur="v$.jour.$touch"
          />
          <v-time-picker
            v-model="seance.heureDebutSeance"
            color="success"
            format="24hr"
            title="Heure de Début"
            variant="outlined"
            :error-messages="v$.heureDebutSeance.$errors.map(e => e.$message)"
            @blur="v$.heureDebutSeance.$touch"
          />
          <v-time-picker
            v-model="seance.heureFinSeance"
            color="success"
            format="24hr"
            title="Heure de Fin"
            variant="outlined"
            :error-messages="v$.heureFinSeance.$errors.map(e => e.$message)"
            @blur="v$.heureFinSeance.$touch"
          />
          <v-number-input
            v-model="seance.nbPlaces"
            inset
            label="Nombre de places"
            variant="outlined"
            :min="0"
            :error-messages="v$.nbPlaces.$errors.map(e => e.$message)"
            @blur="v$.nbPlaces.$touch"
          />
          <v-number-input
            v-model="seance.nbPlacesRestantes"
            inset
            label="Places restantes"
            variant="outlined"
            :min="0"
            :error-messages="v$.nbPlacesRestantes.$errors.map(e => e.$message)"
            @blur="v$.nbPlacesRestantes.$touch"
          />
          <v-text-field
            v-model="seance.typeSeance"
            label="Type"
            variant="outlined"
            :error-messages="v$.typeSeance.$errors.map(e => e.$message)"
            @blur="v$.typeSeance.$touch"
          />
          <v-text-field
            v-model="seance.niveau"
            label="Niveau"
            variant="outlined"
          />
          <v-text-field
            v-model="seance.professeur"
            label="Professeur"
            variant="outlined"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          text="Annuler"
          variant="elevated"
          @click="close"
        />
        <v-btn
          color="accent"
          :text="isEdit ? 'Sauvegarder' : 'Ajouter'"
          variant="elevated"
          :disabled="v$.$invalid"
          @click="confirmEdit"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import useVuelidate from "@vuelidate/core"

import { ref, watch } from "vue"
import { createI18nValidators } from "~/assets/utils/i18n-validators"
import { useI18n } from "vue-i18n"

const isEdit = ref(true)
const isOpen = ref(false)
const seance = ref({
  idSeance: null,
  jour: "Lundi",
  heureDebutSeance: "09:00:00",
  heureFinSeance: "11:00:00",
  typeSeance: "",
  niveau: "",
  nbPlaces: 0,
  nbPlacesRestantes: 0,
  professeur: ""
})

const emit = defineEmits([ "confirm-add", "confirm-edit" ])

const { t } = useI18n()
const { required } = createI18nValidators(t)

const rules = {
  jour: { required },
  heureDebutSeance: { required },
  heureFinSeance: { required },
  nbPlaces: {
    required,
    custom: (value) => (
      value <= 0
        ? t("validations.nbPlaces.greaterThanZero")
        : (value < seance.value.nbPlacesRestantes
            ? t("validations.nbPlaces.greaterOrEqualNbPlacesRestantes")
            : true
          )
    )
  },
  nbPlacesRestantes: {
    required,
    custom: (value) => (
      (value >= 0 && value <= seance.value.nbPlaces) || t("validations.nbPlacesRestantes")
    )
  },
  typeSeance: { required }
}

const v$ = useVuelidate(rules, seance)

const jours = [ "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche" ]

const open = (seanceData) => {
  if (seanceData === null) {
    isEdit.value = false
  } else {
    seance.value = { ...seanceData }
  }
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirmEdit = () => {
  v$.value.$touch()

  if (v$.value.$invalid) {
    return
  }

  if (isEdit.value) {
    emit("confirm-edit", seance.value)
  } else {
    emit("confirm-add", seance.value)
  }
  close()
}

watch(seance, (newval) => {
  if (newval.heureDebutSeance.length === 5) {
    seance.value.heureDebutSeance += ":00"
  }

  if (newval.heureFinSeance.length === 5) {
    seance.value.heureFinSeance += ":00"
  }
}, { deep: true })

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
