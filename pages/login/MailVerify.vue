<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Vérification de l'email
    </h1>
    <p class="text-center mb-5">
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
      <v-row>
        <v-col
          cols="12"
          class="text-center"
        >
          <v-btn
            color="primary"
            variant="elevated"
            @click="resendVerificationMail"
          >
            Renvoyer le mail de vérification
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>


<script setup>
import { useMainStore } from "~/store/main"
import useVuelidate from "@vuelidate/core"
import { required, numeric, minLength, maxLength } from "@vuelidate/validators"
import { computed, ref, reactive, onMounted } from "vue"

const store = useMainStore()
const user = computed(() => store.user)
const router = useRouter()

const errorMessage = ref("")
const issueMessage = ref("")
const messageColor = ref("error")

const initialStateCode = {
  code: ""
}
const stateCode = reactive({ ...initialStateCode })
const rulesCode = {
  code: { required, numeric, minLength: minLength(6), maxLength: maxLength(6) }
}
const code$ = useVuelidate(rulesCode, stateCode)

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
