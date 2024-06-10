<template>
  <form ref="form" @submit.prevent="submit">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.oldPassword"
          :error-messages="errors.oldPassword"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          label="Ancien mot de passe"
          required
          @blur="touch('oldPassword')"
          @input="touch('oldPassword')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.newPassword"
          :error-messages="errors.newPassword"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          label="Nouveau mot de passe"
          required
          @blur="touch('newPassword')"
          @input="touch('newPassword')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.confirmPassword"
          :error-messages="errors.confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          label="Confirmer le nouveau mot de passe"
          required
          @blur="touch('confirmPassword')"
          @input="touch('confirmPassword')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn :disabled="hasErrors || !isTouched" color="accent" type="submit">
          Modifier le mot de passe
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>


<script setup>
import { useMainStore } from "~/store/main"
import useVuelidate from "@vuelidate/core"

const store = useMainStore()

const user = store.getUser()

const showPassword = ref(false)
const initialState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
}

const state = reactive({ ...initialState })

const { required, minLength, sameAs } = useVuelidate(validators, state)

const validators = {
  oldPassword: { required },
  newPassword: { required, minLength: minLength(8) },
  confirmPassword: { required, sameAsPassword: sameAs(state.newPassword) }
}

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

  // Envoyer les données au serveur pour mise à jour du mot de passe
  try {
    const response = await fetch("/api/updatePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldPassword: state.oldPassword,
        newPassword: state.newPassword,
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
