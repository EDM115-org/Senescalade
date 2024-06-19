<template>
  <v-container fluid>
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
    />
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
        <v-card class="grimpeur-card text-center">
          <v-card-title>{{ grimpeur.prenom }} {{ grimpeur.nom }}</v-card-title>
          <v-card-subtitle>{{ grimpeur.ville }}, {{ grimpeur.pays }}</v-card-subtitle>
          <v-card-text>
            <div class="text-center">
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
                <strong>Séance sélectionnée :</strong>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="grimpeur.seance" />
              </p>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-row
              align="center"
              justify="end"
            >
              <v-col
                cols="12"
                class="no-padding-btn mt-3"
              >
                <v-tooltip
                  v-if="reinscriptionOpen && grimpeur.asSeance"
                  bottom
                >
                  <template #activator="{ on }">
                    <v-btn
                      color="warning"
                      icon
                      v-bind="on"
                      @click.prevent="reinscription(grimpeur)"
                    >
                      <span>Réinscription</span>
                      <v-icon>mdi-account-arrow-left</v-icon>
                    </v-btn>
                  </template>
                  <span>Réinscrire le grimpeur à une nouvelle session</span>
                </v-tooltip>
              </v-col>
              <v-col
                cols="12"
                class="no-padding-btn mb-3"
              >
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-btn
                      color="error"
                      icon
                      v-bind="on"
                      @click.prevent="deleteDialog = true"
                    >
                      <span>Supprimer</span>
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Supprimer ce grimpeur de la base de données</span>
                </v-tooltip>
              </v-col>
            </v-row>
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
import { computed, ref, onMounted } from "vue"

const store = useMainStore()
const router = useRouter()
const user = computed(() => store.getUser)
const grimpeurs = ref([])
const deleteDialog = ref(false)
const loading = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref("")
const reinscriptionOpen = ref(false)

const errorMessage = ref("")
const issueMessage = ref("")

async function fetchGrimpeurs() {
  loading.value = true
  try {
    const data = await $fetch(`/api/fetch?type=grimpeur&id=${store.getUser.id}`, {
      headers: { Authorization: `Bearer ${user.value.token}` }
    })

    grimpeurs.value = data.body
  } catch (error) {
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
          }),
          headers: { Authorization: `Bearer ${user.value.token}` }
        })

        const response = await $fetch("/api/fetch?type=seance", {
          headers: { Authorization: `Bearer ${user.value.token}` }
        })

        if (result.body !== undefined) {
          const dateSeance = response.body[result.body.idSeance - 1]

          grimpeurs.value[grimpeur].seance = ` ${dateSeance.typeSeance}${dateSeance.niveau ? " - " + dateSeance.niveau : ""}<br>${dateSeance.jour} de ${dateSeance.heureDebutSeance} à ${dateSeance.heureFinSeance}`
        } else {
          grimpeurs.value[grimpeur].seance = " Aucune"
        }

        const responseReinscription = await $fetch("/api/fetch?type=getInfo", {
          headers: { Authorization: `Bearer ${user.value.token}` }
        })

        if (response.body) {
          const reponseGrimpeur = await $fetch(`/api/fetch?type=grimpeur&id=${user.value.id}`, {
            headers: { Authorization: `Bearer ${user.value.token}` }
          })

          if (reponseGrimpeur.body) {
            if (responseReinscription.body.inscriptionOpen === 1) {
              if (reponseGrimpeur.body[0].action === "C") {
                if (new Date(responseReinscription.body.dateReinscriptionEveryone) < new Date() && new Date(responseReinscription.body.dateReinscriptionEveryone) < new Date(responseReinscription.body.dateFinReinscription)) {
                  reinscriptionOpen.value = true
                } else {
                  reinscriptionOpen.value = false
                }
              } else if (reponseGrimpeur.body[0].action === "R") {
                if (new Date(responseReinscription.body.dateReinscriptionIsInscrit) < new Date() && new Date(responseReinscription.body.dateReinscriptionIsInscrit) < new Date(responseReinscription.body.dateFinReinscription)) {
                  reinscriptionOpen.value = true
                } else {
                  reinscriptionOpen.value = false
                }
              }
            }
          }
          try {
            const response = await $fetch("/api/fetch?type=grimpeurAsSeance", {
              method: "POST",
              body: JSON.stringify({ idGrimpeur: grimpeurs.value[grimpeur].idGrimpeur }),
              headers: { Authorization: `Bearer ${user.value.token}` }
            })

            // si reponse.body n'es pas vide
            if (response.body.length > 0) {
              grimpeurs.value[grimpeur].asSeance = false
            } else {
              grimpeurs.value[grimpeur].asSeance = true
            }
          } catch (error) {
            errorMessage.value = error.data.message
            issueMessage.value = error.data.statusMessage ?? ""
          }
        }
      } catch (error) {
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

async function reinscription(grimpeur) {
  router.push(`/user/reinscription?grimpeur=${grimpeur.idGrimpeur}`)
}
</script>
  <style scoped>
  .license-container {
    display: flex;
    align-items: center;
  justify-content: center;
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

  .no-padding-btn {
    padding: 0 !important; /* Annule le padding des boutons */
  }
  </style>
