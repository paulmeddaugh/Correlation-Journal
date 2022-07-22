import { checkIfString } from './errorHandling.js';

/**
 * Removes all HTML and non-SQL characters from a string.
 * 
 * @param {string} string The string to check and remove from.
 * @returns A string able to be queried.
 */
export function removeNonSQLCharacters (string) {
    checkIfString(string);
    return string.replace(/<[^>]*>/g, "").replace(/'/g, "''");
}