import { v7 as uuidv7, validate as uuidValidate } from 'uuid';

/**
 * Generates a new UUID v7.
 * @returns {string} A UUID string.
 */
export function generateUuid() {
    return uuidv7();
}

/**
 * Validates if a string is a valid UUID.
 * @param {string} value - The string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export function validateUuid(value) {
    return uuidValidate(value);
}