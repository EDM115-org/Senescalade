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
                  <h2>Gestion des grimpeurs</h2>
                </v-col>
                <v-spacer />
                <v-col
                  class="d-flex justify-sm-end"
                >
                  <v-btn
                    color="success"
                    icon="mdi-file-download-outline"
                    variant="elevated"
                    @click="downloadCSV"
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
              <v-table>
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
                      Courriel
                    </th>
                    <th class="text-center">
                      Numéro de Licence
                    </th>
                    <th class="text-center">
                      Payé
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
                      {{ grimpeur.courriel2 }}
                    </td>
                    <td class="text-center">
                      {{ grimpeur.numLicence }}
                    </td>
                    <td class="text-center">
                      {{ grimpeur.aPaye ? 'Oui' : 'Non' }}
                    </td>
                    <td class="d-flex justify-center align-center text-center">
                      <v-btn
                        color="accent"
                        class="mr-2"
                        icon="mdi-pencil"
                        size="small"
                        variant="elevated"
                      />
                      <v-btn
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
    </div>
    <PopUpAfficheGrimpeur ref="afficheGrimpeurDialog" />
    <PopUpDeleteGrimpeur
      ref="deleteDialog"
      @confirm-delete="handleDelete"
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
const router = useRouter()
const adminLogged = ref(false)
const grimpeurs = ref([])
const grimpeurCount = ref(0)
const afficheGrimpeurDialog = ref(null)
const deleteDialog = ref(null)

const errorMessage = ref("")
const issueMessage = ref("")

const fetchGrimpeurs = async () => {
  try {
    const response = await $fetch("/api/fetch?type=grimpeur")

    if (response) {
      grimpeurs.value = response.body
    } else {
      console.error("Error fetching grimpeurs:", response.statusText)
    }
  } catch (error) {
    console.error("Error fetching grimpeurs:", error.message)
  }
}

const fetchGrimpeurCount = async () => {
  try {
    const result = await $fetch("/api/count?type=grimpeur")

    if (result.status === 200) {
      grimpeurCount.value = result.body.grimpeurCount
    } else {
      console.error("Error fetching grimpeur count:", result)
    }
  } catch (error) {
    console.error("Error fetching grimpeur count:", error)
  }
}

const deleteGrimpeur = async (id) => {
  try {
    const result = await $fetch("/api/delete?type=grimpeur", {
      method: "DELETE",
      body: { idGrimpeur: id }
    })

    if (result.status === 200) {
      fetchGrimpeurs()
      fetchGrimpeurCount()
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression d'un utilisateur"
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

const handleDelete = (idGrimpeur) => {
  deleteGrimpeur(idGrimpeur)
}

onMounted(async () => {
  const user = store.getUser

  try {
    const response = await $fetch("/api/fetch?type=adminPerms", {
      method: "POST",
      body: JSON.stringify({ user })
    })

    if (response) {
      if (response.body[0].ReadListGrimpeur !== 1) {
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

const downloadCSV = () => {
  const header = [
    "action",
    "nom",
    "prenom",
    "date de naissance",
    "sexe",
    "nationalite",
    "adresse",
    "adresse complement",
    "code postal",
    "ville",
    "pays",
    "tel fixe",
    "tel mobile",
    "courriel",
    "courriel 2",
    "pap nom",
    "pap prenom",
    "pap telephone",
    "pap courriel",
    "numero de licence",
    "type licence",
    "assurance",
    "option ski",
    "option slackline",
    "option trail",
    "option vtt",
    "assurance complementaire",
    "option protection agression"
  ]

  const rows = grimpeurs.value.map((grimpeur) => [
    grimpeur.action,
    grimpeur.nom,
    grimpeur.prenom,
    new Date(grimpeur.dateNaissance).toLocaleDateString("fr-FR"),
    grimpeur.sexe,
    grimpeur.nationalite,
    grimpeur.adresse,
    grimpeur.complementAdresse || "",
    grimpeur.codePostal,
    grimpeur.ville,
    grimpeur.pays,
    grimpeur.telephone || "",
    grimpeur.mobile || "",
    // faire une jointure avec Compte
    "",
    grimpeur.courriel2,
    grimpeur.personneNom,
    grimpeur.personnePrenom,
    grimpeur.personneTelephone,
    grimpeur.personneCourriel,
    grimpeur.numLicence,
    grimpeur.typeLicence,
    grimpeur.assurance,
    grimpeur.optionSki ? "Oui" : "Non",
    grimpeur.optionSlackline ? "Oui" : "Non",
    grimpeur.optionTrail ? "Oui" : "Non",
    grimpeur.optionVTT ? "Oui" : "Non",
    grimpeur.optionAssurance,
    grimpeur.optionProtectionAgression ? "Oui" : "Non"
  ])

  const csvContent = [ header, ...rows ].map((e) => e.join(";")).join("\n")

  const blob = new Blob([ csvContent ], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  link.href = URL.createObjectURL(blob)
  link.setAttribute("download", "grimpeurs.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
