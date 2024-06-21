<template>
  <v-container class="flex-column justify-center">
    <h1 class="text-center my-4">
      Vérification de l'email
    </h1>
    <p class="text-center mb-4">
      Un mail vous a été envoyé avec un code de vérification.
    </p>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
      :color="messageColor"
    />
    <v-form
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
            text="Vérifier"
            type="submit"
            variant="elevated"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          class="text-center"
        >
          <v-btn
            :disabled="isResendDisabled"
            color="primary"
            text="Renvoyer le mail de vérification"
            variant="elevated"
            @click="resendVerificationMail"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>


<script setup>
import useVuelidate from "@vuelidate/core"

import { createI18nValidators } from "~/assets/utils/i18n-validators"
import { useMainStore } from "~/store/main"
import { computed, onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"

const store = useMainStore()
const user = computed(() => store.user)
const router = useRouter()

const errorMessage = ref("")
const issueMessage = ref("")
const messageColor = ref("error")

const { t } = useI18n()
const { maxLength, minLength, numeric, required } = createI18nValidators(t)

const initialStateCode = {
  code: ""
}
const stateCode = reactive({ ...initialStateCode })
const rulesCode = {
  code: { required, numeric, minLength: minLength(6), maxLength: maxLength(6) }
}
const code$ = useVuelidate(rulesCode, stateCode)

const isResendDisabled = ref(false)
const timer = ref(0)

const timerMessage = computed(() => `Vous pouvez renvoyer le mail dans ${timer.value} secondes.`)

function startTimer() {
  timer.value = 60
  const countdown = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(countdown)
      isResendDisabled.value = false
    }
  }, 1000)
}

async function submitCode() {
  code$.value.$touch()

  if (code$.value.$invalid) {
    return
  }

  try {
    const response = await $fetch("/api/mailVerify?type=code", {
      method: "POST",
      body: JSON.stringify({
        email: user.value.mail,
        code: stateCode.code
      })
    })

    messageColor.value = "success"
    errorMessage.value = response.body.success
    router.push("/user")
  } catch (error) {
    messageColor.value = "error"
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

async function resendVerificationMail() {
  if (isResendDisabled.value) {
    messageColor.value = "warning"
    errorMessage.value = timerMessage.value

    return
  }

  isResendDisabled.value = true
  startTimer()

  try {
    await $fetch("/api/mailVerify?type=mail", {
      method: "POST",
      body: JSON.stringify({
        email: user.value.mail
      })
    })

    messageColor.value = "success"
    errorMessage.value = "Un nouveau mail de vérification a été envoyé"
  } catch (error) {
    messageColor.value = "error"
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

onMounted(async () => {
  if (user.value) {
    if (user.value.isAdmin === 1) {
      router.push("/admin/dashboard")
    } else {
      isResendDisabled.value = true
      startTimer()

      try {
        const response = await $fetch("/api/fetch?type=mailIsVerified", {
          method: "POST",
          body: JSON.stringify({ mail: user.value.mail })
        })

        if (response.body.mailIsVerified === 1) {
          router.push("/user")
        }
      } catch (error) {
        messageColor.value = "error"
        errorMessage.value = error.data.message
        issueMessage.value = error.data.statusMessage ?? ""
      }
    }
  } else {
    router.push("/login")
  }
})
</script>
