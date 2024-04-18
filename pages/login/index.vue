<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Connexion
    </h1>
    <v-form @submit.prevent="login()">
      <v-row>
        <v-col cols="12">
          <v-text-field
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
            Se connecter
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from "vue"

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const login = () => {
  console.log("login")
}

</script>

<style scoped>

.input-field {
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
}
</style>
