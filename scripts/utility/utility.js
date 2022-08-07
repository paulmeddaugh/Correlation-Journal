import { checkIfString } from './errorHandling.js';

/**
 * Removes all HTML and non-SQL characters from a string.
 * 
 * @param {string} string The string to check and remove from.
 * @returns A string able to be queried.
 */
export function stringToSQL (string) {
    checkIfString({ string });
    return string.replace(/<[^>]*>/g, "").replace(/'/g, "''");
}

/**
 * Removes all added characters a string returned from an SQL query.
 * 
 * @param {string} string The string to reformat.
 * @returns The string before its insertion to the database.
 */
export function stringFromSQL (string) {
    checkIfString({ string });
    return string.replace(/''/g, "'");
}