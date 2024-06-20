<template>
  <v-container
    v-if="loading"
    class="fillheight"
  >
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
    <h1 class="text-center my-4">
      <v-btn
        color="primary"
        class="mr-2"
        prepend-icon="mdi-arrow-left"
        text="Retour"
        @click="$router.push('/user')"
      />
      Vous êtes connecté {{ mail ?? "" }}
    </h1>
    <FormUpdatePassword />
    <v-row class="justify-center">
      <v-col cols="auto">
        <v-divider class="my-4" />
        <v-btn
          color="error"
          prepend-icon="mdi-delete"
          text="Supprimer mon compte"
          variant="elevated"
          @click.prevent="confirmDelete(user)"
        />
      </v-col>
    </v-row>
    <PopupDeleteUser
      ref="deleteDialog"
      @confirm-delete="handleDelete"
    />
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { computed, ref } from "vue"

const store = useMainStore()
const deleteDialog = ref(null)
const mail = computed(() => store.getUser?.mail)
const user = computed(() => store.getUser)
const router = useRouter()

const loading = ref(false)
const errorMessage = ref("")
const issueMessage = ref("")

onMounted(async () => {
  if (user.value) {
    try {
      const response = await $fetch("/api/fetch?type=mailIsVerified", {
        method: "POST",
        body: JSON.stringify({ mail: user.value.mail }),
        headers: { Authorization: `Bearer ${user.value.token}` }
      })

      if (response.body.mailIsVerified === 1) {
        loading.value = true
      } else {
        return router.push("/login/MailVerify")
      }
    } catch (error) {
      errorMessage.value = error.data.message
      issueMessage.value = error.data.statusMessage ?? ""
    }
  } else {
    return router.push("/login")
  }
})

const deleteUser = async (id) => {
  try {
    await $fetch("/api/delete?type=compte", {
      method: "DELETE",
      body: { idCompte: id },
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    store.logout()
    router.push("/")
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
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
