<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title class="headline">
        Confirmation
      </v-card-title>
      <v-card-text>
        Lorsque vous confirmez, toutes les inscriptions des grimpeurs aux séances seront supprimées, les anciens grimpeurs passeront en statut de renouvellement, et la variable de paiement sera réinitialisée.
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="clearReinscriptions"
        >
          Confirmer
        </v-btn>
        <v-btn
          color="secondary"
          text
          @click="close"
        >
          Annuler
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue"

const isOpen = ref(false)

const emit = defineEmits([ "confirm-clear" ])

const clearReinscriptions = () => {
  emit("confirm-clear")
  close()
}

const open = () => {
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
