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
