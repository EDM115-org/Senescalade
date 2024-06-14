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
                required
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
                required
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
          <!-- Add switches for permissions as before -->
          <v-row>
            <v-col cols="12">
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
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          variant="elevated"
          @click="close"
        >
          Annuler
        </v-btn>
        <v-btn
          color="accent"
          variant="elevated"
          :disabled="v$.$invalid"
          @click="confirmAdd"
        >
          Ajouter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from "vue"
import useVuelidate from "@vuelidate/core"
import { required, email, minLength } from "@vuelidate/validators"
import bcrypt from "bcryptjs"

const isOpen = ref(false)
const showPassword = ref(false)

const admin = reactive({
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

  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(admin.password, salt)
    const adminData = { ...admin, password: hash }

    emit("confirm-add", adminData)
    close()
  } catch (error) {
    console.error("Erreur lors de l'encryptage du mot de passe:", error)
  }
}

defineExpose({ open, close })
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(5px);
}
</style>
