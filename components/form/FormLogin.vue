<template>
  <v-form @submit.prevent="submit">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="mail"
          label="Email"
          required
          type="email"
          class="input-field mx-auto"
          outlined
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="password"
          label="Mot de passe"
          required
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          outlined
        >
          <template #append-inner>
            <v-icon @click="togglePasswordVisibility">
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
          color="accent"
          type="submit"
          large
        >
          {{ text }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import bcrypt from "bcryptjs"

import { ref } from "vue"

const mail = ref("")
const password = ref("")
const showPassword = ref(false)

const emit = defineEmits([ "submit:login", "submit:register" ])

const loginProps = defineProps({
  text: {
    type: String,
    default: ""
  }
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

async function submit() {
  if (loginProps.text === "S'inscrire") {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password.value, salt, (err, hash) => {
        emit("submit:register", { mail: mail.value, password: hash })
      })
    })
  } else if (loginProps.text === "Se connecter") {
    emit("submit:login", { mail: mail.value, password: password.value })
  }
}
</script>

<style scoped>
.input-field {
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
}
</style>
