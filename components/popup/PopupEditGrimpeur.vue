<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title class="text-center mt-4 text-h5">
        Modifier le grimpeur
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <h2 class="my-4">
            License et paiement
          </h2>
          <v-row>
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
            <v-col
              cols="12"
              md="6"
            >
              <v-switch
                v-model="grimpeur.aPaye"
                label="A payé"
                :true-value="1"
                :false-value="0"
              />
            </v-col>
          </v-row>

          <v-btn
            class="mt-4"
            color="secondary"
            @click="MoreInformation"
          >
            Plus d'informations
          </v-btn>

          <v-divider class="my-8" />

          <template v-if="showAdditionalInformation">
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
                  />
                  <v-radio
                    label="Femme"
                    value="F"
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
                  item-text="title"
                  item-value="value"
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
                  item-text="title"
                  item-value="value"
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
            </h2>

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
          </template>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="error"
          text="Annuler"
          variant="elevated"
          @click="close"
        />
        <v-btn
          color="accent"
          text="Sauvegarder"
          variant="elevated"
          :disabled="!valid"
          @click="confirmEdit"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue"

const isOpen = ref(false)
const showAdditionalInformation = ref(false)
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
  aPaye: 0
})

const valid = ref(false)
const emit = defineEmits([ "confirm-edit" ])

const rules = {
  required: (value) => Boolean(value) || "Requis",
  codePostal: (value) => (/^[0-9]{5}$/).test(value) || "Code postal invalide"
}

const MoreInformation = () => {
  showAdditionalInformation.value = !showAdditionalInformation.value
}


const open = (grimpeurData) => {
  if (grimpeurData) {
    grimpeur.value = { ...grimpeurData }
    grimpeur.value.dateNaissance = new Date(grimpeur.value.dateNaissance).toISOString().split("T")[0]
  }
  isOpen.value = true
}

