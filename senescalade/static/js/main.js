/**
 * Converts a date string from 'DD MMMM YYYY' format to 'YYYY-MM-DD' format.
 * @param {string} dateString - The date string in 'DD MMMM YYYY' format.
 * @returns {string} The date string in 'YYYY-MM-DD' format.
 */
function convertDateFormat(dateString) {  // skipcq: JS-0128
    const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    const parts = dateString.split(' ');

    if (parts.length !== 3) {
        throw new Error('Invalid date format');
    }

    let day = parts[0];
    let month = monthNames.indexOf(parts[1].toLowerCase()) + 1;
    const year = parts[2];

    if (month < 10) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return `${year}-${month}-${day}`;
}


/**
 * Determines the category based on the age calculated from the birth date.
 * @param {string} birthDate - The birth date of a person in the format 'YYYY-MM-DD'.
 * @returns {string} The category based on the calculated age.
 */
function determineCategory(birthDate) {  // skipcq: JS-0128
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(birthDate.split("-")[0]);
    const age = currentYear - birthYear;

    if (age < 6) {
        return 'Babygrimpe';
    } else if (age < 10) {
        return 'U10';
    } else if (age < 12) {
        return 'U12';
    } else if (age < 14) {
        return 'U14';
    } else if (age < 16) {
        return 'U16';
    } else if (age < 18) {
        return 'U18';
    } else {
        return 'Adultes';
    }
}


/**
 * Converts a time string to minutes.
 * @param {string} timeString - The time string in the format "HH:MM".
 * @returns {number} The total number of minutes.
 */
function timeStringToMinutes(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);

    return hours * 60 + minutes;
}


/**
 * Calculates the duration of an event in minutes.
 * @param {string} startTime - The start time of the event in the format "HH:MM".
 * @param {string} endTimeString - The duration of the event in the format "HH:MM".
 * @returns {number} The duration of the event in minutes.
 */
function calculateDurationInMinutes(startTimeString, endTimeString) {
    const startTimeInMinutes = timeStringToMinutes(startTimeString);
    const endTimeInMinutes = timeStringToMinutes(endTimeString);

    return endTimeInMinutes - startTimeInMinutes;
}


/**
 * Converts minutes to a time string representation.
 * @param {number} minutes - The number of minutes.
 * @returns {string} The time string representation.
 */
