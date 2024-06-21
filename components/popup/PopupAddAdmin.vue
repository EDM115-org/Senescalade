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
          @submit.prevent="confirmAdd"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="admin.mail"
                :error-messages="v$.mail.$errors.map(e => e.$message)"
                autocomplete="username"
                label="Email"
                @blur="v$.mail.$touch"
                @input="v$.mail.$touch"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="admin.password"
                :error-messages="v$.password.$errors.map(e => e.$message)"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                label="Mot de passe"
                @blur="v$.password.$touch"
                @input="v$.password.$touch"
              >
                <template #append-inner>
                  <v-icon
                    tabindex="-1"
                    @click="togglePasswordVisibility"
                  >
                    {{ showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="admin.ReadListGrimpeur"
                color="success"
                label="Lecture Liste Grimpeur"
              />
              <v-switch
                v-model="admin.ReadListSeance"
                color="success"
                label="Lecture Liste Séance"
              />
              <v-switch
                v-model="admin.ReadListAdmin"
                color="success"
                label="Lecture Liste Admin"
              />
              <v-switch
                v-model="admin.ReadListUtilisateur"
                color="success"
                label="Lecture Liste Utilisateur"
              />
              <v-switch
                v-model="admin.UpdateListGrimpeur"
                color="success"
                label="Modification Liste Grimpeur"
              />
              <v-switch
                v-model="admin.UpdateListSeance"
                color="success"
                label="Modification Liste Séance"
              />
              <v-switch
                v-model="admin.UpdateListAdmin"
                color="success"
                label="Modification Liste Admin"
              />
              <v-switch
                v-model="admin.UpdateListUtilisateur"
                color="success"
                label="Modification Liste Utilisateur"
              />
              <v-switch
                v-model="admin.DeleteListGrimpeur"
                color="success"
                label="Suppression Liste Grimpeur"
              />
              <v-switch
                v-model="admin.DeleteListSeance"
                color="success"
                label="Suppression Liste Séance"
              />
              <v-switch
                v-model="admin.DeleteListAdmin"
                color="success"
                label="Suppression Liste Admin"
              />
              <v-switch
                v-model="admin.DeleteListUtilisateur"
                color="success"
                label="Suppression Liste Utilisateur"
              />
              <v-switch
                v-model="admin.AccessReinscription"
                color="success"
                label="Access à la réinscription"
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
          text="Ajouter"
          variant="elevated"
          :disabled="v$.$invalid"
          @click="confirmAdd"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import useVuelidate from "@vuelidate/core"
import bcrypt from "bcryptjs"

import { createI18nValidators } from "~/assets/utils/i18n-validators"
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"

const isOpen = ref(false)
const showPassword = ref(false)

const admin = reactive({
  mail: "",
  password: "",
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
  AccessReinscription: false
})

const { t } = useI18n()
const { required, email, minLength } = createI18nValidators(t)

const rules = {
  mail: { required, email },
  password: { required, minLength: minLength(8) }
}

const v$ = useVuelidate(rules, admin)

const emit = defineEmits([ "confirm-add" ])

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirmAdd = async () => {
  v$.value.$touch()

  if (v$.value.$invalid) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(admin.password, salt)
  const adminData = { ...admin, password: hash }

  emit("confirm-add", adminData)
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
