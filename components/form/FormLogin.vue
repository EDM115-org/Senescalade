<template>
  <v-form
    ref="form"
    @submit.prevent="submit"
  >
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.mail"
          :error-messages="v$.mail.$errors.map(e => e.$message)"
          class="input-field mx-auto"
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
          v-model="state.password"
          :error-messages="v$.password.$errors.map(e => e.$message)"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          label="Mot de passe"
          required
          @blur="v$.password.$touch"
          @input="v$.password.$touch"
        >
          <template #append-inner>
            <v-icon @click="togglePasswordVisibility">
              {{ showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="loginProps.inscription">
      <v-col cols="12">
        <v-text-field
          v-model="state.checkPassword"
          :error-messages="v$.checkPassword.$errors.map(e => e.$message)"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          label="Confirmation du mot de passe"
          required
          @blur="v$.checkPassword.$touch"
          @input="v$.checkPassword.$touch"
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
          :disabled="v$.$invalid"
          color="accent"
          type="submit"
        >
          {{ loginProps.inscription ? "S'inscrire" : "Se connecter" }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import bcrypt from "bcryptjs"
import useVuelidate from "@vuelidate/core"

import { createI18nValidators } from "@/assets/utils/i18n-validators"
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"

const emit = defineEmits([ "submit:login", "submit:register" ])

const loginProps = defineProps({
  inscription: Boolean
})

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const initialState = {
  mail: "",
  password: "",
  checkPassword: "",
}

const state = reactive({ ...initialState })

const { t } = useI18n()
const { required, email, minLength, sameAs } = createI18nValidators(t)

const rules = {
  mail: { required, email },
  password: { required, minLength: minLength(8) },
  checkPassword: loginProps.inscription ? { required, sameAsPassword: sameAs(computed(() => state.password)) } : {}
}

const v$ = useVuelidate(rules, state)

async function submit() {
  v$.value.$touch()

  if (v$.value.$invalid) {
    return
  }

  if (loginProps.inscription === true) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(state.password, salt)

    emit("submit:register", { mail: state.mail, password: hash })
  } else {
    emit("submit:login", { mail: state.mail, password: state.password })
  }

  clear()
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
