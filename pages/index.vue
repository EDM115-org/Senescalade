<template>
  <v-container
    class="fill-height"
  >
    <Error
      v-if="errorMessage"
      :issue="issueMessage"
      :message="errorMessage"
      :color="messageColor"
    />
    <v-row
      align="center"
      align-content="center"
      justify="center"
    >
      <v-col align="center">
        <v-img
          :draggable="false"
          class="mb-4"
          max-height="200"
          max-width="200"
          rounded="xl"
          src="/images/logo-black-red-transparent.png"
        />
        Bienvenue sur le site d'inscription de Senescalade<br>
        Ici vous pourrez vous inscrire à l'association, choisir un créneau, payer en ligne, récupérer votre licence et bien plus encore.<br>
        Cliquez sur le bouton d'aide pour en savoir plus.
        <v-btn
          class="ml-2"
          color="accent"
          icon="mdi-tooltip-question-outline"
          variant="elevated"
          @click="displayOptionsHelpText = !displayOptionsHelpText"
        />
        <v-divider class="my-4" />
        <v-row>
          <v-col>
            <NuxtLink
              to="/register"
            >
              <v-btn
                color="secondary"
                text="Inscription"
                variant="elevated"
              />
            </NuxtLink>
          </v-col>
          <v-col>
            <NuxtLink
              to="/login"
            >
              <v-btn
                color="secondary"
                text="Connexion"
                variant="elevated"
              />
            </NuxtLink>
          </v-col>
          <v-col>
            <NuxtLink
              to="/seances"
            >
              <v-btn
                color="secondary"
                text="Voir les séances"
                variant="elevated"
              />
            </NuxtLink>
          </v-col>
        </v-row>
        <v-divider
          v-if="displayOptionsHelpText"
          class="my-4"
        />
        <div
          v-if="displayOptionsHelpText"
          class="text-start mb-4 my-4"
        >
          <h1>Aide</h1>
          <h2>Page d'accueil</h2>
          <h3>Inscription</h3>
          Pour vous inscrire, cliquez sur le bouton "Inscription".<br>
          Vous aurez besoin d'entrer une adresse email valide et un mot de passe.<br>
          Vous serez ensuite redirigé vers la page de connexion.
          <h3>Connexion</h3>
          Pour vous connecter, cliquez sur le bouton "Connexion" et saisissez vos identifiants.<br>
          La case "Rester connecté" vous permet de rester connecté durant 30 jours sans avoir besoin de rentrer à nouveau votre mot de passe.
          <h3>Barre de navigation</h3>
          Grâce à cette barre vous pouvez : revenir à l'accueil en cliquant sur la salamandre, vous connecter/déconnecter et changer entre le thème clair et sombre.
          <h2>Espace utilisateur</h2>
          Cettte page vous permet de visualiser en un coup d'oeil l'avancement de l'inscription des grimpeurs que vous gérez.<br>
          C'est également ici que vous pourrez récupérer le numéro de license, modifier votre profil et ajouter un nouveau grimpeur.
          <h3>Modifier son profil</h3>
          Cette page vous permet de modifier votre mot de passe et de supprimer votre compte.
          <h3>Ajouter un grimpeur</h3>
          Ce formulaire en 4 étapes vous permettra d'inscrire un nouveau grimpeur à l'association.
          <h4>Etape 1 : Date de naissance</h4>
          Vous devez renseigner la date de naissance du grimpeur pour déterminer le créneau auquel il peut s'inscrire.
          <h4>Etape 2 : Choix du créneau</h4>
          Vous devez choisir le créneau auquel le grimpeur s'inscrira. Cliquez sur le créneau dans le calendrier pour le sélectionner.<br>
          Un créneau vert signifie qu'il reste des places, un créneau rouge signifie qu'il est complet.<br>
          Si le créneau est complet, vous pouvez ajouter le grimpeur à la liste d'attente.
          <h4>Etape 3 : Informations personnelles</h4>
          Vous devez renseigner les informations personnelles du grimpeur. C'est également ici que vous pourrez ajouter des options à l'assurance incluse dans l'inscription.
          <h4>Etape 4 : Paiement</h4>
          Vous devez payer l'inscription du grimpeur pour valider son inscription. Le montant est calculé en fonction des options choisies à l'étape 3.<br>
          Une fois le paiement effectué, une vérification manuelle sera effectuée par l'association pour valider l'inscription, puis vous pourrez récupérer la license du grimpeur.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { useMainStore } from "~/store/main"
import { onMounted, ref } from "vue"

const store = useMainStore()
const router = useRouter()

const displayOptionsHelpText = ref(false)

const errorMessage = ref("")
const issueMessage = ref("")

onMounted(async () => {
  const user = store.getUser

  if (user) {
    if (user.isAdmin) {
      router.push("/admin/dashboard")
    } else {
      try {
        const response = await $fetch("/api/fetch?type=mailIsVerified", {
          method: "POST",
          body: JSON.stringify({ mail: user.mail }),
          headers: { Authorization: `Bearer ${user.token}` }
        })

        if (response.body.mailIsVerified === 1) {
          router.push("/user")
        } else {
          router.push("/login/MailVerify")
        }
      } catch (error) {
        errorMessage.value = error.data.message
        issueMessage.value = error.data.statusMessage ?? ""
      }
    }
  }
})
</script>

<style scoped>
h1, h2, h3, h4 {
  margin-top: 1rem;
}
</style>
