<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>Modifier les permissions de l'administrateur</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col
              v-for="(value, key) in permissions"
              :key="key"
              cols="12"
              sm="6"
            >
              <v-checkbox
                v-model="permissions[key]"
                :model-value="value === 1 ? true : false"
                :label="key"
                @update:model-value="permissions[key] = $event ? 1 : 0"
              />
            </v-col>
          </v-row>
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
const permissions = ref(null)
const idInscription = ref(null)
const valid = ref(true)

const emit = defineEmits([ "confirm-edit" ])

const open = (adminPermissions) => {
  const { idInscription: id, mail, ...restPermissions } = adminPermissions

  permissions.value = { ...restPermissions }
  idInscription.value = id
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirmEdit = () => {
  emit("confirm-edit", { idInscription: idInscription.value, ...permissions.value })
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