function minutesToTimeString(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}`;
    }
}


/**
 * Mapping of day names to their corresponding index.
 * @type {Object.<string, number>}
 */
const dayNameToIndex = {
    "Dimanche": 0,
    "Lundi": 1,
    "Mardi": 2,
    "Mercredi": 3,
    "Jeudi": 4,
    "Vendredi": 5,
    "Samedi": 6
};


/**
 * Represents the current date.
 * @type {Date}
 */
const currentDate = new Date();


/**
 * Represents the index of the current day.
 * @type {number}
 */
const currentDayIndex = currentDate.getDay();


/**
 * Creates an event object based on the given seance information.
 * @param {number} idSeance - The ID of the seance.
 * @param {object} instance - An object containing information about the seance.
 * @returns {object} - An event object with properties including the seance ID, title, start time, end time, all-day status, and extended properties.
 */
function createEvent(idSeance, instance) {  // skipcq: JS-0128
    const desiredDayIndex = dayNameToIndex[instance.jour];
    let daysDifference = desiredDayIndex - currentDayIndex;
    const originalDaysDifference = Math.abs(daysDifference);
    let desiredDate = new Date(currentDate);
    
    if (desiredDayIndex === currentDayIndex) {
        // do nothing
    } else if (currentDayIndex === 0) {
        daysDifference -= 7;
    } else if (originalDaysDifference === 6) {
        daysDifference += 7;
    } else if (desiredDayIndex === 0 && daysDifference < 0) {
        daysDifference += 7;
    }

    desiredDate.setDate(currentDate.getDate() + daysDifference);
    const formattedDate = desiredDate.toISOString().slice(0, 10);

    let event = {
        id: idSeance,
        title: instance.typeSeance,
        start: instance.heureSeance,
        end: instance.dureeSeance,
        allDay: false,
        extendedProps: {
            nbPlaces: instance.nbPlaces,
            nbPlacesRestantes: instance.nbPlacesRestantes,
            professeur: instance.professeur,
            dureeSeance: instance.dureeSeance,
            jourSeance: instance.jour,
        },
    };
    if (instance.niveau !== '') {
        event.title += ` - ${instance.niveau}`;
    }
    if (instance.nbPlacesRestantes > 0) {
        event.backgroundColor = '#44475A';
        event.textColor = '#F8F8F2';
    } else {
        event.backgroundColor = '#FF5555';
        event.textColor = '#282A36';
    }
    event.start = `${formattedDate}T${event.start}`;
    event.end = `${formattedDate}T${event.end}`;

    return event;
}


/**
 * Triggers when a user clicks on an event.
 * Updates the event details displayed on the webpage and changes the background color of the selected event.
 * 
 * @param {object} info - Contains information about the clicked event, such as title, start time, and extended properties.
 * @param {object} document - Represents the HTML document and is used to manipulate the webpage elements.
 * @param {string} selectedEventId - The ID of the previously selected event.
 * @param {object} calendar - The calendar object.
 * @returns {void} - Performs actions on the webpage elements and does not return any value.
 */
function eventClick(info, document, selectedEventId, calendar) {  // skipcq: JS-0128
    if (info.event.extendedProps.nbPlacesRestantes <= 0) {
        return;
    }
    document.getElementById("eventDetails").innerText = `${info.event.title}, ${info.event.extendedProps.jourSeance}, ${info.event.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}, Durée: ${minutesToTimeString(calculateDurationInMinutes(info.event.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), info.event.extendedProps.dureeSeance))}, Places: ${info.event.extendedProps.nbPlaces}, Restantes: ${info.event.extendedProps.nbPlacesRestantes}`;

    if (selectedEventId) {
        let oldEvent = calendar.getEventById(selectedEventId);
        if (oldEvent) {
            oldEvent.setProp('backgroundColor', '#44475A');
            oldEvent.setProp('textColor', '#F8F8F2');
        }
    }
    info.event.setProp('backgroundColor', '#50FA7B');
    info.event.setProp('textColor', '#282A36');
    selectedEventId = info.event.id;
    document.getElementById("selectedEventId").value = selectedEventId;
    document.getElementById("eventForm").style.display = "";
}


/**
 * Triggered when the mouse enters an event element on a webpage.
 * Checks if there are any remaining places for the event and changes the cursor style accordingly.
 * Creates a tooltip element and positions it next to the mouse cursor if there are remaining places.
 * The tooltip displays information about the event, including its title, date, start time, duration, and the number of places remaining.
 * When the mouse leaves the event element, the tooltip is removed.
 * 
 * @param {object} info - Information about the event and the mouse event.
 * @param {object} document - The document object of the webpage.
 * @returns {void} - Performs actions on the webpage elements and does not return any value.
 */
function eventMouseEnter(info, document) {  // skipcq: JS-0128
    if (info.event.extendedProps.nbPlacesRestantes > 0) {
        info.el.style.cursor = "pointer";
    } else {
        return;
    }
    let tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.top = `${info.jsEvent.pageY}px`;
    tooltip.style.left = `${info.jsEvent.pageX}px`;
    tooltip.style.backgroundColor = "#282A36";
    tooltip.style.color = "#F8F8F2";
    tooltip.style.padding = "5px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.zIndex = "1000";
    tooltip.innerText = `${info.event.title}, ${info.event.extendedProps.jourSeance}, ${info.event.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}, Durée: ${minutesToTimeString(calculateDurationInMinutes(info.event.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), info.event.extendedProps.dureeSeance))}, Places: ${info.event.extendedProps.nbPlaces}, Restantes: ${info.event.extendedProps.nbPlacesRestantes}`;
    document.body.appendChild(tooltip);
    info.el.addEventListener("mouseleave", () => {
        try {
            if (tooltip && tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        } catch (e) {
            console.error(e);
        }
    });
}


/**
 * Checks if all events in the calendar are full.
 * @param {Object} calendar - The calendar object.
 * @param {Object} document - The document object.
 * @returns {void} - Performs actions on the webpage elements and does not return any value.
 */
function checkAllEventsFull(calendar, document) {  // skipcq: JS-0128
    let allFull = true;
    calendar.getEvents().forEach(event => {
        if (event.extendedProps.nbPlacesRestantes > 0) {
            allFull = false;
        }
    });

    if (allFull) {
        document.getElementById("waitlistForm").style.display = "";
    }
}
