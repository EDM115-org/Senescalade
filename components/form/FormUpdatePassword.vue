<template>
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
          v-model="state.oldPassword"
          :error-messages="v$.oldPassword.$errors.map(e => e.$message)"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          label="Ancien mot de passe"
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
          label="Nouveau mot de passe"
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
          text="Modifier le mot de passe"
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
import { useMainStore } from "~/store/main"
import { computed, reactive, ref } from "vue"

const store = useMainStore()

const user = computed(() => store.getUser)

const errorMessage = ref("")
const issueMessage = ref("")
const messageColor = ref("error")
const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const initialState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
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
  messageColor.value = "error"

  if (v$.value.$invalid) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  const hashedNewPassword = await bcrypt.hash(state.newPassword, salt)

  try {
    await $fetch("/api/update?type=password", {
      method: "POST",
      body: JSON.stringify({
        oldPassword: state.oldPassword,
        newPassword: hashedNewPassword,
        user: user.value
      }),
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    errorMessage.value = "Mot de passe modifié avec succès"
    messageColor.value = "success"

    clear()
  } catch (error) {
    messageColor.value = "error"
    errorMessage.value = error.data?.message ?? error
    issueMessage.value = error.data?.statusMessage ?? ""
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
