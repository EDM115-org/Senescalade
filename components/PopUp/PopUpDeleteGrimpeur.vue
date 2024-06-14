<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>Suppression de ce grimpeur</v-card-title>
      <v-card-text>
        Êtes-vous sûr de vouloir supprimer ce grimpeur ?
        <v-card
          v-if="personne"
          class="mt-4"
        >
          <p class="font-weight-medium my-2 mx-4">
            {{ personne.prenom }} {{ personne.nom }}
          </p>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          variant="elevated"
          @click="close"
        >
          Non
        </v-btn>
        <v-btn
          color="accent"
          variant="elevated"
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
const personne = ref(null)

const emit = defineEmits([ "confirm-delete" ])

const open = (personneData) => {
  personne.value = personneData
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirmDelete = () => {
  emit("confirm-delete", personne.value.id)
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
