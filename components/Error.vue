<template>
  <v-alert
    v-if="!close"
    class="mx-auto"
    color="error"
    closable
    variant="elevated"
    :width="mdAndUp ? '25%' : '75%'"
    @click:close="close = true"
  >
    <v-btn
      v-if="issue"
      color="secondary"
      class="mr-4"
      icon="mdi-information-outline"
      variant="flat"
      @click="more = !more"
    />
    <v-btn
      v-else
      color="secondary"
      class="mr-4"
      icon="mdi-information-outline"
      variant="flat"
      readonly
    />
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
