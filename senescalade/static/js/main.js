/**
 * Converts a date string from 'DD MMMM YYYY' format to 'YYYY-MM-DD' format.
 * 
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
 * 
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

function timeStringToMinutes(timeString) {
    let [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
}

function calculateDurationInMinutes(startTimeString, endTimeString) {
    let startTimeInMinutes = timeStringToMinutes(startTimeString);
    let endTimeInMinutes = timeStringToMinutes(endTimeString);

    return endTimeInMinutes - startTimeInMinutes;
}

function minutesToTimeString(minutes) {
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}`;
    }
}

const dayNameToIndex = {
    "Dimanche": 0,
    "Lundi": 1,
    "Mardi": 2,
    "Mercredi": 3,
    "Jeudi": 4,
    "Vendredi": 5,
    "Samedi": 6
};
const currentDate = new Date();
const currentDayIndex = currentDate.getDay();

function createEvent(idSeance, instance) {
    var desiredDayIndex = dayNameToIndex[instance.jour];
    var daysDifference = desiredDayIndex - currentDayIndex;
    var originalDaysDifference = Math.abs(daysDifference);
    var desiredDate = new Date(currentDate);
    
    if (desiredDayIndex == currentDayIndex) {
        // do nothing
    } else if (currentDayIndex == 0) {
        daysDifference -= 7;
    } else if (originalDaysDifference == 6) {
        daysDifference += 7;
    } else if (desiredDayIndex == 0 && daysDifference < 0) {
        daysDifference += 7;
    }

    desiredDate.setDate(currentDate.getDate() + daysDifference);
    var formattedDate = desiredDate.toISOString().slice(0, 10);

    var event = {
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
        },
    };
    if (instance.niveau != '') {
        event.title += ' - ' + instance.niveau;
    }
    if (instance.nbPlacesRestantes > 0) {
        event.backgroundColor = '#44475A';
        event.textColor = '#F8F8F2';
    } else {
        event.backgroundColor = '#FF5555';
        event.textColor = '#282A36';
    }
    event.start = formattedDate + 'T' + event.start;
    event.end = formattedDate + 'T' + event.end;

    return event;
}

function eventClick(info, document) {
    if (info.event.extendedProps.nbPlacesRestantes <= 0) {
        return;
    }
    document.getElementById("eventDetails").innerText = 
        info.event.title + ", " +
        info.event.extendedProps.jourSeance + ", " +
        info.event.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) + ", " +
        "Durée: " + minutesToTimeString(calculateDurationInMinutes(info.event.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), info.event.extendedProps.dureeSeance)) + ", " +
        "Places: " + info.event.extendedProps.nbPlaces + ", " +
        "Restantes: " + info.event.extendedProps.nbPlacesRestantes;
    if (selectedEventId) {
        var oldEvent = calendar.getEventById(selectedEventId);
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

function eventMouseEnter(info, document) {
    if (info.event.extendedProps.nbPlacesRestantes > 0) {
        info.el.style.cursor = "pointer";
    } else {
        return;
    }
    var tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.top = info.jsEvent.pageY + "px";
    tooltip.style.left = info.jsEvent.pageX + "px";
    tooltip.style.backgroundColor = "#282A36";
    tooltip.style.color = "#F8F8F2";
    tooltip.style.padding = "5px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.zIndex = "1000";
    tooltip.innerText = 
        info.event.title + ", " +
        info.event.extendedProps.jourSeance + ", " +
        info.event.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) + ", " +
        "Durée: " + minutesToTimeString(calculateDurationInMinutes(info.event.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), info.event.extendedProps.dureeSeance)) + ", " +
        "Places: " + info.event.extendedProps.nbPlaces + ", " +
        "Restantes: " + info.event.extendedProps.nbPlacesRestantes;
    document.body.appendChild(tooltip);
    info.el.addEventListener("mouseleave", function() {
        try {
            if (tooltip && tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        } catch (e) {
            console.error(e);
        }
    });
}

function checkAllEventsFull() {
    var allFull = true;
    calendar.getEvents().forEach(function(event) {
        if (event.extendedProps.nbPlacesRestantes > 0) {
            allFull = false;
        }
    });

    if (allFull) {
        document.getElementById("waitlistForm").style.display = "";
    }
}
