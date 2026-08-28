import { generateUuid, validateUuid } from './uuid.js';
import { ValidationError } from './errors.js';

/**
 * Value object representing a unique purchase order identifier.
 */
export class PurchaseOrderId {
    #value;

    /**
     * Creates a new PurchaseOrderId.
     * @param {string} value - The UUID value.
     * @throws {ValidationError} If the value is not a valid UUID.
     */
    constructor(value) {
        if (!validateUuid(value)) {
            throw new ValidationError(`Invalid PurchaseOrderId: ${value}. Must be a valid UUID`);
        }
        this.#value = value;
        Object.freeze(this);
    }

    /**
     * Generates a new PurchaseOrderId with a random UUID.
     * @returns {PurchaseOrderId} A new PurchaseOrderId instance.
     */
    static generate() {
        return new PurchaseOrderId(generateUuid());
    }

    /**
     * Gets the UUID value.
     * @returns {string} The UUID.
     */
    get value() {
        return this.#value;
    }

    /**
     * Checks if this PurchaseOrderId equals another.
     * @param {PurchaseOrderId} other - The other PurchaseOrderId to compare.
     * @returns {boolean} True if equal, false otherwise.
     */
    equals(other) {
        return other instanceof PurchaseOrderId && this.#value === other.value;
    }

    toString() {
        return this.#value;
    }
}
