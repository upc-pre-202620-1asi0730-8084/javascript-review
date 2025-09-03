import { generateUuid, validateUuid } from './uuid.js';
import { ValidationError } from './errors.js';

/**
 * Value object representing a unique product identifier.
 */
export class ProductId {
    #value;
    /**
     * Creates a new ProductId.
     * @param {string} value - The UUID value.
     * @throws {ValidationError} If the value is not a valid UUID.
     */
    constructor(value) {
        if (!validateUuid(value)) {
            throw new ValidationError(`Invalid ProductId: ${value}. Must be a valid UUID`);
        }
        this.#value = value;
    }

    /**
     * Generates a new ProductId with a random UUID.
     * @returns {ProductId} A new ProductId instance.
     */
    static generate() {
        return new ProductId(generateUuid());
    }

    /**
     * Gets the UUID value.
     * @returns {string} The UUID.
     */
    get value() {
        return this.#value;
    }

    /**
     * Checks if this ProductId equals another.
     * @param {ProductId} other - The other ProductId to compare.
     * @returns {boolean} True if equal, false otherwise.
     */
    equals(other) {
        return other instanceof ProductId && this.#value === other.value;
    }
}