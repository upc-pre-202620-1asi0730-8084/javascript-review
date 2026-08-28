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

    const order = new PurchaseOrder({
        supplierId: supplier.id,
        currency: new Currency('USD'),
        orderDate: new DateTime(new Date('2025-04-10T10:00:00'))
    });

    order.addItem({
        productId: ProductId.generate(),
        quantity: 5,
        unitPrice: 45.99
    });

    order.addItem({
        productId: ProductId.generate(),
        quantity: 10,
        unitPrice: 22.99
    });

    const totalPrice = order.calculateTotalPrice();
    console.log(`Purchase Order placed on ${order.orderDate.toString()}`);
    console.log(`Total Price: ${totalPrice.toString()}`);
    console.log(`Order State: ${order.state}`);
    
    // Improved: Using recordOrder domain method instead of direct assignment
    supplier.recordOrder(totalPrice);
    console.log(`Supplier ${supplier.name} (ID: ${supplier.id.value}) has a last order total of ${supplier.lastOrderTotalPrice.toString()}.`);

    // Demonstrating new domain methods
    console.log("\nUpdating supplier info...");
    supplier.changeName("Acme Global Corp");
    supplier.updateEmail("info@acmeglobal.com");
    console.log(`Updated Supplier: ${supplier.name} <${supplier.contactEmail}>`);

    console.log("\nTransitioning state to Submitted...");
    order.submit();

    // Attempt to add an item after submission
    order.addItem({
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
    const order = new PurchaseOrder({
        supplierId: SupplierId.generate(),
        currency: new Currency('USD')
    });
    order.addItem({ productId: new ProductId("invalid-uuid"), quantity: 1, unitPrice: 10 }); // Invalid productId
} catch (error) {
    console.error(`Error: ${error.message}`);
}

try {
    const order = new PurchaseOrder({
        supplierId: SupplierId.generate(),
        currency: new Currency('USD')
    });
    order.addItem({ productId: ProductId.generate(), quantity: 1, unitPrice: -5 }); // Negative unit price
} catch (error) {
    console.error(`Error: ${error.message}`);
}

try {
    const order = new PurchaseOrder({
        supplierId: SupplierId.generate(),
        currency: new Currency('USD')
    });
    order.approve(); // Invalid transition
} catch (error) {
    console.error(`Error: ${error.message}`);
}