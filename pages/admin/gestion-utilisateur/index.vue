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
              <h2>Gestion des utilisateurs</h2>
            </v-card-title>
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th
                      class="text-center"
                      style="width: 33%;"
                    >
                      Id
                    </th>
                    <th
                      class="text-center"
                      style="width: 33%;"
                    >
                      Email
                    </th>
                    <th
                      class="text-center"
                      style="width: 34%;"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="user in users"
                    :key="user.idInscription"
                  >
                    <td class="text-center">
                      {{ user.idInscription }}
                    </td>
                    <td class="text-center">
                      {{ user.mail }}
                    </td>
                    <td class="d-flex justify-center align-center text-center">
                      <v-btn
                        color="accent"
                        class="mr-2"
                        icon="mdi-pencil"
                        @click="editUser(user)"
                      />
                      <v-btn
                        color="error"
                        icon="mdi-delete"
                        @click="deleteUser(user)"
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
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useMainStore } from "~/store/main"

const store = useMainStore()
const router = useRouter()
const adminLogged = ref(false)
const users = ref([])

const fetchInscription = async () => {
  try {
    const result = await $fetch("/api/fetchInscription")

    if (result.status === 200) {
      users.value = result.body
    } else {
      console.error("Error fetching users:", result)
    }
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}

const editUser = (user) => {
  // Handle user edit logic
  console.log("Edit user:", user)
}

const deleteUser = (user) => {
  // Handle user delete logic
  console.log("Delete user:", user)
}

onMounted(async () => {
  const user = store.getUser

  try {
    const response = await $fetch("/api/getPermAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
      }),
    })

    if (response) {
      if (response.body[0].ReadListUtilisateur !== 1) {
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
      fetchInscription()
    }
  } else {
    router.push("/login")
  }
})
</script>
