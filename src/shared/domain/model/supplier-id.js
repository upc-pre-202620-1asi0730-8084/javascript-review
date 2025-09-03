import { generateUuid, validateUuid } from './uuid.js';
import { ValidationError } from './errors.js';

/**
 * Value object representing a unique supplier identifier.
 */
export class SupplierId {
    #value;
    /**
     * Creates a new SupplierId.
     * @param {string} value - The UUID value.
     * @throws {ValidationError} If the value is not a valid UUID.
     */
    constructor(value) {
        if (!validateUuid(value)) {
            throw new ValidationError(`Invalid SupplierId: ${value}. Must be a valid UUID`);
        }
        this.#value = value;
    }

    /**
     * Generates a new SupplierId with a random UUID.
     * @returns {SupplierId} A new SupplierId instance.
     */
    static generate() {
        return new SupplierId(generateUuid());
    }

    /**
     * Gets the UUID value.
     * @returns {string} The UUID.
     */
    get value() {
        return this.#value;
    }

    /**
     * Checks if this SupplierId equals another.
     * @param {SupplierId} other - The other SupplierId to compare.
     * @returns {boolean} True if equal, false otherwise.
     */
    equals(other) {
        return other instanceof SupplierId && this.#value === other.value;
    }
}