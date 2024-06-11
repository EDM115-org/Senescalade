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
              <h2>Gestion des administrateurs</h2>
            </v-card-title>
            <v-card-text>
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th
                        style="width: 33%;"
                        class="text-center"
                      >
                        Id
                      </th>
                      <th
                        style="width: 33%;"
                        class="text-center"
                      >
                        Email
                      </th>
                      <th
                        style="width: 34%;"
                        class="text-center"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="admin in admins"
                      :key="admin.idInscription"
                    >
                      <td class="text-center">
                        {{ admin.idInscription }}
                      </td>
                      <td class="text-center">
                        {{ admin.mail }}
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
const admins = ref([])

const fetchAdmin = async () => {
  try {
    const result = await $fetch("/api/fetchAdmin")

    if (result.status === 200) {
      admins.value = result.body
    } else {
      console.error("Error fetching admins : ", result)
    }
  } catch (error) {
    console.error("Error fetching admins : ", error)
  }
}

onMounted(async () => {
  const user = store.getUser

  try {
    const response = await $fetch("/api/getPermAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: user
      })
    })

    if (response) {
      if (response.body[0].ReadListAdmin !== 1) {
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
      fetchAdmin()
    }
  } else {
    router.push("/login")
  }
})
</script>
