<template>
  <v-container class="fillheight">
    <h1 class="text-center my-4">
      Ajouter un grimpeur
    </h1>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
    <FormUser
      @submit:adduser="adduser($event)"
    />
  </v-container>
</template>

<script setup>
import { ref } from "vue"

const router = useRouter()

const errorMessage = ref("")
const issueMessage = ref("")

async function adduser(event) {
  try {
    const result = await $fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(event),
    })

    if (result.status === 200) {
      router.push("/user")
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de l'ajout du grimpeur"
    issueMessage.value = error
  }
}
</script>
