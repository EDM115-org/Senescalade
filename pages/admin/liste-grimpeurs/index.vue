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
              <h2>Gestion des grimpeurs</h2>
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
                      />
                      <v-btn
                        color="error"
                        class="mr-2"
                        icon="mdi-delete"
                      />
                      <v-btn
                        color="success"
                        class="mr-2"
                        icon="mdi-file-download-outline"
                      />
                      <v-btn
                        color="secondary"
                        icon="mdi-dots-horizontal-circle-outline"
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

onMounted(async () => {
  const user = store.getUser

  try {
    const response = await $fetch("/api/getPermAdmin", {
      method: "POST",
      body: JSON.stringify({
        user: user
      })
    })

    if (response) {
      if (response.body[0].ReadListGrimpeur !== 1) {
        return router.push("/admin/dashboard")
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
</script>
