<template>
  <v-app>
    <v-main>
      <LayoutNavBar />
      <LayoutNavBarAdmin />
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
useHead({
  title: "Senescalade",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "Senescalade" }
  ],
  link: [{ rel: "icon", type: "image/ico", href: "/favicon.ico" }]
})
</script>

<style>
.simple-enter-active,
.simple-leave-active {
  transition: all 0.2s ease-in-out;
}

.simple-enter-from,
.simple-leave-to {
  filter: blur(0.5rem);
  opacity: 0;
  transform: translateY(-20px);
}
</style>
