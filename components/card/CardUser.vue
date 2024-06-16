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
            <p><strong>Date de Naissance:</strong> {{ formatBirthDate(grimpeur.dateNaissance) }}</p>
            <p><strong>Sexe:</strong> {{ grimpeur.sexe === 'H' ? 'Homme' : 'Femme' }}</p>
            <p><strong>Nationalité:</strong> {{ grimpeur.nationalite }}</p>
            <p><strong>Téléphone:</strong> {{ grimpeur.telephone || 'N/A' }}</p>
            <p><strong>Mobile:</strong> {{ grimpeur.mobile || 'N/A' }}</p>
            <p><strong>Adresse:</strong> {{ grimpeur.adresse }}</p>
            <p><strong>Code Postal:</strong> {{ grimpeur.codePostal }}</p>
            <p><strong>Courriel:</strong> {{ grimpeur.courriel2 || 'N/A' }}</p>
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

const fetchGrimpeurs = async () => {
  try {
    const data = await $fetch("/api/fetch?type=grimpeur")

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

onMounted(fetchGrimpeurs)

const displayedGrimpeurs = computed(() => {
  return role.value ? grimpeurs.value : grimpeurs.value.filter((grimpeur) => grimpeur.fkCompte === store.getUser.id)
})

const formatBirthDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
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
