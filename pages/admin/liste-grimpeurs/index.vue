<template>
  <v-container class="fillheight">
    <v-row justify="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col>
                <h2>Gestion des grimpeurs</h2>
              </v-col>
              <v-spacer />
              <v-col
                class="d-flex justify-sm-end"
              >
                <v-btn
                  class="mr-2"
                  color="success"
                  icon="mdi-file-download-outline"
                  variant="elevated"
                  @click="downloadCSV"
                />
                <v-btn
                  v-col
                  color="success"
                  icon="mdi-refresh"
                  variant="elevated"
                  @click="resetIsExported"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p>Nombre total de grimpeurs : {{ grimpeurCount }}</p>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-skeleton-loader
              v-if="loading"
              type="heading, table-tbody"
            />
            <v-table v-else>
              <thead>
                <tr>
                  <th class="text-center">
                    Nom
                  </th>
                  <th class="text-center">
                    Prénom
                  </th>
                  <th class="text-center">
                    Sexe
                  </th>
                  <th class="text-center">
                    Téléphone
                  </th>
                  <th class="text-center">
                    Mobile
                  </th>
                  <th class="text-center">
                    Numéro de Licence
                  </th>
                  <th class="text-center">
                    A payé
                  </th>
                  <th class="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="grimpeur in grimpeurs"
                  :key="grimpeur.idGrimpeur"
                >
                  <td class="text-center">
                    {{ grimpeur.nom }}
                  </td>
                  <td class="text-center">
                    {{ grimpeur.prenom }}
                  </td>
                  <td class="text-center">
                    {{ grimpeur.sexe }}
                  </td>
                  <td class="text-center">
                    {{ grimpeur.telephone }}
                  </td>
                  <td class="text-center">
                    {{ grimpeur.mobile }}
                  </td>
                  <td class="text-center">
                    {{ grimpeur.numLicence }}
                  </td>
                  <td class="text-center">
                    {{ grimpeur.aPaye ? 'Oui' : 'Non' }}
                  </td>
                  <td class="d-flex justify-center align-center text-center">
                    <v-btn
                      v-if="isPermEdit"
                      color="accent"
                      class="mr-2"
                      icon="mdi-pencil"
                      size="small"
                      variant="elevated"
                      @click.prevent="editGrimpeur(grimpeur)"
                    />
                    <v-btn
                      v-if="isPermDelete"
                      color="warning"
                      class="mr-2"
                      icon="mdi-calendar-remove-outline"
                      size="small"
                      variant="elevated"
                      @click.prevent="confirmDeleteSeance(grimpeur)"
                    />
                    <v-btn
                      v-if="isPermDelete"
                      color="error"
                      class="mr-2"
                      icon="mdi-delete"
                      size="small"
                      variant="elevated"
                      @click.prevent="confirmDelete(grimpeur)"
                    />
                    <v-btn
                      color="secondary"
                      icon="mdi-dots-horizontal-circle-outline"
                      size="small"
                      variant="elevated"
                      @click="viewGrimpeur(grimpeur)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <PopupAfficheGrimpeur ref="afficheGrimpeurDialog" />
    <PopupDeleteGrimpeur
      ref="deleteDialog"
      @confirm-delete="handleDelete"
    />
    <PopupDeleteGrimpeurSeance
      ref="deleteDialogSeance"
      @confirm-delete="handleDeleteSeance"
    />
    <PopupEditGrimpeur
      ref="editGrimpeurDialog"
      @confirm-edit="handleEdit"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useMainStore } from "~/store/main"
import { useRouter } from "vue-router"

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
const user = store.getUser
const router = useRouter()
const grimpeurs = ref([])
const grimpeurCount = ref(0)
const afficheGrimpeurDialog = ref(null)
const loading = ref(false)
const editGrimpeurDialog = ref(null)
const deleteDialog = ref(null)
const deleteDialogSeance = ref(null)

const isPermDelete = ref(false)
const isPermEdit = ref(false)

const errorMessage = ref("")
const issueMessage = ref("")

try {
  const response = await $fetch("/api/fetch?type=adminPerms", {
    method: "POST",
    body: JSON.stringify({ user })
  })

  if (response) {
    if (response.body.UpdateListGrimpeur === 1) {
      isPermEdit.value = true
    }

    if (response.body.DeleteListGrimpeur === 1) {
      isPermDelete.value = true
    }
  } else {
    console.error("Error getPermAdmin:", response.statusText)
  }
} catch (error) {
  console.error("Error getPermAdmin:", error.message)
}

