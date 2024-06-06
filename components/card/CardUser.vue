<template>
  <v-container>
    <v-row>
      <v-col
        v-for="person in persons"
        :key="person.idPersonne"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card variant="outlined">
          <v-card-title>
            {{ person.prenom }} {{ person.nom }}
          </v-card-title>
          <v-card-subtitle>
            {{ person.ville }}, {{ person.pays }}
          </v-card-subtitle>
          <v-card-text>
            <p><strong>Date de Naissance:</strong> {{ new Date(person.dateNaissance).toLocaleDateString() }}</p>
            <p><strong>Sexe:</strong> {{ person.sexe === 'H' ? 'Homme' : 'Femme' }}</p>
            <p><strong>Nationalité:</strong> {{ person.nationalite }}</p>
            <p><strong>Téléphone:</strong> {{ person.telephone || 'N/A' }}</p>
            <p><strong>Mobile:</strong> {{ person.mobile || 'N/A' }}</p>
            <p><strong>Adresse:</strong> {{ person.adresse }}</p>
            <p v-if="person.complementAdresse">
              <strong>Complément d'adresse:</strong> {{ person.complementAdresse }}
            </p>
            <p><strong>Code Postal:</strong> {{ person.codePostal }}</p>
            <p><strong>Courriel:</strong> {{ person.courriel2 || 'N/A' }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"

const persons = ref([])

const fetchPersons = async () => {
  try {
    const data = await $fetch("/api/fetchUser")

    persons.value = data.body

    console.log(persons.value)
  } catch (error) {
    console.error("Error fetching persons:", error)
  }
}

onMounted(fetchPersons)
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>
