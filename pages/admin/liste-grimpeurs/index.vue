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
                    v-for="personne in personnes"
                    :key="personne.idPersonne"
                  >
                    <td class="text-center">
                      {{ personne.nom }}
                    </td>
                    <td class="text-center">
                      {{ personne.prenom }}
                    </td>
                    <td class="text-center">
                      {{ personne.sexe }}
                    </td>
                    <td class="text-center">
                      {{ personne.telephone }}
                    </td>
                    <td class="text-center">
                      {{ personne.mobile }}
                    </td>
                    <td class="text-center">
                      {{ personne.courriel2 }}
                    </td>
                    <td class="text-center">
                      {{ personne.numLicence }}
                    </td>
                    <td class="text-center">
                      {{ personne.isPaye ? 'Oui' : 'Non' }}
                    </td>
                    <td class="d-flex justify-center align-center text-center">
                      <v-btn
                        color="accent"
                        class="mr-2"
                        icon="mdi-pencil"
                        variant="elevated"
                      />
                      <v-btn
                        color="error"
                        class="mr-2"
                        icon="mdi-delete"
                        variant="elevated"
                        @click.prevent="confirmDelete(personne)"
                      />
                      <v-btn
                        color="secondary"
                        icon="mdi-dots-horizontal-circle-outline"
                        variant="elevated"
                        @click="viewGrimpeur(personne)"
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

const store = useMainStore()
const router = useRouter()
const adminLogged = ref(false)
const personnes = ref([])
const afficheGrimpeurDialog = ref(null)
const deleteDialog = ref(null)

const errorMessage = ref("")
const issueMessage = ref("")

const fetchPersonnes = async () => {
  try {
    const response = await $fetch("/api/fetchGrimpeur")

    if (response) {
      personnes.value = response.body
    } else {
      console.error("Error fetching personnes:", response.statusText)
    }
  } catch (error) {
    console.error("Error fetching personnes:", error.message)
  }
}

const deleteGrimpeur = async (id) => {
  try {
    const result = await $fetch("/api/deleteGrimpeur", {
      method: "DELETE",
      body: { idPersonne: id }
    })

    if (result.status === 200) {
      fetchPersonnes()
    } else {
      errorMessage.value = result.body.error
      issueMessage.value = result.body.message ?? ""
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression d'un utilisateur"
    issueMessage.value = error
  }
}

const confirmDelete = (personne) => {
  const personne2 = {
    id: personne.idPersonne,
    nom: personne.nom,
    prenom: personne.prenom
  }

  deleteDialog.value.open(personne2)
}

const handleDelete = (idPersonne) => {
  deleteGrimpeur(idPersonne)
}

onMounted(async () => {
  const user = store.getUser

  try {
    const response = await $fetch("/api/getPermAdmin", {
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
    if (user.isAdmin !== 1) {
      router.push("/user")
    } else {
      adminLogged.value = true
      fetchPersonnes()
    }
  } else {
    router.push("/login")
  }
})

const viewGrimpeur = (personne) => {
  afficheGrimpeurDialog.value.open(personne)
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

  const rows = personnes.value.map((personne) => [
    personne.action,
    personne.nom,
    personne.prenom,
    new Date(personne.dateNaissance).toLocaleDateString("fr-FR"),
    personne.sexe,
    personne.nationalite,
    personne.adresse,
    personne.complementAdresse || "",
    personne.codePostal,
    personne.ville,
    personne.pays,
    personne.telephone || "",
    personne.mobile || "",
    "",
    personne.courriel2,
    personne.personneNom,
    personne.personnePrenom,
    personne.personneTelephone,
    personne.personneCourriel,
    personne.numLicence,
    personne.typeLicence,
    personne.assurance,
    personne.optionSki ? "Oui" : "Non",
    personne.optionSlackline ? "Oui" : "Non",
    personne.optionTrail ? "Oui" : "Non",
    personne.optionVTT ? "Oui" : "Non",
    personne.optionAssurance ? "Oui" : "Non",
    personne.assurance ? "Oui" : "Non",
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