const fetchGrimpeurs = async () => {
  loading.value = true
  try {
    const response = await $fetch("/api/fetch?type=grimpeur")

    if (response) {
      grimpeurs.value = response.body
    } else {
      console.error("Error fetching grimpeurs:", response.statusText)
    }
  } catch (error) {
    console.error("Error fetching grimpeurs:", error.message)
  } finally {
    loading.value = false
  }
}

const fetchGrimpeurCount = async () => {
  const result = await $fetch("/api/count?type=grimpeur")

  grimpeurCount.value = result.body.grimpeurCount
}

const deleteGrimpeur = async (id) => {
  try {
    await $fetch("/api/delete?type=grimpeur", {
      method: "DELETE",
      body: { idGrimpeur: id }
    })

    fetchGrimpeurs()
    fetchGrimpeurCount()
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

const deleteGrimpeurSeance = async (id) => {
  try {
    await $fetch("/api/delete?type=grimpeurSeance", {
      method: "DELETE",
      body: { idGrimpeur: id }
    })

    fetchGrimpeurs()
    fetchGrimpeurCount()
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

const updateGrimpeur = async (grimpeur) => {
  try {
    const result = await $fetch("/api/update?type=grimpeur", {
      method: "POST",
      body: grimpeur
    })

    if (result.status === 200) {
      fetchGrimpeurs()
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de la modification du grimpeur"
    issueMessage.value = error
  }
}

const confirmDelete = (grimpeur) => {
  const grimpeur2 = {
    id: grimpeur.idGrimpeur,
    nom: grimpeur.nom,
    prenom: grimpeur.prenom
  }

  deleteDialog.value.open(grimpeur2)
}

const confirmDeleteSeance = (grimpeur) => {
  const grimpeur2 = {
    id: grimpeur.idGrimpeur,
    nom: grimpeur.nom,
    prenom: grimpeur.prenom
  }

  deleteDialogSeance.value.open(grimpeur2)
}

const editGrimpeur = (grimpeur) => {
  editGrimpeurDialog.value.open(grimpeur)
}

const handleDelete = (idGrimpeur) => {
  deleteGrimpeur(idGrimpeur)
}

const handleDeleteSeance = (idGrimpeur) => {
  deleteGrimpeurSeance(idGrimpeur)
}

const handleEdit = (grimpeur) => {
  updateGrimpeur(grimpeur)
}

onMounted(async () => {
  if (user) {
    if (!user.isAdmin) {
      router.push("/user")
    } else {
      try {
        const response = await $fetch("/api/fetch?type=adminPerms", {
          method: "POST",
          body: JSON.stringify({ user })
        })

        if (response) {
          if (response.body.ReadListGrimpeur !== 1) {
            router.push("/admin/dashboard")
          }
        } else {
          console.error("Error getPermAdmin:", response.statusText)
        }
      } catch (error) {
        console.error("Error getPermAdmin:", error.message)
      }

      fetchGrimpeurs()
      fetchGrimpeurCount()
    }
  } else {
    router.push("/login")
  }
})

const viewGrimpeur = (grimpeur) => {
  afficheGrimpeurDialog.value.open(grimpeur)
}

const downloadCSV = async () => {
  try {
    const response = await $fetch("/api/fetch?type=csv")

    if (response.status !== 200) {
      throw new Error("Erreur lors du téléchargement du CSV")
    } else {
      const csvContents = response.body

      if (!Array.isArray(csvContents)) {
        throw new Error("Format de réponse inattendu")
      }

      csvContents.forEach((csvData, index) => {
        const blob = new Blob([ csvData ], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")

        a.href = url
        a.download = `grimpeurs_part_${index + 1}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      })
    }
  } catch (error) {
    console.error("Erreur lors du téléchargement du CSV:", error)
  }
}

const resetIsExported = async () => {
  try {
    const response = await $fetch("/api/update?type=grimpeurIsExported", {
      method: "PUT"
    })

    if (response.status !== 200) {
      throw new Error("Erreur lors de la réinitialisation des exports")
    }
  } catch (error) {
    console.error("Erreur lors de la réinitialisation des exports:", error)
  }
}
</script>
