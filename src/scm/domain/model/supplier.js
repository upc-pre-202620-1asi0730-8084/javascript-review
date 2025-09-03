import { SupplierId } from '../../../shared/domain/model/supplier-id.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';
import {Money} from "../../../shared/domain/model/money.js";

/**
 * @class Supplier
 * Entity representing a supplier in the supply chain management context.
 * @property {SupplierId} id - The unique identifier for the supplier.
 * @property {string} name - The name of the supplier.
 * @property {string|null} contactEmail - The contact email of the supplier (optional).
 * @property {Money|null} lastOrderTotalPrice - The total price of the last order from this supplier (optional).
 */
export class Supplier {
    #id;
    #name;
    #contactEmail;
    #lastOrderTotalPrice;
    /**
     * Creates a new Supplier.
     * @constructor
     * @param {Object} params - The parameters.
     * @param {SupplierId} params.id - The supplier ID.
     * @param {string} params.name - The supplier name.
     * @param {string|null} [params.contactEmail] - The contact email (optional).
     * @param {Money|null} [params.lastOrderTotalPrice] - The last order total price (optional).
     * @throws {ValidationError} If parameters are invalid.
     */
    constructor({ id, name, contactEmail = null, lastOrderTotalPrice = null }) {
        if (!(id instanceof SupplierId)) {
            throw new ValidationError("Supplier ID must be a valid SupplierId object");
        }
        if (typeof name !== 'string' || name.length < 2 || name.length > 100) {
            throw new ValidationError("Supplier name must be between 2 and 100 characters");
        }
        if (contactEmail !== null && !this.#isValidEmail(contactEmail)) {
            throw new ValidationError("Contact email must be a valid email address or null");
        }
        if (lastOrderTotalPrice !== null && !(lastOrderTotalPrice instanceof Money)) {
            throw new ValidationError("Last order total price must be a Money object or null");
        }

        this.#id = id;
        this.#name = name;
        this.#contactEmail = contactEmail;
        this.#lastOrderTotalPrice = lastOrderTotalPrice;
    }

    /**
     * @private
     * Validates an email address.
     *
     * @param {string} email - The email to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    #isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * @public
     * Gets the supplier ID.
     *
     * @returns {SupplierId} The supplier ID.
     */
    get id() {
        return this.#id;
    }

    /**
     * Gets the supplier name.
     * @public
     * @returns {string} The name.
     */
    get name() {
        return this.#name;
    }

    /**
     * @public
     * Gets the contact email.
     * @returns {string|null} The contact email or null.
     */
    get contactEmail() {
        return this.#contactEmail;
    }

    /**
     * @public
     * Gets the last order total price.
     * @returns {Money|null} The last order total price or null.
     */
    get lastOrderTotalPrice() {
        return this.#lastOrderTotalPrice;
    }
}