/**
 * Converts a date string from 'DD MMMM YYYY' format to 'YYYY-MM-DD' format.
 * 
 * @param {string} dateString - The date string in 'DD MMMM YYYY' format.
 * @returns {string} The date string in 'YYYY-MM-DD' format.
 */
function convertDateFormat(dateString) {
    const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    let parts = dateString.split(' ');

    if (parts.length !== 3) {
        throw new Error('Invalid date format');
    }

    let day = parts[0];
    let month = monthNames.indexOf(parts[1].toLowerCase()) + 1;
    let year = parts[2];

    if (month < 10) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${year}-${month}-${day}`;
}

/**
 * Determines the category based on the age calculated from the birth date.
 * 
 * @param {string} birthDate - The birth date of a person in the format 'YYYY-MM-DD'.
 * @returns {string} The category based on the calculated age.
 *
 * @example
 * const category = determineCategory('2008-08-15');
 * console.log(category); // Output: 'U16'
 */
function determineCategory(birthDate) {
    const currentYear = new Date().getFullYear();
    var birthYear = parseInt(birthDate.split("-")[0]);
    var age = currentYear - birthYear;

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
