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
