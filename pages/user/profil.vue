<template>
  <v-container class="fillheight">
    <h1 class="text-center mt-5 mb-5">
      Vous êtes connecté {{ mail }}
    </h1>
    <FormUpdatePassword />
    <v-row class="justify-center">
      <v-col cols="auto">
        <v-btn
          color="accent"
          icon="mdi-pencil"
          @click.prevent="confirmEdit(user)"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="error"
          icon="mdi-delete"
          @click.prevent="confirmDelete(user)"
        />
      </v-col>
    </v-row>
    <PopUpDeleteUser
      ref="deleteDialog"
      @confirm-delete="handleDelete"
    />
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { computed } from "vue"

const store = useMainStore()
const deleteDialog = ref(null)
const mail = computed(() => store.getUser.mail)
const user = store.getUser

const errorMessage = ref("")
const issueMessage = ref("")

const deleteUser = async (id) => {
  try {
    const result = await $fetch("/api/deleteUser", {
      method: "DELETE",
      body: { idInscription: id }
    })

    if (result.status === 200) {
      router.push("/")
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression d'un utilisateur"
    issueMessage.value = error
  }
}

const confirmDelete = (userToDelete) => {
  deleteDialog.value.open(userToDelete)
}

const handleDelete = (userToDelete) => {
  deleteUser(userToDelete)
}
</script>
