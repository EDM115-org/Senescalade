<template>
  <v-alert
    v-if="!close"
    class="mx-auto"
    :color="color"
    closable
    variant="elevated"
    :width="mdAndUp ? '25%' : '75%'"
    @click:close="close = true"
  >
    <v-tooltip
      location="top"
      text="Informations supplémentaires"
      theme="light"
    >
      <template #activator="{ props }">
        <v-btn
          v-if="issue"
          v-bind="props"
          :color="color"
          class="mr-4"
          icon="mdi-information-outline"
          variant="flat"
          @click="more = !more"
        />
        <v-btn
          v-else
          v-bind="props"
          :color="color"
          class="mr-4"
          icon="mdi-information-outline"
          variant="flat"
          readonly
        />
      </template>
    </v-tooltip>
    {{ message }}
    <div v-if="more">
      <v-divider class="my-4" />
      {{ issue }}
    </div>
  </v-alert>
</template>

<script setup>
import { ref } from "vue"
import { useDisplay } from "vuetify"

defineProps({
  color: {
    type: String,
    default: "error"
  },
  issue: {
    type: String,
    default: ""
  },
  message: {
    type: String,
    required: true
  }
})

const more = ref(false)
const close = ref(false)

const { mdAndUp } = useDisplay()
</script>

<style scoped>
.v-alert {
  margin: 16px 0;
}
</style>
