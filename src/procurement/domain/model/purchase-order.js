import { generateUuid } from '../../../shared/domain/model/uuid.js';
import { PurchaseOrderItem } from './purchase-order-item.js';
import { Money } from '../../../shared/domain/model/money.js';
import { DateTime } from '../../../shared/domain/model/date-time.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';
import { PurchaseOrderState } from './purchase-order-state.js';
import {Currency} from "../../../shared/domain/model/currency.js";

/**
 * Entity representing a purchase order with a lifecycle state.
 */
export class PurchaseOrder {
    
    /** @private */
    #MAX_ITEMS = 50;
    #id;
    #supplierId;
    #currency;
    #orderDate;
    #items;
    #state;

    /**
     * Creates a new PurchaseOrder.
     * @param {Object} params - The parameters.
     * @param {SupplierId} params.supplierId - The supplier ID.
     * @param {Currency} params.currency - The currency for the order.
     * @param {DateTime} [params.orderDate] - The order date (defaults to now).
     * @throws {ValidationError} If supplierId or currency is invalid.
     */
    constructor({ supplierId, currency, orderDate }) {
        if (!supplierId) {
            throw new ValidationError("SupplierId is required for PurchaseOrder");
        }
        if (!(currency instanceof Currency)) {
            throw new ValidationError("Currency must be a valid Currency object");
        }
        this.#id = generateUuid();
        this.#supplierId = supplierId;
        this.#currency = currency;
        this.#orderDate = orderDate instanceof DateTime ? orderDate : new DateTime();
        this.#items = [];
        this.#state = new PurchaseOrderState(); // Initial state: Draft
    }

    /**
     * Adds an item to the purchase order if conditions are met.
     *
     * **Business Rules**:
     * - **Draft State Only**: Items can only be added while the purchase order is in the Draft state.
     *   This ensures that modifications are restricted to the preparation phase, preventing changes
     *   after submission for approval or fulfillment to maintain order integrity and auditability.
     * - **Maximum Items Limit**: A purchase order cannot exceed 50 items. This constraint prevents
     *   overly complex orders that could complicate supplier fulfillment, inventory management,
     *   or financial reconciliation, keeping orders manageable within operational capacity.
     * - **Valid Unit Price**: The unit price must be a non-negative finite number. This ensures that
     *   all items have a realistic cost, avoiding negative or undefined prices that would disrupt
     *   financial calculations and supplier agreements.
     *
     * @param {Object} params - The item parameters.
     * @param {string} params.productId - The product ID.
     * @param {number} params.quantity - The quantity.
     * @param {number} params.unitPrice - The unit price amount.
     * @throws {ValidationError} If state is not Draft, max items (50) are exceeded, or unit price is invalid (negative or non-finite).
     */
    addItem({ productId, quantity, unitPrice }) {
        if (!this.#state.isDraft()) {
            throw new ValidationError("Items can only be added to a PurchaseOrder in Draft state");
        }
        if (this.#items.length >= this.#MAX_ITEMS) {
            throw new ValidationError(`PurchaseOrder cannot have more than ${this.#MAX_ITEMS} items`);
        }
        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            throw new ValidationError("Unit price amount must be a non-negative number");
        }
        this.#items.push(
            new PurchaseOrderItem({
                orderId: this.#id,
                productId,
                quantity,
                unitPrice: new Money({ amount: unitPrice, currency: this.#currency }),
            })
        );
    }

    /**
     * Calculates the total price of all items.
     * @returns {Money} The total price.
     * @throws {ValidationError} If the order is empty.
     */
    calculateTotalPrice() {
        if (this.#items.length === 0) {
            throw new ValidationError("Cannot calculate total price for an empty purchase order");
        }
        return this.#items
            .reduce((sum, item) => sum.add(item.calculateSubtotal()),
                new Money({ amount: 0, currency: this.#currency })
            );
    }

    /**
     * Transitions the purchase order to Submitted state.
     * @throws {ValidationError} If not in Draft state.
     */
    submit() {
        this.#state = this.#state.toSubmittedFrom(this.#state);
    }

    /**
     * Transitions the purchase order to Approved state.
     * @throws {ValidationError} If not in Submitted state.
     */
    approve() {
        this.#state = this.#state.toApprovedFrom(this.#state);
    }

    /**
     * Transitions the purchase order to Shipped state.
     * @throws {ValidationError} If not in Approved state.
     */
    ship() {
        this.#state = this.#state.toShippedFrom(this.#state);
    }

    /**
     * Transitions the purchase order to Completed state.
     * @throws {ValidationError} If not in Shipped state.
     */
    complete() {
        this.#state = this.#state.toCompletedFrom(this.#state);
    }

    /**
     * Transitions the purchase order to Canceled state.
     * @throws {ValidationError} If in Completed state.
     */
    cancel() {
        this.#state = this.#state.toCanceledFrom(this.#state);
    }

    /**
     * Gets the purchase order ID.
     * @returns {string} The order ID.
     */
    get id() {
        return this.#id;
    }

    /**
     * Gets the supplier ID.
     * @returns {SupplierId} The supplier ID.
     */
    get supplierId() {
        return this.#supplierId;
    }

    /**
     * Gets the currency.
     * @returns {Currency} The currency.
     */
    get currency() {
        return this.#currency;
    }

    /**
     * Gets the order date.
     * @returns {DateTime} The order date.
     */
    get orderDate() {
        return this.#orderDate;
    }

    /**
     * Gets the list of items.
     * @returns {PurchaseOrderItem[]} The items.
     */
    get items() {
        return this.#items;
    }

    /**
     * Gets the current state of the purchase order.
     * @returns {string} The state (e.g., 'Draft', 'Submitted', 'Approved', 'Shipped', 'Completed', 'Canceled').
     */
    get state() {
        return this.#state.value;
    }
}