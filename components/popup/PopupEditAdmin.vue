<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title class="text-center">
        Modifier les permissions de l'administrateur
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12">
              <h3>Lecture</h3>
            </v-col>
            <v-col
              v-for="(value, key) in readPermissions"
              :key="key"
              cols="12"
              sm="6"
            >
              <v-checkbox
                v-model="permissions[key]"
                :model-value="value === 1 ? true : false"
                :label="permissionNames[key]"
                color="success"
                @update:model-value="permissions[key] = $event ? 1 : 0"
              />
            </v-col>

            <v-col cols="12">
              <h3>Modification</h3>
            </v-col>
            <v-col
              v-for="(value, key) in updatePermissions"
              :key="key"
              cols="12"
              sm="6"
            >
              <v-checkbox
                v-model="permissions[key]"
                :model-value="value === 1 ? true : false"
                :label="permissionNames[key]"
                color="success"
                @update:model-value="permissions[key] = $event ? 1 : 0"
              />
            </v-col>

            <v-col cols="12">
              <h3>Suppression</h3>
            </v-col>
            <v-col
              v-for="(value, key) in deletePermissions"
              :key="key"
              cols="12"
              sm="6"
            >
              <v-checkbox
                v-model="permissions[key]"
                :model-value="value === 1 ? true : false"
                :label="permissionNames[key]"
                color="success"
                @update:model-value="permissions[key] = $event ? 1 : 0"
              />
            </v-col>

            <v-col cols="12">
              <h3>Reinscription</h3>
            </v-col>
            <v-col
              v-for="(value, key) in AccessPermissions"
              :key="key"
              cols="12"
              sm="6"
            >
              <v-checkbox
                v-model="permissions[key]"
                :model-value="value === 1 ? true : false"
                :label="permissionNames[key]"
                color="success"
                @update:model-value="permissions[key] = $event ? 1 : 0"
              />
            </v-col>
          </v-row>
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
          text="Sauvegarder"
          variant="elevated"
          :disabled="!valid"
          @click="confirmEdit"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from "vue"

const isOpen = ref(false)
const permissions = ref(null)
const idCompte = ref(null)
const valid = ref(true)

const emit = defineEmits([ "confirm-edit" ])

const permissionNames = {
  ReadListGrimpeur: "Lire la liste des grimpeurs",
  ReadListSeance: "Lire la liste des séances",
  ReadListAdmin: "Lire la liste des admins",
  ReadListUtilisateur: "Lire la liste des utilisateurs",
  UpdateListGrimpeur: "Mettre à jour la liste des grimpeurs",
  UpdateListSeance: "Mettre à jour la liste des séances",
  UpdateListAdmin: "Mettre à jour la liste des admins",
  UpdateListUtilisateur: "Mettre à jour la liste des utilisateurs",
  DeleteListGrimpeur: "Supprimer la liste des grimpeurs",
  DeleteListSeance: "Supprimer la liste des séances",
  DeleteListAdmin: "Supprimer la liste des admins",
  DeleteListUtilisateur: "Supprimer la liste des utilisateurs",
  AccessReinscription: "Accéder à la réinscription"
}

const open = (adminPermissions) => {
  const { idCompte: id, ...restPermissions } = adminPermissions

  permissions.value = { ...restPermissions }
  idCompte.value = id
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirmEdit = () => {
  emit("confirm-edit", { idCompte: idCompte.value, ...permissions.value })
  close()
}

defineExpose({ open, close })

const readPermissions = computed(() => {
  return Object.fromEntries(Object.entries(permissions.value).filter(([ key ]) => key.startsWith("Read")))
})

const updatePermissions = computed(() => {
  return Object.fromEntries(Object.entries(permissions.value).filter(([ key ]) => key.startsWith("Update")))
})

const deletePermissions = computed(() => {
  return Object.fromEntries(Object.entries(permissions.value).filter(([ key ]) => key.startsWith("Delete")))
})

const AccessPermissions = computed(() => {
  return Object.fromEntries(Object.entries(permissions.value).filter(([ key ]) => key.startsWith("Access")))
})

</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
