import { Supplier } from './scm/domain/model/supplier.js';
import { SupplierId } from './shared/domain/model/supplier-id.js';
import { ProductId } from './shared/domain/model/product-id.js';
import { PurchaseOrder } from './procurement/domain/model/purchase-order.js';
import { Currency } from './shared/domain/model/currency.js';
import { DateTime } from './shared/domain/model/date-time.js';

console.log("JavaScript Review Application - Supply Chain and Procurement Showcase");

try {
    const supplier = new Supplier({
        id: SupplierId.generate(),
        name: "Acme Corp",
        contactEmail: "contact@acme.com"
    });

    const po = new PurchaseOrder({
        supplierId: supplier.id,
        currency: new Currency('USD'),
        orderDate: new DateTime(new Date('2025-04-10T10:00:00'))
    });

    po.addItem({
        productId: ProductId.generate(),
        quantity: 5,
        unitPrice: 45.99
    });

    po.addItem({
        productId: ProductId.generate(),
        quantity: 10,
        unitPrice: 22.99
    });

    const totalPrice = po.calculateTotalPrice();
    console.log(`Purchase Order placed on ${po.orderDate.toString()}`);
    console.log(`Total Price: ${totalPrice.toString()}`);
    console.log(`Order State: ${po.state}`);
    supplier._lastOrderTotalPrice = totalPrice; // Direct assignment for demo
    console.log(`Supplier ${supplier.name} (ID: ${supplier.id.value}) has a last order total of ${supplier.lastOrderTotalPrice.toString()}.`);

    console.log("\nTransitioning state to Submitted...");
    po.submit();

    // Attempt to add an item after submission
    po.addItem({
        productId: ProductId.generate(),
        quantity: 1,
        unitPrice: 10.00
    });
} catch (error) {
    console.error(`Error: ${error.message}`);
}

console.log("\nTesting invalid cases:");
try {
    new Supplier({ id: SupplierId.generate(), name: "A" }); // A name too short
} catch (error) {
    console.error(`Error: ${error.message}`);
}

try {
    const po = new PurchaseOrder({
        supplierId: SupplierId.generate(),
        currency: new Currency('USD')
    });
    po.addItem({ productId: "invalid-uuid", quantity: 1, unitPrice: 10 }); // Invalid productId
} catch (error) {
    console.error(`Error: ${error.message}`);
}

try {
    const po = new PurchaseOrder({
        supplierId: SupplierId.generate(),
        currency: new Currency('USD')
    });
    po.addItem({ productId: ProductId.generate(), quantity: 1, unitPrice: -5 }); // Negative unit price
} catch (error) {
    console.error(`Error: ${error.message}`);
}

try {
    const po = new PurchaseOrder({
        supplierId: SupplierId.generate(),
        currency: new Currency('USD')
    });
    po.approve(); // Invalid transition
} catch (error) {
    console.error(`Error: ${error.message}`);
}