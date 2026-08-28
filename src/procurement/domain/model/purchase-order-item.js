import { PurchaseOrderId } from '../../../shared/domain/model/purchase-order-id.js';
import { ProductId } from '../../../shared/domain/model/product-id.js';
import { Money } from '../../../shared/domain/model/money.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';

/**
 * Value object representing an item in a purchase order.
 */
export class PurchaseOrderItem {
    #orderId;
    #productId;
    #quantity;
    #unitPrice;
    /**
     * Creates a new PurchaseOrderItem.
     * @param {Object} params - The parameters.
     * @param {PurchaseOrderId} params.orderId - The purchase order ID.
     * @param {ProductId} params.productId - The product ID.
     * @param {number} params.quantity - The quantity ordered.
     * @param {Money} params.unitPrice - The unit price.
     * @throws {ValidationError} If parameters are invalid.
     */
    constructor({ orderId, productId, quantity, unitPrice }) {
        if (!(orderId instanceof PurchaseOrderId)) {
            throw new ValidationError("OrderId must be a valid PurchaseOrderId object");
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

        this.#orderId = orderId;
        this.#productId = productId;
        this.#quantity = quantity;
        this.#unitPrice = unitPrice;
        Object.freeze(this);
    }

    /**
     * Gets the purchase order ID.
     * @returns {PurchaseOrderId} The order ID.
     */
    get orderId() {
        return this.#orderId;
    }

    /**
     * Gets the product ID.
     * @returns {ProductId} The product ID.
     */
    get productId() {
        return this.#productId;
    }

    /**
     * Gets the quantity.
     * @returns {number} The quantity.
     */
    get quantity() {
        return this.#quantity;
    }

    /**
     * Gets the unit price.
     * @returns {Money} The unit price.
     */
    get unitPrice() {
        return this.#unitPrice;
    }

    /**
     * Calculates the subtotal for this item (quantity * unit price).
     * @returns {Money} The subtotal.
     */
    calculateSubtotal() {
        return this.#unitPrice.multiply(this.#quantity);
    }
}