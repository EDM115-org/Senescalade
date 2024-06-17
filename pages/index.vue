<template>
  <v-container
    class="fill-height"
  >
    <v-row
      align="center"
      align-content="center"
      justify="center"
    >
      <v-col
        align="center"
      >
        <v-img
          :draggable="false"
          class="mb-4"
          max-height="200"
          max-width="200"
          rounded="xl"
          src="/images/logo-black-red.png"
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
                variant="elevated"
              >
                Inscription
              </v-btn>
            </NuxtLink>
          </v-col>
          <v-col>
            <NuxtLink
              to="/login"
            >
              <v-btn
                color="secondary"
                variant="elevated"
              >
                Connexion
              </v-btn>
            </NuxtLink>
          </v-col>
        </v-row>
        <v-divider
          v-if="displayOptionsHelpText"
          class="my-4"
        />
        <p
          v-if="displayOptionsHelpText"
          class="text-center mb-4 my-4"
        >
          Pour vous inscrire, cliquez sur le bouton "Inscription" et suivez les instructions.<br>
          Pour vous connecter, cliquez sur le bouton "Connexion" et saisissez vos identifiants.<br>
          Si vous avez des questions, n'hésitez pas à nous contacter à l'adresse suivante : <a href="mailto:" />
        </p>
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

onMounted(() => {
  const user = store.getUser

  if (user) {
    if (user.isAdmin) {
      router.push("/admin/dashboard")
    } else {
      router.push("/user")
    }
  }
})
</script>
