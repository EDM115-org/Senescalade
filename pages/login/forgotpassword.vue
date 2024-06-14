<template>
  <v-container class="fillheight flex-column justify-center">
    <h1 class="text-center mt-5 mb-5">Récupération du mot de passe</h1>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
      :color="messageColor"
    />
    <v-form
      ref="form"
      @submit.prevent="submit"
    >
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="state.email"
            :error-messages="v$.email.$errors.map(e => e.$message)"
            class="input-field mx-auto"
            label="Email"
            required
            @blur="v$.email.$touch"
            @input="v$.email.$touch"
          />
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
            Envoyer
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import useVuelidate from "@vuelidate/core"
import { required, email } from "@vuelidate/validators"
import { ref, reactive } from "vue"

const errorMessage = ref("")
const issueMessage = ref("")
const messageColor = ref("error")

const initialState = {
  email: ""
}

const state = reactive({ ...initialState })

const rules = {
  email: { required, email }
}

const v$ = useVuelidate(rules, state)

async function submit() {
  v$.value.$touch()

  if (v$.value.$invalid) {
    return
  }

  try {
    const result = await $fetch("/api/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email: state.email })
    })

    if (result.status === 200) {
      errorMessage.value = "Email de récupération envoyé avec succès."
      messageColor.value = "success"
      issueMessage.value = ""
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de l'envoi de l'email de récupération."
    issueMessage.value = error
  }
}

function clear() {
  v$.value.$reset()
  Object.assign(state, initialState)
}
</script>

<style scoped>
.fillheight {
  height: 100vh;
}

.input-field {
  width: 100%;
  max-width: 400px;
}

.text-center {
  text-align: center;
}
</style>
