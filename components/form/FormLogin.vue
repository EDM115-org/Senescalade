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
    <v-row v-if="loginProps.inscription">
      <v-col cols="12">
        <v-text-field
          v-model="state.checkPassword"
          :error-messages="v$.checkPassword.$errors.map(e => e.$message)"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          label="Confirmation du mot de passe"
          @blur="v$.checkPassword.$touch"
          @input="v$.checkPassword.$touch"
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
    <v-row v-if="!loginProps.inscription">
      <v-col
        cols="12"
        class="d-flex justify-center pa-0"
      >
        <v-checkbox
          v-model="stayConnected"
          label="Rester connecté"
        />
      </v-col>
    </v-row>
    <v-row v-if="!loginProps.inscription && loginProps.errors !== '' && loginProps.messageColor !== 'success'">
      <v-col
        cols="12"
        class="d-flex justify-center pa-0 mt-2"
      >
        <v-btn
          color="warning"
          text="Mot de passe oublié ?"
          variant="elevated"
          @click="$router.push('/login/forgotpassword')"
        />
      </v-col>
      <v-divider class="my-4" />
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="text-center"
      >
        <v-btn
          :disabled="v$.$invalid"
          color="accent"
          :text="loginProps.inscription ? 'S\'inscrire' : 'Se connecter'"
          type="submit"
          variant="elevated"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import useVuelidate from "@vuelidate/core"
import bcrypt from "bcryptjs"

import { createI18nValidators } from "~/assets/utils/i18n-validators"
import { computed, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"

const emit = defineEmits([ "submit:login", "submit:register" ])

const loginProps = defineProps({
  // skipcq: JS-0715
  errors: {
    type: String,
    default: ""
  },
  inscription: Boolean,
  // skipcq: JS-0715
  messageColor: {
    type: String,
    default: "error"
  }
})

const showPassword = ref(false)
const stayConnected = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const initialState = {
  mail: "",
  password: "",
  checkPassword: ""
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
    emit("submit:login", { mail: state.mail, password: state.password, stayConnected: stayConnected.value })
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
