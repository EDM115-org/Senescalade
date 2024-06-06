<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col
        v-for="person in displayedPersons"
        :key="person.idPersonne"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="person-card">
          <v-card-title>{{ person.prenom }} {{ person.nom }}</v-card-title>
          <v-card-subtitle>{{ person.ville }}, {{ person.pays }}</v-card-subtitle>
          <v-card-text>
            <p><strong>Date de Naissance:</strong> {{ formatBirthDate(person.dateNaissance) }}</p>
            <p><strong>Sexe:</strong> {{ person.sexe === 'H' ? 'Homme' : 'Femme' }}</p>
            <p><strong>Nationalité:</strong> {{ person.nationalite }}</p>
            <p><strong>Téléphone:</strong> {{ person.telephone || 'N/A' }}</p>
            <p><strong>Mobile:</strong> {{ person.mobile || 'N/A' }}</p>
            <p><strong>Adresse:</strong> {{ person.adresse }}</p>
            <p><strong>Code Postal:</strong> {{ person.codePostal }}</p>
            <p><strong>Courriel:</strong> {{ person.courriel2 || 'N/A' }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
            >
              Modifier
            </v-btn>
            <v-btn
              color="primary"
            >
              Supprimer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useMainStore } from "~/store/main"
import { ref, onMounted, computed } from "vue"

const store = useMainStore()
const persons = ref([])
const role = ref(store.getUser.isAdmin)

const fetchPersons = async () => {
  try {
    const data = await $fetch("/api/fetchUser")

    persons.value = data.body
  } catch (error) {
    console.error("Error fetching persons:", error)
  }
}

onMounted(fetchPersons)

const displayedPersons = computed(() => {
  return role.value === 1 ? persons.value : persons.value.filter((person) => person.lInscription === store.getUser.id)
})

const formatBirthDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.person-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
  padding: 15px;
  transition: box-shadow 0.3s ease;
}

.person-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.v-row {
  margin-top: 20px;
}
</style>