const countries = [
  { title: "Afghanistan", value: "AF" },
  { title: "Afrique du Sud", value: "ZA" },
  { title: "Albanie", value: "AL" },
  { title: "Algérie", value: "DZ" },
  { title: "Allemagne", value: "DE" },
  { title: "Andorre", value: "AD" },
  { title: "Angola", value: "AO" },
  { title: "Anguilla", value: "AI" },
  { title: "Antarctique", value: "AQ" },
  { title: "Antigua-et-Barbuda", value: "AG" },
  { title: "Antilles néerlandaises", value: "AN" },
  { title: "Arabie saoudite", value: "SA" },
  { title: "Argentine", value: "AR" },
  { title: "Arménie", value: "AM" },
  { title: "Aruba", value: "AW" },
  { title: "Australie", value: "AU" },
  { title: "Autriche", value: "AT" },
  { title: "Azerbaïdjan", value: "AZ" },
  { title: "Bahamas", value: "BS" },
  { title: "Bahreïn", value: "BH" },
  { title: "Bangladesh", value: "BD" },
  { title: "Barbade", value: "BB" },
  { title: "Belau", value: "PW" },
  { title: "Belgique", value: "BE" },
  { title: "Belize", value: "BZ" },
  { title: "Bénin", value: "BJ" },
  { title: "Bermudes", value: "BM" },
  { title: "Bhoutan", value: "BT" },
  { title: "Biélorussie", value: "BY" },
  { title: "Birmanie", value: "MM" },
  { title: "Bolivie", value: "BO" },
  { title: "Bosnie-Herzégovine", value: "BA" },
  { title: "Botswana", value: "BW" },
  { title: "Brésil", value: "BR" },
  { title: "Brunei", value: "BN" },
  { title: "Bulgarie", value: "BG" },
  { title: "Burkina Faso", value: "BF" },
  { title: "Burundi", value: "BI" },
  { title: "Cambodge", value: "KH" },
  { title: "Cameroun", value: "CM" },
  { title: "Canada", value: "CA" },
  { title: "Cap-Vert", value: "CV" },
  { title: "Chili", value: "CL" },
  { title: "Chine", value: "CN" },
  { title: "Chypre", value: "CY" },
  { title: "Colombie", value: "CO" },
  { title: "Comores", value: "KM" },
  { title: "Congo", value: "CG" },
  { title: "Corée du Nord", value: "KP" },
  { title: "Corée du Sud", value: "KR" },
  { title: "Costa Rica", value: "CR" },
  { title: "Côte d'Ivoire", value: "CI" },
  { title: "Croatie", value: "HR" },
  { title: "Cuba", value: "CU" },
  { title: "Danemark", value: "DK" },
  { title: "Djibouti", value: "DJ" },
  { title: "Dominique", value: "DM" },
  { title: "Égypte", value: "EG" },
  { title: "Émirats arabes unis", value: "AE" },
  { title: "Équateur", value: "EC" },
  { title: "Érythrée", value: "ER" },
  { title: "Espagne", value: "ES" },
  { title: "Estonie", value: "EE" },
  { title: "États-Unis", value: "US" },
  { title: "Éthiopie", value: "ET" },
  { title: "ex-République yougoslave de Macédoine", value: "MK" },
  { title: "Finlande", value: "FI" },
  { title: "France", value: "FR" },
  { title: "Gabon", value: "GA" },
  { title: "Gambie", value: "GM" },
  { title: "Géorgie", value: "GE" },
  { title: "Ghana", value: "GH" },
  { title: "Gibraltar", value: "GI" },
  { title: "Grèce", value: "GR" },
  { title: "Grenade", value: "GD" },
  { title: "Groenland", value: "GL" },
  { title: "Guadeloupe", value: "GP" },
  { title: "Guam", value: "GU" },
  { title: "Guatemala", value: "GT" },
  { title: "Guinée", value: "GN" },
  { title: "Guinée équatoriale", value: "GQ" },
  { title: "Guinée-Bissao", value: "GW" },
  { title: "Guyana", value: "GY" },
  { title: "Guyane française", value: "GF" },
  { title: "Haïti", value: "HT" },
  { title: "Honduras", value: "HN" },
  { title: "Hong Kong", value: "HK" },
  { title: "Hongrie", value: "HU" },
  { title: "Ile Bouvet", value: "BV" },
  { title: "Ile Christmas", value: "CX" },
  { title: "Ile Norfolk", value: "NF" },
  { title: "Iles Cayman", value: "KY" },
  { title: "Iles Cook", value: "CK" },
  { title: "Iles des Cocos (Keeling)", value: "CC" },
  { title: "Iles Falkland", value: "FK" },
  { title: "Iles Féroé", value: "FO" },
  { title: "Iles Fidji", value: "FJ" },
  { title: "Iles Géorgie du Sud et Sandwich du Sud", value: "GS" },
  { title: "Iles Heard et McDonald", value: "HM" },
  { title: "Iles Marshall", value: "MH" },
  { title: "Iles mineures éloignées des États-Unis", value: "UM" },
  { title: "Iles Pitcairn", value: "PN" },
  { title: "Iles Salomon", value: "SB" },
  { title: "Iles Svalbard et Jan Mayen", value: "SJ" },
  { title: "Iles Turks-et-Caicos", value: "TC" },
  { title: "Iles Vierges américaines", value: "VI" },
  { title: "Iles Vierges britanniques", value: "VG" },
  { title: "Inde", value: "IN" },
  { title: "Indonésie", value: "ID" },
  { title: "Iran", value: "IR" },
  { title: "Iraq", value: "IQ" },
  { title: "Irlande", value: "IE" },
  { title: "Islande", value: "IS" },
  { title: "Israël", value: "IL" },
  { title: "Italie", value: "IT" },
  { title: "Jamaïque", value: "JM" },
  { title: "Japon", value: "JP" },
  { title: "Jordanie", value: "JO" },
  { title: "Kazakhstan", value: "KZ" },
  { title: "Kenya", value: "KE" },
  { title: "Kirghizistan", value: "KG" },
  { title: "Kiribati", value: "KI" },
  { title: "Koweït", value: "KW" },
  { title: "Laos", value: "LA" },
  { title: "Lesotho", value: "LS" },
  { title: "Lettonie", value: "LV" },
  { title: "Liban", value: "LB" },
  { title: "Liberia", value: "LR" },
  { title: "Libye", value: "LY" },
  { title: "Liechtenstein", value: "LI" },
  { title: "Lituanie", value: "LT" },
  { title: "Luxembourg", value: "LU" },
  { title: "Macao", value: "MO" },
  { title: "Macédoine", value: "MK" },
  { title: "Madagascar", value: "MG" },
  { title: "Malaisie", value: "MY" },
  { title: "Malawi", value: "MW" },
  { title: "Maldives", value: "MV" },
  { title: "Mali", value: "ML" },
  { title: "Malte", value: "MT" },
  { title: "Mariannes du Nord", value: "MP" },
  { title: "Maroc", value: "MA" },
  { title: "Martinique", value: "MQ" },
  { title: "Maurice", value: "MU" },
  { title: "Mauritanie", value: "MR" },
  { title: "Mayotte", value: "YT" },
  { title: "Mexique", value: "MX" },
  { title: "Micronésie", value: "FM" },
  { title: "Moldavie", value: "MD" },
  { title: "Monaco", value: "MC" },
  { title: "Mongolie", value: "MN" },
  { title: "Montserrat", value: "MS" },
  { title: "Mozambique", value: "MZ" },
  { title: "Namibie", value: "NA" },
  { title: "Nauru", value: "NR" },
  { title: "Népal", value: "NP" },
  { title: "Nicaragua", value: "NI" },
  { title: "Niger", value: "NE" },
  { title: "Nigeria", value: "NG" },
  { title: "Nioué", value: "NU" },
  { title: "Norvège", value: "NO" },
  { title: "Nouvelle-Calédonie", value: "NC" },
  { title: "Nouvelle-Zélande", value: "NZ" },
  { title: "Oman", value: "OM" },
  { title: "Ouganda", value: "UG" },
  { title: "Ouzbékistan", value: "UZ" },
  { title: "Pakistan", value: "PK" },
  { title: "Panama", value: "PA" },
  { title: "Papouasie-Nouvelle-Guinée", value: "PG" },
  { title: "Paraguay", value: "PY" },
  { title: "Pays-Bas", value: "NL" },
  { title: "Pérou", value: "PE" },
  { title: "Philippines", value: "PH" },
  { title: "Pologne", value: "PL" },
  { title: "Polynésie française", value: "PF" },
  { title: "Porto Rico", value: "PR" },
  { title: "Portugal", value: "PT" },
  { title: "Qatar", value: "QA" },
  { title: "République centrafricaine", value: "CF" },
  { title: "République démocratique du Congo", value: "CD" },
  { title: "République dominicaine", value: "DO" },
  { title: "République tchèque", value: "CZ" },
  { title: "Réunion", value: "RE" },
  { title: "Roumanie", value: "RO" },
  { title: "Royaume-Uni", value: "GB" },
  { title: "Russie", value: "RU" },
  { title: "Rwanda", value: "RW" },
  { title: "Sahara occidental", value: "EH" },
  { title: "Saint-Christophe-et-Niévès", value: "KN" },
  { title: "Saint-Marin", value: "SM" },
  { title: "Saint-Pierre-et-Miquelon", value: "PM" },
  { title: "Saint-Siège", value: "VA" },
  { title: "Saint-Vincent-et-les-Grenadines", value: "VC" },
  { title: "Sainte-Hélène", value: "SH" },
  { title: "Sainte-Lucie", value: "LC" },
  { title: "Salvador", value: "SV" },
  { title: "Samoa", value: "WS" },
  { title: "Samoa américaines", value: "AS" },
  { title: "Sao Tomé-et-Principe", value: "ST" },
  { title: "Sénégal", value: "SN" },
  { title: "Serbie", value: "SER" },
  { title: "Seychelles", value: "SC" },
  { title: "Sierra Leone", value: "SL" },
  { title: "Singapour", value: "SG" },
  { title: "Slovaquie", value: "SK" },
  { title: "Slovénie", value: "SI" },
  { title: "Somalie", value: "SO" },
  { title: "Soudan", value: "SD" },
  { title: "Sri Lanka", value: "LK" },
  { title: "Suède", value: "SE" },
  { title: "Suisse", value: "CH" },
  { title: "Suriname", value: "SR" },
  { title: "Swaziland", value: "SZ" },
  { title: "Syrie", value: "SY" },
  { title: "Tadjikistan", value: "TJ" },
  { title: "Taïwan", value: "TW" },
  { title: "Tanzanie", value: "TZ" },
  { title: "Tchad", value: "TD" },
  { title: "Terres australes françaises", value: "TF" },
  { title: "Territoire britannique de l'Océan Indien", value: "IO" },
  { title: "Thaïlande", value: "TH" },
  { title: "Timor Oriental", value: "TL" },
  { title: "Togo", value: "TG" },
  { title: "Tokélaou", value: "TK" },
  { title: "Tonga", value: "TO" },
  { title: "Trinité-et-Tobago", value: "TT" },
  { title: "Tunisie", value: "TN" },
  { title: "Turkménistan", value: "TM" },
  { title: "Turquie", value: "TR" },
  { title: "Tuvalu", value: "TV" },
  { title: "Ukraine", value: "UA" },
  { title: "Uruguay", value: "UY" },
  { title: "Vanuatu", value: "VU" },
  { title: "Venezuela", value: "VE" },
  { title: "Viêt Nam", value: "VN" },
  { title: "Wallis-et-Futuna", value: "WF" },
  { title: "Yémen", value: "YE" },
  { title: "Zambie", value: "ZM" },
  { title: "Zimbabwe", value: "ZW" }
]

const close = () => {
  isOpen.value = false
}

const confirmEdit = () => {
  emit("confirm-edit", grimpeur.value)
  close()
}

defineExpose({ open, close })
</script>
