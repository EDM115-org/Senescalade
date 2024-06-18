<template>
  <v-container fluid>
    <v-skeleton-loader
      v-if="loading"
      type="card"
    />
    <v-row
      v-else
      justify="center"
    >
      <v-col
        v-for="grimpeur in grimpeurs"
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
            <div class="license-container">
              <p class="mr-2">
                <strong>Numéro de Licence :</strong>
              </p>
              <pre>{{ grimpeur.numLicence !== "" ? grimpeur.numLicence : "En attente d'attribution" }}</pre>
              <v-btn
                v-if="grimpeur.numLicence !== ''"
                flat
                icon="mdi-content-copy"
                size="small"
                @click="copyToClipboard(grimpeur.numLicence)"
              />
            </div>
            <p v-if="grimpeur.seance">
              <strong>Séance selectionnée :</strong>
              {{ grimpeur.seance.typeSeance }} {{ grimpeur.seance.niveau ? `- ${grimpeur.seance.niveau}` : "" }}<br>
              {{ grimpeur.seance.jour }} de {{ grimpeur.seance.heureDebutSeance }} à {{ grimpeur.seance.heureFinSeance }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="error"
              icon="mdi-delete-outline"
              variant="elevated"
              @click.prevent="deleteDialog = true"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="deleteDialog"
      max-width="600px"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>Suppression de ce grimpeur</v-card-title>
        <v-card-text>
          Pour supprimer un grimpeur, veuillez envoyer un mail à <NuxtLink
            class="link-color"
            to="mailto:tresorier@senescalade.com"
          >
            tresorier@senescalade.com
          </NuxtLink> en précisant le nom et prénom du grimpeur à supprimer.
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            variant="elevated"
            @click="deleteDialog = false"
          >
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      color="success"
      :close-delay="3000"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { ref, onMounted } from "vue"

const store = useMainStore()
const grimpeurs = ref([])
const deleteDialog = ref(false)
const loading = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref("")

async function fetchGrimpeurs() {
  loading.value = true
  try {
    const data = await $fetch(`/api/fetch?type=grimpeur&id=${store.getUser.id}`)

    grimpeurs.value = data.body
  } catch (error) {
    // TODO
    errorMessage.value = error.data.message
    issueMessage.value = error.data.statusMessage ?? ""
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchGrimpeurs()

  for (const grimpeur in grimpeurs.value) {
    if (Object.prototype.hasOwnProperty.call(grimpeurs.value, grimpeur)) {
      try {
        const result = await $fetch("/api/fetch?type=grimpeurSeance", {
          method: "POST",
          body: JSON.stringify({
            idGrimpeur: grimpeurs.value[grimpeur].idGrimpeur
          })
        })

        const response = await $fetch("/api/fetch?type=seance")

        grimpeurs.value[grimpeur].seance = response.body[result.body.idSeance - 1]
      } catch (error) {
        // TODO
        errorMessage.value = error.data.message
        issueMessage.value = error.data.statusMessage ?? ""
      }
    }
  }
})

const copyToClipboard = (text) => {
  if (!text) {
    return
  }

  navigator.clipboard.writeText(text).then(() => {
    snackbarMessage.value = "Numéro de licence copié dans le presse-papier"
    snackbar.value = true
  })
}

const formatBirthDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR")
}
</script>

<style scoped>
.v-row {
  margin-top: 20px;
}

.license-container {
  display: flex;
  align-items: center;
}

pre {
  margin: 0;
  padding: 0;
  background: rgb(var(-v-theme-on-surface));
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  font-family: "Fira Code";
}
</style>
