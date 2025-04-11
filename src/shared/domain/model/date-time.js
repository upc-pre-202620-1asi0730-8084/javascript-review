import { ValidationError } from './errors.js';

/**
 * Value object representing a date and time with consistent handling.
 */
export class DateTime {
    /**
     * Creates a new DateTime instance.
     * @param {Date|string} [date=new Date()] - The date (defaults to now).
     * @throws {ValidationError} If the date is invalid.
     */
    constructor(date = new Date()) {
        const parsedDate = date instanceof Date ? date : new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new ValidationError(`Invalid date: ${date}`);
        }
        this._date = parsedDate;
    }

    /**
     * Gets the underlying Date object.
     * @returns {Date} The date.
     */
    get date() {
        return this._date;
    }

    /**
     * Returns the date in ISO string format.
     * @returns {string} The ISO string (e.g., '2023-10-25T14:30:00.000Z').
     */
    toISOString() {
        return this._date.toISOString();
    }

    /**
     * Returns a human-friendly string representation.
     * @returns {string} The formatted date (e.g., 'October 25, 2023, 2:30 PM').
     */
    toString() {
        return this._date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    /**
     * Checks if this DateTime equals another.
     * @param {DateTime} other - The other DateTime to compare.
     * @returns {boolean} True if equal, false otherwise.
     */
    equals(other) {
        return other instanceof DateTime && this._date.getTime() === other.date.getTime();
    }
}