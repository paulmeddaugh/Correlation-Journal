import { checkIfString } from './errorHandling.js';
import { useState, useEffect, useRef } from 'react';

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

/**
 * Binary searches through an array of objects with 'id' properties for the a specified 'id.'
 * O(log n) time complexity.
 * 
 * @param {Array} arr The array of objects with 'id' properties.
 * @param {Number} id The id property value sought for in the array.
 * @returns An array containing the object with the 'id' value as first index and the index for 
 * the object in the array as second if found. Otherwise, returns an empty array.
 */
export function binarySort(arr, id) {

    let low = 1, high = arr.length - 1;
    let mid = 0|(low + (high - low) / 2);
    let found = false;

    while (high >= low) {
        if (id > arr[mid].id) { // Greater than mid
            low = mid + 1;
            mid = 0|(low + (high - low) / 2);
        } else if (id < arr[mid].id) { // Less than mid
            high = mid - 1;
            mid = 0|(low + (high - low) / 2);
        } else { // Found
            found = true;
            high = low - 1;
        }
    }

    return (found) ? [arr[mid], mid] : [];
}

/**
 * Customizes the React useState() hook to only require properties to be updated in an object state as
 * the parameters in the returned seting state function. 
 * 
 * @param {*} initState The value to initialize the state to.
 * @returns An array with the state variable as the first index and a function for updating the state
 * as the second index.
 */
export const useUpdateState = (initState) => {
    const [ state, setState ] = useState(initState)
    
    const setMergeState = (value) => {
      setState((prevValue) => {
        const newValue = typeof value === 'function' ? value(prevValue) : value
        return newValue ? { ...prevValue, ...newValue } : prevValue
      })
    }
    
    return [ state, setMergeState ];
};

/**
 * A custom React hook that utilizes the useEffect return callback, but attaches a ref to the 
 * function to not have stale state values when the callback is invoked.
 * 
 * @param {function} callback A function to invoke when dependencies are unmounted.
 * @param {Array} dependecies The array for dependencies that trigger the hook, though not the 
 * only values that are not stale.
 */
export const useUnmount = (callback, dependecies = []) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    
    useEffect(() => {
        return () => {
            callbackRef.current()
        }
    }, dependecies);
}