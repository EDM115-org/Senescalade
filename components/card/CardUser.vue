<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col
        v-for="grimpeur in displayedGrimpeurs"
        :key="grimpeur.idGrimpeur"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="grimpeur-card">
          <v-card-title>{{ grimpeur.prenom }} {{ grimpeur.nom }}</v-card-title>
          <v-card-subtitle>{{ grimpeur.ville }}, {{ grimpeur.pays }}</v-card-subtitle>
          <v-card-text>
            <p><strong>Date de Naissance :</strong> {{ formatBirthDate(grimpeur.dateNaissance) }}</p>
            <p><strong>Sexe :</strong> {{ grimpeur.sexe === "H" ? "Homme" : "Femme" }}</p>
            <p><strong>Adresse :</strong> {{ grimpeur.adresse }}</p>
            <p><strong>Code Postal :</strong> {{ grimpeur.codePostal }}</p>
            <p><strong>Statut du paiement :</strong> {{ grimpeur.aPaye === 1 ? "Confirmé" : "Non confirmé" }}</p>
            <p><strong>Numéro de Licence :</strong> {{ grimpeur.numLicence !== "" ? grimpeur.numLicence : "En attente d'attribution" }}</p>
            <p v-if="grimpeur.seance">
              <strong>Séance selectionnée :</strong>
              {{ grimpeur.seance.typeSeance }} {{ grimpeur.seance.niveau ? `- ${grimpeur.seance.niveau}` : "" }}<br>
              {{ grimpeur.seance.jour }} de {{ grimpeur.seance.heureDebutSeance }} à {{ grimpeur.seance.heureFinSeance }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="accent"
              variant="elevated"
            >
              Modifier
            </v-btn>
            <v-btn
              color="error"
              variant="elevated"
              @click.prevent="confirmDelete(grimpeur)"
            >
              Supprimer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <PopUpDeleteGrimpeur
      ref="deleteDialog"
      @confirm-delete="handleDelete"
    />
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { ref, onMounted, computed } from "vue"

const store = useMainStore()
const grimpeurs = ref([])
const role = ref(store.getUser.isAdmin)
const deleteDialog = ref(null)

const errorMessage = ref("")
const issueMessage = ref("")

async function fetchGrimpeurs() {
  try {
    const data = await $fetch(`/api/fetch?type=grimpeur&id=${store.getUser.id}`)

    grimpeurs.value = data.body
  } catch (error) {
    console.error("Error fetching grimpeurs:", error)
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
  await fetchGrimpeurs()

  for (const grimpeur in grimpeurs.value) {
    try {
      const result = await $fetch("/api/fetch?type=grimpeurSeance", {
        method: "POST",
        body: JSON.stringify({
          idGrimpeur: grimpeurs.value[grimpeur].idGrimpeur
        })
      })

      if (result.status === 200) {
        const response = await $fetch("/api/fetch?type=seance")

        if (response.status === 200) {
          grimpeurs.value[grimpeur].seance = response.body[result.body.idSeance]
        } else {
          console.error("Error fetching seance:", response)
        }
      } else {
        console.error("Error fetching grimpeur seance:", result)
      }
    } catch (error) {
      console.error("Error fetching grimpeur seance : ", error)
    }
  }
})

const displayedGrimpeurs = computed(() => {
  return role.value ? grimpeurs.value : grimpeurs.value.filter((grimpeur) => grimpeur.fkCompte === store.getUser.id)
})

const formatBirthDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR")
}
</script>

<style scoped>
.grimpeur-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
  padding: 15px;
  transition: box-shadow 0.3s ease;
}

.grimpeur-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.v-row {
  margin-top: 20px;
}
</style>
