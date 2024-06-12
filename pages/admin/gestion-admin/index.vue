<template>
  <v-container
    v-if="adminLogged"
    class="fillheight"
  >
    <LayoutNavBarAdmin />
    <div>
      <v-row justify="center">
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <h2>Gestion des administrateurs</h2>
            </v-card-title>
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th
                      class="text-center"
                      style="width: 10%;"
                    >
                      Id
                    </th>
                    <th
                      class="text-center"
                      style="width: 20%;"
                    >
                      Email
                    </th>
                    <th
                      class="text-center"
                      style="width: 60%;"
                    >
                      Permissions
                    </th>
                    <th
                      class="text-center"
                      style="width: 10%;"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="admin in admins"
                    :key="admin.idInscription"
                  >
                    <td class="text-center">
                      {{ admin.idInscription }}
                    </td>
                    <td class="text-center">
                      {{ admin.mail }}
                    </td>
                    <td>
                      <v-row class="d-flex flex-sm-wrap my-4">
                        <v-col
                          v-for="(value, key) in adminPermissions(admin)"
                          :key="key"
                          cols="4"
                        >
                          <v-chip
                            :color="value ? 'green' : 'red'"
                            variant="elevated"
                          >
                            {{ key }}
                          </v-chip>
                        </v-col>
                      </v-row>
                    </td>
                    <td>
                      <v-row class="justify-center">
                        <v-col cols="auto">
                          <v-btn
                            color="accent"
                            icon="mdi-pencil"
                            :disabled="admin.idInscription === user.id"
                            @click.prevent="confirmEdit(admin)"
                          />
                        </v-col>
                        <v-col cols="auto">
                          <v-btn
                            color="error"
                            icon="mdi-delete"
                            :disabled="admin.idInscription === user.id"
                            @click.prevent="confirmDelete(admin)"
                          />
                        </v-col>
                      </v-row>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <PopUpEditAdmin
      ref="editDialog"
      @confirm-edit="handleEdit"
    />
    <PopUpDeleteUser
      ref="deleteDialog"
      @confirm-delete="handleDelete"
    />
  </v-container>
</template>


<script setup>
import { ref, onMounted } from "vue"
import { useMainStore } from "~/store/main"

const store = useMainStore()
const router = useRouter()
const adminLogged = ref(false)
const admins = ref([])
const deleteDialog = ref(null)
const editDialog = ref(null)
const user = store.getUser

const errorMessage = ref("")
const issueMessage = ref("")

const fetchAdmin = async () => {
  try {
    const result = await $fetch("/api/fetchAdmin")

    if (result.status === 200) {
      admins.value = result.body
    } else {
      console.error("Error fetching admins:", result)
    }
  } catch (error) {
    console.error("Error fetching admins:", error)
  }
}

const updateAdmin = async (admin) => {
  try {
    const result = await $fetch("/api/updateAdmin", {
      method: "POST",
      body: admin,
    })

    if (result.status === 200) {
      fetchAdmin()
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de la modification "
    issueMessage.value = error
  }
}

const deleteAdmin = async (id) => {
  try {
    const result = await $fetch("/api/deleteUser", {
      method: "DELETE",
      body: { idInscription: id }
    })

    if (result.status === 200) {
      fetchAdmin()
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression d'un utilisateur"
    issueMessage.value = error
  }
}

const confirmDelete = (admin) => {
  deleteDialog.value.open(admin)
}

const handleDelete = (admin) => {
  deleteAdmin(admin)
}

const adminPermissions = (admin) => {
  return {
    "Gestion Grimpeur": admin.ReadListGrimpeur,
    "Gestion Seance": admin.ReadListSeance,
    "Gestion Admin": admin.ReadListAdmin,
    "Gestion Utilisateur": admin.ReadListUtilisateur,
    "Modification Grimpeur": admin.UpdateListGrimpeur,
    "Modification Seance": admin.UpdateListSeance,
    "Modification Admin": admin.UpdateListAdmin,
    "Modification Utilisateur": admin.UpdateListUtilisateur,
    "Suppression Grimpeur": admin.DeleteListGrimpeur,
    "Suppression Seance": admin.DeleteListSeance,
    "Suppression Admin": admin.DeleteListAdmin,
    "Suppression Utilisateur": admin.DeleteListUtilisateur,
  }
}

const confirmEdit = (admin) => {
  editDialog.value.open(admin)
}

const handleEdit = (admin) => {
  updateAdmin(admin)
}

onMounted(async () => {
  try {
    const response = await $fetch("/api/getPermAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user: user })
    })

    if (response) {
      if (response.body[0].ReadListAdmin !== 1) {
        return router.push("/admin/dashboard")
      }
    } else {
      console.error("Error getPermAdmin:", response.statusText)
    }
  } catch (error) {
    console.error("Error getPermAdmin:", error.message)
  }

  if (user) {
    if (user.isAdmin !== 1) {
      router.push("/user")
    } else {
      adminLogged.value = true
      fetchAdmin()
    }
  } else {
    router.push("/login")
  }
})
</script>

