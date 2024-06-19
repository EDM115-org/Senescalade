<template>
  <v-container class="fillheight">
    <div>
      <v-row justify="center">
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row>
                <v-col>
                  <h2>Gestion des administrateurs</h2>
                </v-col>
                <v-spacer />
                <v-col
                  class="d-flex justify-sm-end"
                >
                  <v-btn
                    color="success"
                    icon="mdi-account-plus-outline"
                    variant="elevated"
                    @click.prevent="openAddAdmin"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p>Nombre total d'administrateurs : {{ adminCount }}</p>
                </v-col>
              </v-row>
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
                      v-if="isPermEdit || isPermDelete"
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
                    :key="admin.idCompte"
                  >
                    <td class="text-center">
                      {{ admin.idCompte }}
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
                    <td
                      v-if="isPermEdit || isPermDelete"
                    >
                      <v-row class="justify-center">
                        <v-col
                          v-if="isPermEdit"
                          cols="auto"
                        >
                          <v-btn
                            color="accent"
                            icon="mdi-pencil"
                            variant="elevated"
                            :disabled="admin.idCompte === user.id"
                            @click.prevent="confirmEdit(admin)"
                          />
                        </v-col>
                        <v-col
                          v-if="isPermDelete"
                          cols="auto"
                        >
                          <v-btn
                            color="error"
                            icon="mdi-delete"
                            variant="elevated"
                            :disabled="admin.idCompte === user.id"
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
    <PopupAddAdmin
      ref="addDialog"
      @confirm-add="handleAdd"
    />
    <PopupEditAdmin
      ref="editDialog"
      @confirm-edit="handleEdit"
    />
    <PopupDeleteUser
      ref="deleteDialog"
      @confirm-delete="handleDelete"
    />
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from "vue"
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
const admins = ref([])
const adminCount = ref(0)
const deleteDialog = ref(null)
const editDialog = ref(null)
const addDialog = ref(null)
const user = computed(() => store.getUser)

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

  if (response.body.UpdateListAdmin === 1) {
    isPermEdit.value = true
  }

  if (response.body.DeleteListAdmin === 1) {
    isPermDelete.value = true
  }
} catch (error) {
  // TODO
  errorMessage.value = error.data.message
  issueMessage.value = error.data.statusMessage ?? ""
}

const fetchAdmin = async () => {
  try {
    const result = await $fetch("/api/fetch?type=admin", {
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    admins.value = result.body
  } catch (error) {
    // TODO
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

const fetchAdminCount = async () => {
  const result = await $fetch("/api/count?type=admin", {
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  adminCount.value = result.body.adminCount
}

const updateAdmin = async (admin) => {
  try {
    await $fetch("/api/update?type=admin", {
      method: "POST",
      body: admin,
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    fetchAdmin()
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

const deleteAdmin = async (id) => {
  try {
    await $fetch("/api/delete?type=compte", {
      method: "DELETE",
      body: { idCompte: id },
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    fetchAdmin()
    fetchAdminCount()
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

const confirmDelete = (admin) => {
  const user2 = {
    id: admin.idCompte,
    mail: admin.mail
  }

  deleteDialog.value.open(user2)
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
    "Suppression Utilisateur": admin.DeleteListUtilisateur
  }
}

const confirmEdit = (admin) => {
  editDialog.value.open(admin)
}

const handleEdit = (admin) => {
  updateAdmin(admin)
}

const openAddAdmin = () => {
  addDialog.value.open()
}

const handleAdd = async (admin) => {
  try {
    await $fetch("/api/add?type=admin", {
      method: "POST",
      body: admin,
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    fetchAdmin()
    fetchAdminCount()
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
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

        if (response.body.ReadListAdmin !== 1) {
          router.push("/admin/dashboard")
        }
      } catch (error) {
        // TODO
        errorMessage.value = error.data.message
        issueMessage.value = error.data.statusMessage ?? ""
      }

      fetchAdmin()
      fetchAdminCount()
    }
  } else {
    router.push("/login")
  }
})
</script>
