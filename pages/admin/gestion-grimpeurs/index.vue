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
            <v-row>
              <v-col>
                <h2>Gestion des grimpeurs</h2>
              </v-col>
              <v-spacer />
              <v-col
                class="d-flex justify-sm-end"
              >
                <v-tooltip
                  location="bottom"
                  text="Télécharger les données au format CSV"
                  theme="light"
                >
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      class="mr-2"
                      color="success"
                      icon="mdi-file-download-outline"
                      variant="elevated"
                      @click="downloadCSV"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip
                  location="bottom"
                  text="Réinitialiser l'état d'export des données pour TOUS les grimpeurs"
                  theme="light"
                >
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="error"
                      icon="mdi-account-convert-outline"
                      variant="elevated"
                      @click="resetIsExported"
                    />
                  </template>
                </v-tooltip>
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
                    <v-tooltip
                      location="top"
                      text="Modifier le grimpeur"
                      theme="light"
                    >
                      <template #activator="{ props }">
                        <v-btn
                          v-if="isPermEdit"
                          v-bind="props"
                          color="accent"
                          class="mr-2"
                          icon="mdi-pencil-outline"
                          size="small"
                          variant="elevated"
                          @click.prevent="editGrimpeur(grimpeur)"
                        />
                      </template>
                    </v-tooltip>
                    <v-tooltip
                      location="top"
                      text="Supprimer le grimpeur de sa séance"
                      theme="light"
                    >
                      <template #activator="{ props }">
                        <v-btn
                          v-if="isPermDelete"
                          v-bind="props"
                          color="warning"
                          class="mr-2"
                          icon="mdi-calendar-remove-outline"
                          size="small"
                          variant="elevated"
                          @click.prevent="confirmDeleteSeance(grimpeur)"
                        />
                      </template>
                    </v-tooltip>
                    <v-tooltip
                      location="top"
                      text="Supprimer le grimpeur"
                      theme="light"
                    >
                      <template #activator="{ props }">
                        <v-btn
                          v-if="isPermDelete"
                          v-bind="props"
                          color="error"
                          class="mr-2"
                          icon="mdi-delete-outline"
                          size="small"
                          variant="elevated"
                          @click.prevent="confirmDelete(grimpeur)"
                        />
                      </template>
                    </v-tooltip>
                    <v-tooltip
                      location="top"
                      text="Voir plus d'informations du grimpeur"
                    >
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          color="secondary"
                          icon="mdi-dots-vertical"
                          size="small"
                          variant="elevated"
                          @click="viewGrimpeur(grimpeur)"
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
    body: JSON.stringify({ user: user.value }),
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  if (response.body.UpdateListGrimpeur === 1) {
    isPermEdit.value = true
  }

  if (response.body.DeleteListGrimpeur === 1) {
    isPermDelete.value = true
  }
} catch (error) {
  errorMessage.value = error.data?.message ?? error
  issueMessage.value = error.data?.statusMessage ?? ""
}

const fetchGrimpeurs = async () => {
  loading.value = true
  try {
    const response = await $fetch("/api/fetch?type=grimpeur", {
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    grimpeurs.value = response.body
  } catch (error) {
    errorMessage.value = error.data?.message ?? error
    issueMessage.value = error.data?.statusMessage ?? ""
  } finally {
    loading.value = false
  }
}

const fetchGrimpeurCount = async () => {
  const result = await $fetch("/api/count?type=grimpeur", {
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  grimpeurCount.value = result.body.grimpeurCount
}

const deleteGrimpeur = async (id) => {
  try {
    await $fetch("/api/delete?type=grimpeur", {
      method: "DELETE",
      body: { idGrimpeur: id },
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    fetchGrimpeurs()
    fetchGrimpeurCount()
  } catch (error) {
    errorMessage.value = error.data?.message ?? error
    issueMessage.value = error.data?.statusMessage ?? ""
  }
}

const deleteGrimpeurSeance = async (id) => {
  try {
    await $fetch("/api/delete?type=grimpeurSeance", {
      method: "DELETE",
      body: { idGrimpeur: id },
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    fetchGrimpeurs()
    fetchGrimpeurCount()
  } catch (error) {
    errorMessage.value = error.data?.message ?? error
    issueMessage.value = error.data?.statusMessage ?? ""
  }
}

const updateGrimpeur = async (grimpeur) => {
  try {
    await $fetch("/api/update?type=grimpeur", {
      method: "POST",
      body: grimpeur,
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    fetchGrimpeurs()
  } catch (error) {
    errorMessage.value = error.data?.message ?? error
    issueMessage.value = error.data?.statusMessage ?? ""
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

        if (response.body.ReadListGrimpeur !== 1) {
          router.push("/admin/dashboard")
        }
      } catch (error) {
        errorMessage.value = error.data?.message ?? error
        issueMessage.value = error.data?.statusMessage ?? ""
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
    const response = await $fetch("/api/fetch?type=csv", {
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    const csvContents = response.body

    if (!Array.isArray(csvContents)) {
      throw new Error("Format de réponse inattendu")
    }

    csvContents.forEach((csvData, index) => {
      const blob = new Blob([ csvData ], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = `grimpeurs_part_${index + 1}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
  } catch (error) {
    errorMessage.value = error.data?.message ?? error
    issueMessage.value = error.data?.statusMessage ?? ""
  }
}

const resetIsExported = async () => {
  try {
    await $fetch("/api/update?type=grimpeurIsExported", {
      method: "PUT",
      headers: { Authorization: `Bearer ${user.value.token}` }
    })
  } catch (error) {
    errorMessage.value = error.data?.message ?? error
    issueMessage.value = error.data?.statusMessage ?? ""
  }
}
</script>
