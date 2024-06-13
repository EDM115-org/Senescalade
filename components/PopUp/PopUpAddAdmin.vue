<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>Ajouter un admin</v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field
            v-model="admin.mail"
            label="Email"
            :rules="[rules.required, rules.email]"
          />
          <v-text-field
            v-model="admin.password"
            label="Mot de passe"
            type="password"
            :rules="[rules.required]"
          />
          <v-switch
            v-model="admin.ReadListGrimpeur"
            label="Lecture Liste Grimpeur"
          />
          <v-switch
            v-model="admin.ReadListSeance"
            label="Lecture Liste Séance"
          />
          <v-switch
            v-model="admin.ReadListAdmin"
            label="Lecture Liste Admin"
          />
          <v-switch
            v-model="admin.ReadListUtilisateur"
            label="Lecture Liste Utilisateur"
          />
          <v-switch
            v-model="admin.UpdateListGrimpeur"
            label="Modification Liste Grimpeur"
          />
          <v-switch
            v-model="admin.UpdateListSeance"
            label="Modification Liste Séance"
          />
          <v-switch
            v-model="admin.UpdateListAdmin"
            label="Modification Liste Admin"
          />
          <v-switch
            v-model="admin.UpdateListUtilisateur"
            label="Modification Liste Utilisateur"
          />
          <v-switch
            v-model="admin.DeleteListGrimpeur"
            label="Suppression Liste Grimpeur"
          />
          <v-switch
            v-model="admin.DeleteListSeance"
            label="Suppression Liste Séance"
          />
          <v-switch
            v-model="admin.DeleteListAdmin"
            label="Suppression Liste Admin"
          />
          <v-switch
            v-model="admin.DeleteListUtilisateur"
            label="Suppression Liste Utilisateur"
          />
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
          @click="confirmAdd"
        >
          Ajouter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue"

const isOpen = ref(false)
const valid = ref(false)

const admin = ref({
  mail: "",
  password: "",
  isAdmin: true,
  ReadListGrimpeur: false,
  ReadListSeance: false,
  ReadListAdmin: false,
  ReadListUtilisateur: false,
  UpdateListGrimpeur: false,
  UpdateListSeance: false,
  UpdateListAdmin: false,
  UpdateListUtilisateur: false,
  DeleteListGrimpeur: false,
  DeleteListSeance: false,
  DeleteListAdmin: false,
  DeleteListUtilisateur: false,
})

const rules = {
  required: (value) => !!value || "Requis",
  email: (value) => (/.+@.+\..+/).test(value) || "Email invalide",
}

const emit = defineEmits([ "confirm-add" ])

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirmAdd = () => {
  emit("confirm-add", admin.value)
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
