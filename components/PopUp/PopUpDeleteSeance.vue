<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>Suppression de séance</v-card-title>
      <v-card-text>
        Êtes-vous sûr de vouloir supprimer cette séance ?
        <v-card
          v-if="seance"
          class="mt-4"
        >
          <p class="font-weight-medium my-2 mx-4">
            {{ seance.jour }} à {{ seance.heureSeance }} ({{ seance.typeSeance }})
          </p>
          <v-card-text>
            Professeur : {{ seance.professeur }} <br>
            Niveau : {{ seance.niveau }} <br>
            Places restantes : {{ seance.nbPlacesRestantes }} / {{ seance.nbPlaces }}
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          text
          @click="close"
        >
          Non
        </v-btn>
        <v-btn
          color="accent"
          text
          @click="confirmDelete"
        >
          Oui
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue"

const isOpen = ref(false)
const seance = ref(null)

const emit = defineEmits([ "confirm-delete" ])

const open = (seanceData) => {
  seance.value = seanceData
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirmDelete = () => {
  emit("confirm-delete", seance.value.idSeance)
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
