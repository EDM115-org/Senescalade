<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Inscription
    </h1>
    <v-form @submit.prevent="register()">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="mail"
            label="Email"
            required
            type="email"
            class="input-field mx-auto"
            autocomplete="email"
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
            autocomplete="new-password"
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
            S'inscrire
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from "vue"

const showPassword = ref(false)
const mail = ref("")
const password = ref("")

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

async function register() {
  try {
    // eslint-disable-next-line no-undef
    const registerData = await $fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        mail: mail.value,
        password: password.value,
      }),
    })
    console.log(registerData)
  } catch (error) {
    console.error("Error registering user:", error)
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
