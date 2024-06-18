<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>Modifier le grimpeur</v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <h2 class="my-4">
            Informations personnelles
          </h2>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.nom"
                label="Nom"
                :rules="[rules.required]"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.prenom"
                label="Prénom"
                :rules="[rules.required]"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-radio-group
                v-model="grimpeur.sexe"
                label="Sexe"
                inline
              >
                <v-radio
                  label="Homme"
                  value="H"
                  :checked="grimpeur.sexe === 'H'"
                />
                <v-radio
                  label="Femme"
                  value="F"
                  :checked="grimpeur.sexe === 'F'"
                />
              </v-radio-group>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.telephone"
                label="Téléphone"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.mobile"
                label="Mobile"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.courriel2"
                label="Courriel 2"
                outlined
              />
            </v-col>
          </v-row>
          <h4 class="my-4">
            Adresse
          </h4>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.adresse"
                label="Adresse"
                :rules="[rules.required]"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.complementAdresse"
                label="Complément d'adresse"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.codePostal"
                label="Code Postal"
                :rules="[rules.required, rules.codePostal]"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.ville"
                label="Ville"
                :rules="[rules.required]"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-autocomplete
                v-model="grimpeur.pays"
                :items="countries"
                label="Pays"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-autocomplete
                v-model="grimpeur.nationalite"
                :items="countries"
                label="Nationalité"
                outlined
              />
            </v-col>
          </v-row>
          <v-divider class="my-8" />
          <h2 class="my-4">
            Personne de contact
          </h2>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.personneNom"
                label="Nom"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.personnePrenom"
                label="Prénom"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.personneTelephone"
                label="Téléphone"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="grimpeur.personneCourriel"
                label="Courriel"
                outlined
              />
            </v-col>
          </v-row>
          <v-divider class="my-8" />
          <h2 class="my-4">
            Informations complémentaires
            <v-btn
              class="ml-2"
              color="accent"
              icon="mdi-tooltip-question-outline"
              variant="elevated"
              @click="displayOptionsHelpText = !displayOptionsHelpText"
            />
          </h2>
          <p
            v-if="displayOptionsHelpText"
            class="text-center mb-4"
          >
            L'assurance B (Base) est incluse par défaut, mais vous pouvez garder votre RC si vous le souhaitez (non recommandé).<br>
            Les options sont facultatives et permettent d'assurer des sports complémentaires dans l'assurance souscrite. Non applicable si vous gardez votre RC.<br>
            Découvrez le détail de ces assurances dans le
            <a
              class="link-color"
              href="https://www.montagne-escalade.com/site/BO/documents/2025-pack-assurance.pdf"
              target="_blank"
            >
              document suivant
            </a>.
          </p>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <h4>Assurance</h4>
              <v-radio-group
                v-model="grimpeur.assurance"
                inline
              >
                <v-radio
                  label="RC"
                  value="RC"
                />
                <v-radio
                  label="B"
                  value="B"
                />
                <v-radio
                  label="B+ (3 €)"
                  value="B+"
                />
                <v-radio
                  label="B++ (10 €)"
                  value="B++"
                />
              </v-radio-group>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <h4>Assurance complémentaire (indemnités journalières)</h4>
              <v-radio-group
                v-model="grimpeur.optionAssurance"
                inline
              >
                <v-radio
                  label="Non"
                  value="NON"
                />
                <v-radio
                  label="IJ1 (18 €)"
                  value="IJ1"
                />
                <v-radio
                  label="IJ2 (30 €)"
                  value="IJ2"
                />
                <v-radio
                  label="IJ3 (35 €)"
                  value="IJ3"
                />
              </v-radio-group>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <h4>Options</h4>
              <v-checkbox
                v-model="grimpeur.optionProtectionAgression"
                density="compact"
                label="Option Protection Agression (1,70 €)"
                :true-value="1"
                :false-value="0"
              />
              <v-checkbox
                v-model="grimpeur.optionSki"
                density="compact"
                label="Option ski de piste (5 €)"
                :true-value="1"
                :false-value="0"
              />
              <v-checkbox
                v-model="grimpeur.optionSlackline"
                density="compact"
                label="Option slackline/highline (5 €)"
                :true-value="1"
                :false-value="0"
              />
              <v-checkbox
                v-model="grimpeur.optionTrail"
                density="compact"
                label="Option trail (10 €)"
                :true-value="1"
                :false-value="0"
              />
              <v-checkbox
                v-model="grimpeur.optionVTT"
                density="compact"
                label="Option VTT (30 €)"
                :true-value="1"
                :false-value="0"
              />
            </v-col>
          </v-row>
          <v-divider class="my-8" />
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="grimpeur.numLicence"
              label="Numéro de licence"
              outlined
            />
          </v-col>

          <v-switch
            v-model="grimpeur.aPaye"
            label="A payé"
            :true-value="1"
            :false-value="0"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          variant="elevated"
          @click="close"
        >
          Annuler
        </v-btn>
        <v-btn
          color="accent"
          variant="elevated"
          :disabled="!valid"
          @click="confirmEdit"
        >
          Sauvegarder
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue"

const isOpen = ref(false)
const grimpeur = ref({
  nom: "",
  prenom: "",
  sexe: "",
  nationalite: "",
  adresse: "",
  complementAdresse: "",
  codePostal: "",
  ville: "",
  pays: "",
  telephone: "",
  mobile: "",
  courriel2: "",
  personneNom: "",
  personnePrenom: "",
  personneTelephone: "",
  personneCourriel: "",
  numLicence: "",
  typeLicence: "",
  assurance: "",
  optionSki: 0,
  optionSlackline: 0,
  optionTrail: 0,
  optionVTT: 0,
  optionAssurance: "",
  optionProtectionAgression: 0,
  aPaye: 0,
})

const valid = ref(false)
const emit = defineEmits([ "confirm-edit" ])

const rules = {
  required: (value) => !!value || "Requis",
  date: (value) => !isNaN(Date.parse(value)) || "Date invalide",
  codePostal: (value) => (/^[0-9]{5}$/).test(value) || "Code postal invalide",
}

const open = (grimpeurData) => {
  if (grimpeurData) {
    grimpeur.value = { ...grimpeurData }
  }
  isOpen.value = true
}

const displayOptionsHelpText = ref(false)

const countries = [ "France", "Belgique", "Suisse" ]

const close = () => {
  isOpen.value = false
}

const confirmEdit = () => {
  emit("confirm-edit", grimpeur.value)
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
.link-color {
  color: #2196F3;
  text-decoration: none;
}

.link-color:hover {
  text-decoration: underline;
}
</style>
