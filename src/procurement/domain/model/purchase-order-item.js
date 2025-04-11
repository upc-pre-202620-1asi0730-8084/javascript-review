import { ProductId } from '../../../shared/domain/model/product-id.js';
import { Money } from '../../../shared/domain/model/money.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';

/**
 * Value object representing an item in a purchase order.
 */
export class PurchaseOrderItem {
    /**
     * Creates a new PurchaseOrderItem.
     * @param {Object} params - The parameters.
     * @param {string} params.orderId - The purchase order ID.
     * @param {string} params.productId - The product ID.
     * @param {number} params.quantity - The quantity ordered.
     * @param {Money} params.unitPrice - The unit price.
     * @throws {ValidationError} If parameters are invalid.
     */
    constructor({ orderId, productId, quantity, unitPrice }) {
        if (typeof orderId !== 'string' || !orderId) {
            throw new ValidationError("Order ID is required for PurchaseOrderItem");
        }
        if (!(productId instanceof ProductId)) {
            throw new ValidationError("ProductId must be a valid ProductId object");
        }
        if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 1000) {
            throw new ValidationError("Quantity must be a positive integer not exceeding 1000");
        }
        if (!(unitPrice instanceof Money)) {
            throw new ValidationError("Unit price must be a valid Money object");
        }

        this._orderId = orderId;
        this._productId = productId;
        this._quantity = quantity;
        this._unitPrice = unitPrice;
    }

    /**
     * Gets the product ID.
     * @returns {ProductId} The product ID.
     */
    get productId() {
        return this._productId;
    }

    /**
     * Gets the quantity.
     * @returns {number} The quantity.
     */
    get quantity() {
        return this._quantity;
    }

    /**
     * Gets the unit price.
     * @returns {Money} The unit price.
     */
    get unitPrice() {
        return this._unitPrice;
    }

    /**
     * Calculates the subtotal for this item (quantity * unit price).
     * @returns {Money} The subtotal.
     */
    calculateSubtotal() {
        return this._unitPrice.multiply(this._quantity);
    }
}