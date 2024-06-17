<template>
  <v-container class="fillheight flex-column justify-center">
    <h1 class="text-center mt-5 mb-5">
      Récupération du mot de passe
    </h1>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
      :color="messageColor"
    />
    <v-form
      v-if="step === 1"
      ref="form"
      @submit.prevent="submitMail"
    >
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="stateMail.email"
            :error-messages="mail$.email.$errors.map(e => e.$message)"
            class="input-field mx-auto"
            label="Email"
            required
            @blur="mail$.email.$touch"
            @input="mail$.email.$touch"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          class="text-center"
        >
          <v-btn
            :disabled="mail$.$invalid"
            color="secondary"
            type="submit"
            variant="elevated"
          >
            Envoyer
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-form
      v-if="step === 2"
      ref="form"
      @submit.prevent="submitCode"
    >
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="stateCode.code"
            :error-messages="code$.code.$errors.map(e => e.$message)"
            class="input-field mx-auto"
            label="Code de vérification"
            required
            maxlength="6"
            @blur="code$.code.$touch"
            @input="code$.code.$touch"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          class="text-center"
        >
          <v-btn
            :disabled="code$.$invalid"
            color="secondary"
            type="submit"
            variant="elevated"
          >
            Vérifier
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-form
      v-if="step === 3"
      ref="form"
      @submit.prevent="submitPassword"
    >
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="statePassword.newPassword"
            :error-messages="password$.newPassword.$errors.map(e => e.$message)"
            :type="showPassword ? 'text' : 'password'"
            class="input-field mx-auto"
            label="Nouveau mot de passe"
            required
            @blur="password$.newPassword.$touch"
            @input="password$.newPassword.$touch"
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
            v-model="statePassword.confirmPassword"
            :error-messages="password$.confirmPassword.$errors.map(e => e.$message)"
            :type="showPassword ? 'text' : 'password'"
            class="input-field mx-auto"
            label="Confirmation du mot de passe"
            required
            @blur="password$.confirmPassword.$touch"
            @input="password$.confirmPassword.$touch"
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
            :disabled="password$.$invalid"
            color="secondary"
            type="submit"
            variant="elevated"
          >
            Réinitialiser le mot de passe
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>


<script setup>
import useVuelidate from "@vuelidate/core"
import { required, email, numeric, minLength, maxLength } from "@vuelidate/validators"
import { createI18nValidators } from "~/assets/utils/i18n-validators"
import { ref, reactive } from "vue"
import bcrypt from "bcryptjs"

const router = useRouter()

const errorMessage = ref("")
const issueMessage = ref("")
const messageColor = ref("error")
const showPassword = ref(false)
const step = ref(1)

const initialStateMail = {
  email: ""
}
const stateMail = reactive({ ...initialStateMail })
const rulesMail = {
  email: { required, email }
}
const mail$ = useVuelidate(rulesMail, stateMail)

const initialStateCode = {
  code: ""
}
const stateCode = reactive({ ...initialStateCode })
const rulesCode = {
  code: { required, numeric, minLength: minLength(6), maxLength: maxLength(6) }
}
const code$ = useVuelidate(rulesCode, stateCode)

const { t } = useI18n()
const { sameAs } = createI18nValidators(t)

const initialStatePassword = {
  newPassword: "",
  confirmPassword: "",
}
const statePassword = reactive({ ...initialStatePassword })

const rulesPassword = {
  newPassword: { required, minLength: minLength(8) },
  confirmPassword: { required, sameAsPassword: sameAs(computed(() => statePassword.newPassword)) }
}
const password$ = useVuelidate(rulesPassword, statePassword)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

async function submitMail() {
  mail$.value.$touch()

  if (mail$.value.$invalid) {
    return
  }

  try {
    const response = await $fetch("/api/forgotPassword?type=mail", {
      method: "POST",
      body: JSON.stringify({ email: stateMail.email })
    })

    if (response.statusCode === 200) {
      messageColor.value = "success"
      errorMessage.value = response.body.success
      issueMessage.value = ""
      step.value = 2
    } else {
      messageColor.value = "error"
      errorMessage.value = response.body.error || "Erreur inconnue"
      issueMessage.value = response.body.message || ""
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    errorMessage.value = "Erreur lors de l'envoi de l'email de récupération."
    issueMessage.value = error.message || error
  }
}

async function submitCode() {
  code$.value.$touch()

  if (code$.value.$invalid) {
    return
  }

  try {
    const response = await $fetch("/api/forgotPassword?type=code", {
      method: "POST",
      body: JSON.stringify({
        email: stateMail.email,
        code: stateCode.code
      })
    })

    if (response.statusCode === 200) {
      messageColor.value = "success"
      errorMessage.value = response.body.success
      issueMessage.value = ""
      step.value = 3
    } else {
      messageColor.value = "error"
      errorMessage.value = response.body.error || "Erreur inconnue"
      issueMessage.value = response.body.message || ""
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    errorMessage.value = "Erreur lors de la vérification du code."
    issueMessage.value = error.message || error
  }
}

async function submitPassword() {
  password$.value.$touch()

  if (password$.value.$invalid) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  const hashedNewPassword = await bcrypt.hash(statePassword.confirmPassword, salt)

  try {
    const response = await $fetch("/api/forgotPassword?type=password", {
      method: "POST",
      body: JSON.stringify({
        email: stateMail.email,
        password: hashedNewPassword
      })
    })

    if (response.statusCode === 200) {
      messageColor.value = "success"
      errorMessage.value = response.body.success
      issueMessage.value = ""

      router.push("/login")
    } else {
      messageColor.value = "error"
      errorMessage.value = response.body.error || "Erreur inconnue"
      issueMessage.value = response.body.message || ""
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    errorMessage.value = "Erreur lors de la réinitialisation du mot de passe."
    issueMessage.value = error.message || error
  }
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

