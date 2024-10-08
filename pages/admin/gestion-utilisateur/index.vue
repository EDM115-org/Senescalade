<template>
  <v-container class="flex-column justify-center">
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
    <v-row justify="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h2>Gestion des utilisateurs</h2>
            <v-row>
              <v-col>
                <p>Nombre total d'utilisateurs : {{ userCount }}</p>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th
                    class="text-center"
                    scope="col"
                    style="width: 33%;"
                  >
                    Id
                  </th>
                  <th
                    class="text-center"
                    scope="col"
                    style="width: 33%;"
                  >
                    Email
                  </th>
                  <th
                    v-if="isPermDelete"
                    class="text-center"
                    scope="col"
                    style="width: 34%;"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="theUser in users"
                  :key="theUser.idCompte"
                >
                  <td class="text-center">
                    {{ theUser.idCompte }}
                  </td>
                  <td class="text-center">
                    {{ theUser.mail }}
                  </td>
                  <td
                    v-if="isPermDelete"
                    class="d-flex justify-center align-center text-center"
                  >
                    <v-tooltip
                      location="top"
                      text="Supprimer le compte"
                      theme="light"
                    >
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          color="error"
                          icon="mdi-delete-outline"
                          size="small"
                          variant="elevated"
                          @click.prevent="confirmDelete(theUser)"
                        />
                      </template>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
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
import { computed, onMounted, ref } from "vue"

definePageMeta({
  pageTransition: {
    name: "simple"
  },
  layout: "admin",
  layoutTransition: {
    name: "simple"
  }
})

const store = useMainStore()
const user = computed(() => store.getUser)
const router = useRouter()
const users = ref([])
const userCount = ref(0)
const deleteDialog = ref(null)

const isPermDelete = ref(false)
const isPermEdit = ref(false)

const errorMessage = ref("")
const issueMessage = ref("")

try {
  const response = await $fetch("/api/fetch?type=adminPerms", {
    method: "POST",
    body: JSON.stringify({ user: user.value }),
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  if (response.body.UpdateListUtilisateur === 1) {
    isPermEdit.value = true
  }

  if (response.body.DeleteListUtilisateur === 1) {
    isPermDelete.value = true
  }
} catch (error) {
  errorMessage.value = error.data?.message ?? error
  issueMessage.value = error.data?.statusMessage ?? ""
}

const fetchCompte = async () => {
  try {
    const result = await $fetch("/api/fetch?type=compte", {
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    users.value = result.body
  } catch (error) {
    errorMessage.value = error.data?.message ?? error
    issueMessage.value = error.data?.statusMessage ?? ""
  }
}

const fetchUserCount = async () => {
  const result = await $fetch("/api/count?type=compte", {
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  userCount.value = result.body.userCount
}

const deleteUser = async (id) => {
  try {
    await $fetch("/api/delete?type=compte", {
      method: "DELETE",
      body: { idCompte: id },
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    fetchCompte()
    fetchUserCount()
  } catch (error) {
    errorMessage.value = error.data?.message ?? error
    issueMessage.value = error.data?.statusMessage ?? ""
  }
}

const confirmDelete = (user3) => {
  const user2 = {
    id: user3.idCompte,
    mail: user3.mail
  }

  deleteDialog.value.open(user2)
}

const handleDelete = (idCompte) => {
  deleteUser(idCompte)
}

onMounted(async () => {
  if (user.value) {
    if (!user.value.isAdmin) {
      router.push("/user")
    } else {
      try {
        const response = await $fetch("/api/fetch?type=adminPerms", {
          method: "POST",
          body: JSON.stringify({ user: user.value }),
          headers: { Authorization: `Bearer ${user.value.token}` }
        })

        if (response.body.ReadListUtilisateur !== 1) {
          router.push("/admin/dashboard")
        }
      } catch (error) {
        errorMessage.value = error.data?.message ?? error
        issueMessage.value = error.data?.statusMessage ?? ""
      }

      fetchCompte()
      fetchUserCount()
    }
  } else {
    router.push("/login")
  }
})
</script>
