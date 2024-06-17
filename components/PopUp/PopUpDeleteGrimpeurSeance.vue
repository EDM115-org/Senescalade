<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>Suppression de ce grimpeur pour une séance</v-card-title>
      <v-card-text>
        Êtes-vous sûr de vouloir supprimer ce grimpeur de cette séance ?
        <v-card
          v-if="grimpeur"
          class="mt-4"
        >
          <p class="font-weight-medium my-2 mx-4">
            {{ grimpeur.prenom }} {{ grimpeur.nom }}
          </p>
        </v-card>
        <v-card
          v-if="seance"
          class="mt-4"
        >
          <p class="font-weight-medium my-2 mx-4">
            {{ seance.typeSeance }} {{ seance.niveau ? `- ${seance.niveau}` : "" }}<br>
            {{ seance.jour }} de {{ seance.heureDebutSeance }} à {{ seance.heureFinSeance }}
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
const grimpeur = ref(null)
const seance = ref(null)

const emit = defineEmits([ "confirm-delete" ])

const open = async (grimpeurData) => {
  grimpeur.value = grimpeurData

  try {
    const result = await $fetch("/api/fetch?type=grimpeurSeance", {
      method: "POST",
      body: JSON.stringify({
        idGrimpeur: grimpeur.value.id
      })
    })

    if (result.status === 200) {
      const response = await $fetch("/api/fetch?type=seance")

      if (response.status === 200) {
        seance.value = response.body[result.body.idSeance]
      } else {
        console.error("Error fetching seance:", response)
      }
    } else {
      console.error("Error fetching grimpeur seance:", result)
    }
  } catch (error) {
    console.error("Error fetching grimpeur seance : ", error)
  }

  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  grimpeur.value = null
  seance.value = null
}

const confirmDelete = () => {
  emit("confirm-delete", grimpeur.value.id)
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
