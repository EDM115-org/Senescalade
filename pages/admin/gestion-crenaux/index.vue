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
              <h2>Gestion des séances</h2>
            </v-card-title>
            <v-card-text>
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th
                        style="width: 10%;"
                        class="text-center"
                      >
                        ID
                      </th>
                      <th
                        style="width: 15%;"
                        class="text-center"
                      >
                        Jour
                      </th>
                      <th
                        style="width: 15%;"
                        class="text-center"
                      >
                        Heure
                      </th>
                      <th
                        style="width: 15%;"
                        class="text-center"
                      >
                        Durée
                      </th>
                      <th
                        style="width: 15%;"
                        class="text-center"
                      >
                        Type
                      </th>
                      <th
                        style="width: 15%;"
                        class="text-center"
                      >
                        Niveau
                      </th>
                      <th
                        style="width: 10%;"
                        class="text-center"
                      >
                        Places
                      </th>
                      <th
                        style="width: 10%;"
                        class="text-center"
                      >
                        Places restantes
                      </th>
                      <th
                        style="width: 15%;"
                        class="text-center"
                      >
                        Professeur
                      </th>
                      <th
                        style="width: 15%;"
                        class="text-center"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="seance in seances"
                      :key="seance.idSeance"
                    >
                      <td class="text-center">
                        {{ seance.idSeance }}
                      </td>
                      <td class="text-center">
                        {{ seance.jour }}
                      </td>
                      <td class="text-center">
                        {{ seance.heureSeance }}
                      </td>
                      <td class="text-center">
                        {{ seance.dureeSeance }}
                      </td>
                      <td class="text-center">
                        {{ seance.typeSeance }}
                      </td>
                      <td class="text-center">
                        {{ seance.niveau }}
                      </td>
                      <td class="text-center">
                        {{ seance.nbPlaces }}
                      </td>
                      <td class="text-center">
                        {{ seance.nbPlacesRestantes }}
                      </td>
                      <td class="text-center">
                        {{ seance.professeur }}
                      </td>
                      <td class="text-center">
                        <v-btn color="primary">
                          Modifier
                        </v-btn>
                        <v-btn color="primary">
                          Supprimer
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useMainStore } from "~/store/main"

const store = useMainStore()
const router = useRouter()
const adminLogged = ref(false)
const seances = ref([])

const fetchSeance = async () => {
  try {
    const result = await $fetch("/api/fetchSeance")

    if (result.status === 200) {
      seances.value = result.body
    } else {
      console.error("Error fetching seances : ", result)
    }
  } catch (error) {
    console.error("Error fetching seances : ", error)
  }
}

onMounted(() => {
  const user = store.getUser

  if (user) {
    if (user.isAdmin !== 1) {
      router.push("/user")
    } else {
      adminLogged.value = true
      fetchSeance()
    }
  } else {
    router.push("/login")
  }
})
</script>
