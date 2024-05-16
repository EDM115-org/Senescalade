<template>
  <v-container class="fillheight">
    <FormUser
      text="Ajouter un grimpeur"
      @submit:adduser="adduser($event)"
    />
  </v-container>
</template>

<script setup>
async function adduser(event) {
  try {
    await $fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(event),
    })

    if (result.status === 200) {
      router.push("/user")
    } else {
      console.error("Error logging in user :", result)
    }
  } catch (error) {
    console.error("Error adding user :", error)
  }
}
</script>
