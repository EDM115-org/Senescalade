<template>
  <div :class="mdAndUp ? 'mx-16 my-4' : ''">
    <FullCalendar
      :options="calendarOptions"
    >
      <template #eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  </div>
</template>

<script setup>
import frLocale from "@fullcalendar/core/locales/fr"
import timeGridPlugin from "@fullcalendar/timegrid"
import FullCalendar from "@fullcalendar/vue3"
import { ref, onMounted, watch } from "vue"
import { useDisplay, useTheme } from "vuetify"

const { mdAndUp } = useDisplay()
const theme = useTheme()

const emit = defineEmits([ "event-click" ])

const calendarOptions = ref({
  allDaySlot: false,
  dayHeaderFormat: mdAndUp.value ? { weekday: "long" } : { weekday: "short" },
  dayMaxEvents: true,
  expandRows: true,
  eventClick: handleEventClick,
  events: [],
  firstDay: 1,
  headerToolbar: false,
  height: "auto",
  initialView: "timeGridWeek",
  locale: frLocale,
  plugins: [ timeGridPlugin ],
  slotEventOverlap: false,
  slotLabelFormat: { hour: "2-digit", minute: "2-digit", omitZeroMinute: false, meridiem: false },
  slotMinTime: "08:00:00",
  slotMaxTime: "23:00:00",
  titleFormat: { year: "numeric", month: "long", day: "numeric" },
  weekends: true,
})
const formattedEvents = ref([])

function handleEventClick(clickInfo) {
  console.log(clickInfo)
  emit("event-click", clickInfo)
}

watch(theme.name, () => {
  calendarOptions.value.eventBorderColor = theme.name.value === "light" ? theme.current.value.colors.text : "transparent"
  formattedEvents.value.forEach((event) => {
    event.backgroundColor = event.extendedProps.nbPlacesRestantes === 0 ? theme.current.value.colors.error : theme.current.value.colors.success
  })
})

onMounted(async () => {
  const response = await $fetch("/api/fetchSeance")
  const events = response.body

  const startOfWeek = daysOfTheCurrentWeek()[0]

  formattedEvents.value = events.map((event) => {
    const eventDay = dayToDayNumber(event.jour)
    const eventDate = new Date(startOfWeek)

    eventDate.setDate(startOfWeek.getDate() + eventDay - 1)

    return {
      id: event.idSeance,
      title: event.typeSeance,
      start: `${eventDate.toISOString().split("T")[0]}T${event.heureDebutSeance}`,
      end: `${eventDate.toISOString().split("T")[0]}T${event.heureFinSeance}`,
      extendedProps: {
        niveau: event.niveau,
        nbPlaces: event.nbPlaces,
        nbPlacesRestantes: event.nbPlacesRestantes,
        professeur: event.professeur
      },
      backgroundColor: event.nbPlacesRestantes === 0 ? theme.current.value.colors.error : theme.current.value.colors.success,
      textColor: event.nbPlacesRestantes === 0 ? theme.computedThemes.value.light.colors.background : theme.computedThemes.value.light.colors.text
    }
  })

  calendarOptions.value.events = formattedEvents.value
  calendarOptions.value.eventBorderColor = theme.name.value === "light" ? theme.current.value.colors.text : "transparent"
  calendarOptions.value.eventTextColor = theme.computedThemes.value.dark.colors.background
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

<style>
.fc .fc-timegrid-col.fc-day-today {
  background-color: transparent;
}

.fc .fc-timegrid-slot-minor {
  border-top-style: solid;
}

th {
  background-color: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-text));
}
</style>
