<template>
  <v-container class="fillheight">
    <h1 class="text-center my-4">
      Vous êtes connecté {{ mail ?? "" }}
    </h1>
    <FormUpdatePassword />
    <v-row class="justify-center">
      <v-col cols="auto">
        <v-divider class="my-4" />
        <v-btn
          color="error"
          prepend-icon="mdi-delete"
          variant="elevated"
          @click.prevent="confirmDelete(user)"
        >
          Supprimer mon compte
        </v-btn>
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
const mail = computed(() => store.getUser?.mail)
const user = store.getUser
const router = useRouter()

const errorMessage = ref("")
const issueMessage = ref("")

const deleteUser = async (id) => {
  try {
    const result = await $fetch("/api/deleteUser", {
      method: "DELETE",
      body: { idInscription: id }
    })

    if (result.status === 200) {
      store.logout()
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
  const user2 = {
    id: userToDelete.id,
    mail: userToDelete.mail
  }

  deleteDialog.value.open(user2)
}

const handleDelete = (userToDelete) => {
  deleteUser(userToDelete)
}
</script>
