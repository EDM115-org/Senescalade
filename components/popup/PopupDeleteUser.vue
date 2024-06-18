<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>Suppression du compte</v-card-title>
      <v-card-text>
        Êtes-vous sûr de vouloir supprimer ce compte ?<br>
        Attention, cette action est irréversible. Les grimpeurs associés à ce compte seront également supprimés.<br>
        Note : il est recommandé d'envoyer à la place un mail à <NuxtLink
          class="link-color"
          to="mailto:tresorier@senescalade.com"
        >
          tresorier@senescalade.com
        </NuxtLink> en précisant l'adresse email du compte et la raison de la suppression.
        <v-card
          v-if="user"
          class="mt-4"
        >
          <p class="font-weight-medium my-2 mx-4">
            {{ user.mail }}
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
const user = ref(null)

const emit = defineEmits([ "confirm-delete" ])

const open = (userData) => {
  user.value = userData
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirmDelete = () => {
  emit("confirm-delete", user.value.id)
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
