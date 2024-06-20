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
        Lorsque vous confirmez, toutes les inscriptions des grimpeurs aux séances seront supprimées, les anciens grimpeurs passeront en statut de renouvellement, la variable de paiement sera réinitialisée, et un mail de compte sera envoyé pour annoncer la réinscription.
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          text="Annuler"
          @click="close"
        />
        <v-btn
          color="success"
          text="Confirmer"
          @click="clearReinscriptions"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue"

const isOpen = ref(false)

const emit = defineEmits([ "confirm-clear" ])

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const clearReinscriptions = () => {
  emit("confirm-clear")
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
