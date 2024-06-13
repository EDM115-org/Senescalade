<template>
  <FullCalendar
    :options="calendarOptions"
  >
    <template #eventContent="arg">
      <b>{{ arg.timeText }}</b>
      <i>{{ arg.event.title }}</i>
    </template>
  </FullCalendar>
</template>

<script setup>
import { ref, onMounted } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

const calendarOptions = ref({
  allDaySlot: false,
  buttonText: {
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    list: "Liste"
  },
  dayHeaderFormat: { weekday: "long" },
  dayMaxEvents: true,
  editable: false,
  eventBackgroundColor: "#44475A",
  eventClick: handleEventClick,
  eventBorderColor: "#BD93F9",
  events: [],
  eventTextColor: "#F8F8F2",
  firstDay: 1,
  headerToolbar: {
    left: "",
    center: "",
    right: ""
  },
  height: "auto",
  initialView: "timeGridWeek",
  locale: "fr",
  plugins: [
    timeGridPlugin,
    interactionPlugin
  ],
  selectable: false,
  selectMirror: true,
  titleFormat: { year: "numeric", month: "long", day: "numeric" },
  weekends: true,
})

const currentEvents = ref([])

function handleEventClick(clickInfo) {
  alert(`Séance: ${clickInfo.event.title}\nNiveau: ${clickInfo.event.extendedProps.niveau}\nPlaces: ${clickInfo.event.extendedProps.nbPlaces}\nPlaces restantes: ${clickInfo.event.extendedProps.nbPlacesRestantes}\nProfesseur: ${clickInfo.event.extendedProps.professeur}`)
}

onMounted(async () => {
  const response = await $fetch("/api/fetchSeance")
  const events = response.body

  const startOfWeek = daysOfTheCurrentWeek()[0]

  const formattedEvents = events.map((event) => {
    const eventDay = dayToDayNumber(event.jour)
    const eventDate = new Date(startOfWeek)

    eventDate.setDate(startOfWeek.getDate() + eventDay - 1)

    return {
      title: event.typeSeance,
      start: `${eventDate.toISOString().split("T")[0]}T${event.heureDebutSeance}`,
      end: `${eventDate.toISOString().split("T")[0]}T${event.heureFinSeance}`,
      extendedProps: {
        niveau: event.niveau,
        nbPlaces: event.nbPlaces,
        nbPlacesRestantes: event.nbPlacesRestantes,
        professeur: event.professeur
      }
    }
  })

  calendarOptions.value.events = formattedEvents
})

function daysOfTheCurrentWeek() {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(today.setDate(diff))
  const days = []

  for (let i = 0; i < 7; i++) {
    days.push(new Date(monday))
    monday.setDate(monday.getDate() + 1)
  }

  return days
}

function dayToDayNumber(day) {
  switch (day.toLowerCase()) {
    case "lundi":
      return 1
    case "mardi":
      return 2
    case "mercredi":
      return 3
    case "jeudi":
      return 4
    case "vendredi":
      return 5
    case "samedi":
      return 6
    case "dimanche":
      return 7
    default:
      return 0
  }
}
</script>

<style scoped>
/* @import '~@fullcalendar/common/main.css';
@import '~@fullcalendar/timegrid/main.css'; */

.fc .fc-toolbar-title {
  font-size: 1.5em;
  color: var(--v-primary-base);
}
.fc .fc-event {
  background-color: var(--v-primary-base);
  color: #fff;
}
.fc .fc-event-time, .fc .fc-event-title {
  color: #fff;
}
</style>
