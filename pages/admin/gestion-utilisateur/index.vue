<template>
  <v-container
    v-if="adminLogged"
    class="fillheight"
  >
    <div>
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
                      style="width: 33%;"
                    >
                      Id
                    </th>
                    <th
                      class="text-center"
                      style="width: 33%;"
                    >
                      Email
                    </th>
                    <th
                      class="text-center"
                      style="width: 34%;"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="user in users"
                    :key="user.idCompte"
                  >
                    <td class="text-center">
                      {{ user.idCompte }}
                    </td>
                    <td class="text-center">
                      {{ user.mail }}
                    </td>
                    <td class="d-flex justify-center align-center text-center">
                      <v-btn
                        color="error"
                        icon="mdi-delete"
                        size="small"
                        variant="elevated"
                        @click.prevent="confirmDelete(user)"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <PopUpDeleteUser
      ref="deleteDialog"
      @confirm-delete="handleDelete"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useMainStore } from "~/store/main"

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
const router = useRouter()
const adminLogged = ref(false)
const users = ref([])
const userCount = ref(0)
const deleteDialog = ref(null)

const errorMessage = ref("")
const issueMessage = ref("")

const fetchCompte = async () => {
  try {
    const result = await $fetch("/api/fetchCompte")

    if (result.status === 200) {
      users.value = result.body
    } else {
      console.error("Error fetching users:", result)
    }
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}

const fetchUserCount = async () => {
  try {
    const result = await $fetch("/api/countUser")

    if (result.status === 200) {
      userCount.value = result.body.userCount
    } else {
      console.error("Error fetching user count:", result)
    }
  } catch (error) {
    console.error("Error fetching user count:", error)
  }
}

const deleteUser = async (id) => {
  try {
    const result = await $fetch("/api/deleteUser", {
      method: "DELETE",
      body: { idCompte: id }
    })

    if (result.status === 200) {
      fetchCompte()
      fetchUserCount()
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression d'un utilisateur"
    issueMessage.value = error
  }
}

const confirmDelete = (user) => {
  const user2 = {
    id: user.idCompte,
    mail: user.mail
  }

  deleteDialog.value.open(user2)
}

const handleDelete = (idCompte) => {
  deleteUser(idCompte)
}

onMounted(async () => {
  const user = store.getUser

  try {
    const response = await $fetch("/api/getPermAdmin", {
      method: "POST",
      body: JSON.stringify({ user }),
    })

    if (response) {
      if (response.body[0].ReadListUtilisateur !== 1) {
        router.push("/admin/dashboard")
      }
    } else {
      console.error("Error getPermAdmin:", response.statusText)
    }
  } catch (error) {
    console.error("Error getPermAdmin:", error.message)
  }

  if (user) {
    if (!user.isAdmin) {
      router.push("/user")
    } else {
      adminLogged.value = true
      fetchCompte()
      fetchUserCount()
    }
  } else {
    router.push("/login")
  }
})
</script>
