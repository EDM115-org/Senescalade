<template>
  <v-container class="fillheight">
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
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
              <v-skeleton-loader
                v-if="loading"
                type="heading, table-tbody"
              />
              <v-table v-else>
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
                        v-if="isPermEdit"
                        color="accent"
                        class="mr-2"
                        icon="mdi-calendar-edit-outline"
                        size="small"
                        variant="elevated"
                        @click="editSeance(seance)"
                      />
                      <v-btn
                        v-if="isPermDelete"
                        color="error"
                        class="mr-2"
                        icon="mdi-calendar-remove-outline"
                        size="small"
                        variant="elevated"
                        @click.prevent="confirmDelete(seance)"
                      />
                      <v-btn
                        color="secondary"
                        icon="mdi-file-pdf-box"
                        size="small"
                        variant="elevated"
                        @click.prevent="exportGrimpeursPDF(seance.idSeance)"
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
import { computed, ref, onMounted } from "vue"
import { useMainStore } from "~/store/main"
import { jsPDF } from "jspdf"

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
const loading = ref(false)
const seances = ref([])
const seanceCount = ref(0)
const deleteDialog = ref(null)
const editDialog = ref(null)

const isPermDelete = ref(false)
const isPermEdit = ref(false)

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
  { text: "Actions", width: "15%" }
]

try {
  const response = await $fetch("/api/fetch?type=adminPerms", {
    method: "POST",
    body: JSON.stringify({ user: user.value }),
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  if (response.body.UpdateListSeance === 1) {
    isPermEdit.value = true
  }

  if (response.body.DeleteListSeance === 1) {
    isPermDelete.value = true
  }
} catch (error) {
  // TODO
  errorMessage.value = error.data.message
  issueMessage.value = error.data.statusMessage ?? ""
}

const fetchSeance = async () => {
  loading.value = true
  try {
    const result = await $fetch("/api/fetch?type=seance", {
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    seances.value = result.body
  } catch (error) {
    // TODO
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  } finally {
    loading.value = false
  }
}

const fetchSeanceCount = async () => {
  const result = await $fetch("/api/count?type=seance", {
    headers: { Authorization: `Bearer ${user.value.token}` }
  })

  seanceCount.value = result.body.seanceCount
}

const deleteSeance = async (id) => {
  try {
    await $fetch("/api/delete?type=seance", {
      method: "DELETE",
      body: { idSeance: id },
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    fetchSeance()
    fetchSeanceCount()
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

const updateSeance = async (seance) => {
  try {
    await $fetch("/api/update?type=seance", {
      method: "POST",
      body: seance,
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    fetchSeance()
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  }
}

const createSeance = async (seance) => {
  try {
    await $fetch("/api/add?type=seance", {
      method: "POST",
      body: seance,
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    fetchSeance()
    fetchSeanceCount()
  } catch (error) {
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
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

const generatePDF = (grimpeurs, seanceDetails) => {
  const doc = new jsPDF()

  doc.setTextColor(40)
  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")

  doc.text(`Liste des grimpeurs inscrits à la séance du ${seanceDetails.jour} de ${seanceDetails.heureDebutSeance} à ${seanceDetails.heureFinSeance}`, 15, 15)

  doc.setFontSize(12)
  doc.text(`Type de séance : ${seanceDetails.typeSeance}`, 15, 25)
  doc.text(`Nombre de grimpeurs : ${seanceDetails.nbPlaces}`, 15, 30)

  doc.setLineWidth(0.2)
  doc.line(15, 35, 195, 35)

  grimpeurs.forEach((grimpeur, index) => {
    const yPos = 45 + (index * 10)

    doc.text(`${grimpeur.nom} ${grimpeur.prenom}`, 20, yPos)
  })

  doc.save(`grimpeurs_seance_${seanceDetails.idSeance}.pdf`)
}

const exportGrimpeursPDF = async (idSeance) => {
  try {
    const result = await $fetch("/api/fetch?type=grimpeursForSeance", {
      method: "POST",
      body: { idSeance },
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    const grimpeurs = result.body
    const seanceDetails = {
      jour: grimpeurs[0].jour,
      typeSeance: grimpeurs[0].typeSeance,
      heureDebutSeance: grimpeurs[0].heureDebutSeance,
      heureFinSeance: grimpeurs[0].heureFinSeance,
      nbPlaces: grimpeurs[0].nbPlaces - grimpeurs[0].nbPlacesRestantes
    }

    generatePDF(grimpeurs, seanceDetails)
  } catch (error) {
    // TODO
    console.warn(error)
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

        if (response.body.ReadListSeance !== 1) {
          router.push("/admin/dashboard")
        }
      } catch (error) {
        // TODO
        errorMessage.value = error.data.message
        issueMessage.value = error.data.statusMessage ?? ""
      }

      fetchSeance()
      fetchSeanceCount()
    }
  } else {
    router.push("/login")
  }
})
</script>
