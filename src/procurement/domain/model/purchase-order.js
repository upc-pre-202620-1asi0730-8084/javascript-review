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
        this._id = generateUuid();
        this._supplierId = supplierId;
        this._currency = currency;
        this._orderDate = orderDate instanceof DateTime ? orderDate : new DateTime();
        this._items = [];
        this._state = new PurchaseOrderState(); // Initial state: Draft
    }

    /**
     * Adds an item to the purchase order if conditions are met.
     *
     * **Business Rules**:
     * - **Draft State Only**: Items can only be added while the purchase order is in Draft state.
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
     * @throws {ValidationError} If state is not Draft, max items (50) is exceeded, or unit price is invalid (negative or non-finite).
     */
    addItem({ productId, quantity, unitPrice }) {
        if (!this._state.isDraft()) {
            throw new ValidationError("Items can only be added to a PurchaseOrder in Draft state");
        }
        if (this._items.length >= this.#MAX_ITEMS) {
            throw new ValidationError(`PurchaseOrder cannot have more than ${this.#MAX_ITEMS} items`);
        }
        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            throw new ValidationError("Unit price amount must be a non-negative number");
        }
        this._items.push(
            new PurchaseOrderItem({
                orderId: this._id,
                productId,
                quantity,
                unitPrice: new Money({ amount: unitPrice, currency: this._currency }),
            })
        );
    }

    /**
     * Calculates the total price of all items.
     * @returns {Money} The total price.
     * @throws {ValidationError} If the order is empty.
     */
    calculateTotalPrice() {
        if (this._items.length === 0) {
            throw new ValidationError("Cannot calculate total price for an empty purchase order");
        }
        return this._items
            .reduce((sum, item) => sum.add(item.calculateSubtotal()),
                new Money({ amount: 0, currency: this._currency })
            );
    }

    /**
     * Transitions the purchase order to Submitted state.
     * @throws {ValidationError} If not in Draft state.
     */
    submit() {
        this._state = this._state.toSubmittedFrom(this._state);
    }

    /**
     * Transitions the purchase order to Approved state.
     * @throws {ValidationError} If not in Submitted state.
     */
    approve() {
        this._state = this._state.toApprovedFrom(this._state);
    }

    /**
     * Transitions the purchase order to Shipped state.
     * @throws {ValidationError} If not in Approved state.
     */
    ship() {
        this._state = this._state.toShippedFrom(this._state);
    }

    /**
     * Transitions the purchase order to Completed state.
     * @throws {ValidationError} If not in Shipped state.
     */
    complete() {
        this._state = this._state.toCompletedFrom(this._state);
    }

    /**
     * Transitions the purchase order to Canceled state.
     * @throws {ValidationError} If in Completed state.
     */
    cancel() {
        this._state = this._state.toCanceledFrom(this._state);
    }

    /**
     * Gets the purchase order ID.
     * @returns {string} The order ID.
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the supplier ID.
     * @returns {SupplierId} The supplier ID.
     */
    get supplierId() {
        return this._supplierId;
    }

    /**
     * Gets the currency.
     * @returns {Currency} The currency.
     */
    get currency() {
        return this._currency;
    }

    /**
     * Gets the order date.
     * @returns {DateTime} The order date.
     */
    get orderDate() {
        return this._orderDate;
    }

    /**
     * Gets the list of items.
     * @returns {PurchaseOrderItem[]} The items.
     */
    get items() {
        return this._items;
    }

    /**
     * Gets the current state of the purchase order.
     * @returns {string} The state (e.g., 'Draft', 'Submitted', 'Approved', 'Shipped', 'Completed', 'Canceled').
     */
    get state() {
        return this._state.value;
    }
}