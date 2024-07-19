<template>
  <div :class="mdAndUp ? 'mx-16 my-4' : ''">
    <FullCalendar
      :options="calendarOptions"
    >
      <template #eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <br>
        {{ arg.event.title }} {{ arg.event.extendedProps.niveau ? `- ${arg.event.extendedProps.niveau}` : "" }}
      </template>
    </FullCalendar>
    <v-tooltip
      v-if="showTooltip"
      :activator="tooltipActivator"
      :model-value="showTooltip"
      location="top"
      theme="light"
    >
      <template #default>
        {{ tooltipContent }}
      </template>
    </v-tooltip>
  </div>
</template>

<script setup>
import frLocale from "@fullcalendar/core/locales/fr"
import timeGridPlugin from "@fullcalendar/timegrid"
import FullCalendar from "@fullcalendar/vue3"

import { useMainStore } from "~/store/main"
import { computed, onMounted, ref, watch } from "vue"
import { useDisplay, useTheme } from "vuetify"

const { mdAndUp } = useDisplay()
const theme = useTheme()

const store = useMainStore()
const user = computed(() => store.getUser)

const emit = defineEmits([ "event-click", "no-events-left" ])
const props = defineProps({
  birthdate: {
    type: String,
    default: ""
  }
})

const showTooltip = ref(false)
const tooltipContent = ref("")
const tooltipActivator = ref(null)

const calendarOptions = ref({
  allDaySlot: false,
  dayHeaderFormat: mdAndUp.value ? { weekday: "long" } : { weekday: "short" },
  dayMaxEvents: true,
  expandRows: true,
  eventClick: handleEventClick,
  eventMouseEnter: handleEventMouseEnter,
  eventMouseLeave: handleEventMouseLeave,
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
  weekends: true
})
const formattedEvents = ref([])

function handleEventClick(clickInfo) {
  emit("event-click", clickInfo.event)
}

function createTooltip(mouseEnterInfo) {
  const event = mouseEnterInfo.event
  const duration = minutesToTimeString(calculateDurationInMinutes(event.start, event.end))

  tooltipContent.value = `Places restantes : ${event.extendedProps.nbPlacesRestantes}/${event.extendedProps.nbPlaces}, Durée: ${duration}`
  tooltipActivator.value = mouseEnterInfo.el
  showTooltip.value = true
}

function calculateDurationInMinutes(startTime, endTime) {
  const start = new Date(startTime)
  const end = new Date(endTime)

  return (end - start) / (1000 * 60)
}

function minutesToTimeString(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${hours}h${mins < 10 ? "0" : ""}${mins}`
}

function handleEventMouseEnter(mouseEnterInfo) {
  if (mouseEnterInfo.event.extendedProps.nbPlacesRestantes !== 0) {
    mouseEnterInfo.el.style.cursor = "pointer"
  }
  createTooltip(mouseEnterInfo)
}

function handleEventMouseLeave(mouseLeaveInfo) {
  mouseLeaveInfo.el.style.cursor = "default"
  showTooltip.value = false
}

function determineCategory(birthDate) {
  const today = new Date()
  const currentYear = today.getFullYear()
  const birthYear = parseInt(birthDate.slice(0, 4))
  const birthMonth = parseInt(birthDate.slice(5, 7))

  let ageAtEndOfYear = currentYear - birthYear

  if (birthMonth > 6) {
    ageAtEndOfYear -= 1
  }

  if (ageAtEndOfYear < 4) {
    return [ null, null ]
  } else if (ageAtEndOfYear <= 8) {
    return [ "Babygrimpe", null ]
  } else if (ageAtEndOfYear <= 10) {
    return [ null, "U10" ]
  } else if (ageAtEndOfYear <= 12) {
    return [ null, "U12" ]
  } else if (ageAtEndOfYear <= 14) {
    return [ null, "U14" ]
  } else if (ageAtEndOfYear <= 16) {
    return [ null, "U16" ]
  } else if (ageAtEndOfYear <= 18) {
    return [ null, "U18" ]
  } else {
    return [ "Adultes", null ]
  }
}

watch(theme.name, () => {
  calendarOptions.value.eventBorderColor = theme.name.value === "light" ? theme.current.value.colors.text : "transparent"
  formattedEvents.value.forEach((event) => {
    event.backgroundColor = event.extendedProps.nbPlacesRestantes === 0 ? theme.current.value.colors.error : theme.current.value.colors.success
  })
})

onMounted(async () => {
  const response = await $fetch("/api/fetch?type=seance", {
    headers: { Authorization: `Bearer ${user.value.token}` }
  })
  const events = response.body

  const startOfWeek = daysOfTheCurrentWeek()[0]

  formattedEvents.value = events.map((event) => {
    if (props.birthdate && props.birthdate !== "") {
      const [ type, niveau ] = determineCategory(props.birthdate)

      if (type === null && niveau === null) {
        return null
      }

      if (type !== null) {
        if (event.typeSeance !== type) {
          return null
        }
      } else {
        if (event.niveau !== niveau) {
          return null
        }
      }
    }

    const eventDay = dayToDayNumber(event.jour)
    const eventDate = new Date(startOfWeek)

    eventDate.setDate(startOfWeek.getDate() + eventDay - 1)

    return {
      id: event.idSeance,
      title: event.typeSeance,
      start: `${eventDate.toISOString().split("T")[0]}T${event.heureDebutSeance}`,
      end: `${eventDate.toISOString().split("T")[0]}T${event.heureFinSeance}`,
      extendedProps: {
        jour: event.jour,
        niveau: event.niveau,
        nbPlaces: event.nbPlaces,
        nbPlacesRestantes: event.nbPlacesRestantes,
        professeur: event.professeur
      },
      backgroundColor: event.nbPlacesRestantes === 0 ? theme.current.value.colors.error : theme.current.value.colors.success,
      textColor: event.nbPlacesRestantes === 0 ? theme.computedThemes.value.light.colors.background : theme.computedThemes.value.light.colors.text
    }
  }).filter((event) => event !== undefined && event !== null)

  if (formattedEvents.value.every((event) => event.extendedProps.nbPlacesRestantes === 0)) {
    emit("no-events-left")
  }

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
