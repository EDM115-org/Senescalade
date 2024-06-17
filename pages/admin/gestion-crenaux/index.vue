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
              <v-row>
                <v-col>
                  <h2>Gestion des séances</h2>
                </v-col>
                <v-spacer />
                <v-col
                  class="d-flex justify-sm-end"
                >
                  <v-btn
                    color="success"
                    icon="mdi-calendar-plus-outline"
                    variant="elevated"
                    @click="editSeance(null)"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p>Nombre total de séances : {{ seanceCount }}</p>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th
                      v-for="header in headers"
                      :key="header.text"
                      :style="{ width: header.width }"
                      class="text-center"
                    >
                      {{ header.text }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="seance in seances"
                    :key="seance.idSeance"
                  >
                    <td class="text-center">
                      {{ seance.idSeance }}
                    </td>
                    <td class="text-center">
                      {{ seance.jour }}
                    </td>
                    <td class="text-center">
                      {{ seance.heureDebutSeance }}
                    </td>
                    <td class="text-center">
                      {{ seance.heureFinSeance }}
                    </td>
                    <td class="text-center">
                      {{ seance.typeSeance }}
                    </td>
                    <td class="text-center">
                      {{ seance.niveau }}
                    </td>
                    <td class="text-center">
                      {{ seance.nbPlaces }}
                    </td>
                    <td class="text-center">
                      {{ seance.nbPlacesRestantes }}
                    </td>
                    <td class="text-center">
                      {{ seance.professeur }}
                    </td>
                    <td class="d-flex justify-center align-center text-center">
                      <v-btn
                        color="accent"
                        class="mr-2"
                        icon="mdi-calendar-edit-outline"
                        size="small"
                        variant="elevated"
                        @click="editSeance(seance)"
                      />
                      <v-btn
                        color="error"
                        icon="mdi-calendar-remove-outline"
                        size="small"
                        variant="elevated"
                        @click.prevent="confirmDelete(seance)"
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
    <PopupDeleteSeance
      ref="deleteDialog"
      @confirm-delete="handleDelete"
    />
    <PopupEditSeance
      ref="editDialog"
      @confirm-add="handleSeance($event, false)"
      @confirm-edit="handleSeance($event, true)"
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
const seances = ref([])
const seanceCount = ref(0)
const deleteDialog = ref(null)
const editDialog = ref(null)

const errorMessage = ref("")
const issueMessage = ref("")

const headers = [
  { text: "ID", width: "10%" },
  { text: "Jour", width: "15%" },
  { text: "Heure de Debut", width: "15%" },
  { text: "Heure de Fin", width: "15%" },
  { text: "Type", width: "15%" },
  { text: "Niveau", width: "15%" },
  { text: "Places", width: "10%" },
  { text: "Places restantes", width: "10%" },
  { text: "Professeur", width: "15%" },
  { text: "Actions", width: "15%" },
]

const fetchSeance = async () => {
  try {
    const result = await $fetch("/api/fetch?type=seance")

    if (result.status === 200) {
      seances.value = result.body
    } else {
      console.error("Error fetching seances: ", result)
    }
  } catch (error) {
    console.error("Error fetching seances: ", error)
  }
}

const fetchSeanceCount = async () => {
  try {
    const result = await $fetch("/api/count?type=seance")

    if (result.status === 200) {
      seanceCount.value = result.body.seanceCount
    } else {
      console.error("Error fetching seance count:", result)
    }
  } catch (error) {
    console.error("Error fetching seance count:", error)
  }
}

const deleteSeance = async (id) => {
  try {
    const result = await $fetch("/api/delete?type=seance", {
      method: "DELETE",
      body: { idSeance: id },
    })

    if (result.status === 200) {
      fetchSeance()
      fetchSeanceCount()
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression de la séance"
    issueMessage.value = error
  }
}

const updateSeance = async (seance) => {
  try {
    const result = await $fetch("/api/update?type=seance", {
      method: "POST",
      body: seance,
    })

    if (result.status === 200) {
      fetchSeance()
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de la modification de la séance"
    issueMessage.value = error
  }
}

const createSeance = async (seance) => {
  try {
    const result = await $fetch("/api/add?type=seance", {
      method: "POST",
      body: seance,
    })

    if (result.status === 200) {
      fetchSeance()
      fetchSeanceCount()
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de l'ajout de la séance"
    issueMessage.value = error
  }
}

const confirmDelete = (seance) => {
  deleteDialog.value.open(seance)
}

const handleDelete = (idSeance) => {
  deleteSeance(idSeance)
}

const editSeance = (seance) => {
  editDialog.value.open(seance)
}

const handleSeance = (seance, edit) => {
  if (edit) {
    updateSeance(seance)
  } else {
    createSeance(seance)
  }
}

onMounted(async () => {
  const user = store.getUser

  try {
    const response = await $fetch("/api/fetch?type=adminPerms", {
      method: "POST",
      body: JSON.stringify({ user }),
    })

    if (response) {
      if (response.body[0].ReadListSeance !== 1) {
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
      fetchSeance()
      fetchSeanceCount()
    }
  } else {
    router.push("/login")
  }
})
</script>
