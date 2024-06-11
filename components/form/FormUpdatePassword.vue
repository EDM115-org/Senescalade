<template>
  <form
    ref="form"
    @submit.prevent="submit"
  >
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.oldPassword"
          :error-messages="v$.oldPassword.$errors.map(e => e.$message)"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          label="Mot de passe"
          required
          @blur="v$.oldPassword.$touch"
          @input="v$.oldPassword.$touch"
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
        <v-text-field
          v-model="state.newPassword"
          :error-messages="v$.newPassword.$errors.map(e => e.$message)"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          label="Mot de passe"
          required
          @blur="v$.newPassword.$touch"
          @input="v$.newPassword.$touch"
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
        <v-text-field
          v-model="state.confirmPassword"
          :error-messages="v$.confirmPassword.$errors.map(e => e.$message)"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          label="Confirmation du mot de passe"
          required
          @blur="v$.confirmPassword.$touch"
          @input="v$.confirmPassword.$touch"
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
      <v-col
        cols="12"
        class="text-center"
      >
        <v-btn
          :disabled="v$.$invalid"
          color="accent"
          type="submit"
        >
          Modifier le mot de passe
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>


<script setup>
import { useMainStore } from "~/store/main"
import useVuelidate from "@vuelidate/core"
import bcrypt from "bcryptjs"

import { createI18nValidators } from "@/assets/utils/i18n-validators"
import { ref, reactive } from "vue"

const store = useMainStore()

const user = store.getUser

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const initialState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
}

const state = reactive({ ...initialState })

const { t } = useI18n()
const { required, minLength, sameAs } = createI18nValidators(t)

const rules = {
  oldPassword: { required, minLength: minLength(8) },
  newPassword: { required, minLength: minLength(8) },
  confirmPassword: { required, sameAsPassword: sameAs(computed(() => state.newPassword)) }
}

const v$ = useVuelidate(rules, state)

async function submit() {
  v$.value.$touch()

  if (v$.value.$invalid) {
    return
  }

  // Vérifier si les deux nouveaux mots de passe correspondent
  if (state.newPassword !== state.confirmPassword) {
    // Gérer l'erreur ici, par exemple afficher un message d'erreur à l'utilisateur
    return
  }

  // Générer un nouveau sel et hasher le nouveau mot de passe
  const salt = await bcrypt.genSalt(10)
  const hashedNewPassword = await bcrypt.hash(state.newPassword, salt)

  // Envoyer les données au serveur pour mise à jour du mot de passe
  try {
    const response = await fetch("/api/updatePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldPassword: state.oldPassword,
        newPassword: hashedNewPassword,
        user: user
      })
    })

    if (response.ok) {
      // Gérer la mise à jour du mot de passe réussie
      console.log("Password updated successfully")
      clear()
    } else {
      // Gérer les erreurs de mise à jour du mot de passe
      console.error("Error updating password:", response.statusText)
    }
  } catch (error) {
    console.error("Error updating password:", error.message)
  }
}

function clear() {
  v$.value.$reset()
  Object.assign(state, initialState)
}
</script>

<style scoped>
.input-field {
  width: 100%;
  max-width: 300px;
}
</style>
