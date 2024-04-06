<template>
  <v-app>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
// eslint-disable-next-line no-undef
useHead({
  title: "Senescalade",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "Senescalade" }
  ],
  link: [
    { rel: "icon", type: "image/ico", href: "/favicon.ico" }
  ]
})
</script>

<style scoped>
:deep(.v-input .v-input__details) {
  display: none;
}
</style>
