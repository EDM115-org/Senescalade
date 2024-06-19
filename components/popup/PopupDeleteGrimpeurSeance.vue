<template>
  <Error
    v-if="errorMessage"
    :issue="issueMessage"
    :message="errorMessage"
    :color="messageColor"
  />
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>Suppression de la séance du grimpeur</v-card-title>
      <v-card-text>
        <template v-if="seance">
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
        </template>
        <template v-else>
          Ce grimpeur n'a pas de séance liée.
          <v-card
            v-if="grimpeur"
            class="mt-4"
          >
            <p class="font-weight-medium my-2 mx-4">
              {{ grimpeur.prenom }} {{ grimpeur.nom }}
            </p>
          </v-card>
        </template>
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
          :disabled="!seance"
          @click="confirmDelete"
        >
          Oui
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { computed, ref } from "vue"

const store = useMainStore()
const user = computed(() => store.getUser)

const isOpen = ref(false)
const grimpeur = ref(null)
const seance = ref(null)

const errorMessage = ref("")
const issueMessage = ref("")

const emit = defineEmits([ "confirm-delete" ])

const open = async (grimpeurData) => {
  grimpeur.value = grimpeurData

  try {
    const result = await $fetch("/api/fetch?type=grimpeurSeance", {
      method: "POST",
      body: JSON.stringify({
        idGrimpeur: grimpeur.value.id
      }),
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    if (result.body && result.body.idSeance) {
      const response = await $fetch("/api/fetch?type=seance", {
        headers: { Authorization: `Bearer ${user.value.token}` }
      })

      seance.value = response.body[result.body.idSeance]
    } else {
      seance.value = null
    }
  } catch (error) {
    console.log(error)
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
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
