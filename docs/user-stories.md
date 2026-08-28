# User Stories

## US001: Create a Supplier
As a procurement manager,  
I want to create a supplier with a name and optional contact email,  
So that I can track vendors in the supply chain system.

**Acceptance Criteria:**
- Given a name between 2 and 100 characters and a valid email, when a supplier is created, then the system assigns a unique UUID as its identifier.
- Given a new supplier, when it is initialized, then the last order total price is set to null.
- Given a name shorter than 2 characters or longer than 100 characters, when a supplier creation is attempted, then the system throws a validation error.
- Given an invalid email format, when a supplier creation is attempted, then the system throws a validation error.

## US002: Record Last Order Total for Supplier
As a procurement manager,  
I want to record the total price of the last order for a supplier,  
So that I can analyze supplier performance and order history.

**Acceptance Criteria:**
- Given a valid Money object, when the procurement manager records the last order total for a supplier, then the supplier's last order total price is updated.
- Given a null value, when the procurement manager records the last order total for a supplier, then the supplier's last order total price is cleared.
- Given a non-Money object that is not null, when a recording attempt occurs for the last order total, then the system throws a validation error.

## US003: Create a Purchase Order
As a procurement manager,  
I want to create a purchase order with a supplier and currency,  
So that I can begin ordering products.

**Acceptance Criteria:**
- Given a valid SupplierId and a supported Currency, when a purchase order is created, then the system assigns a unique UUID to the order.
- Given a new purchase order, when it is initialized, then its state is set to Draft and the order date defaults to the current date/time.
- Given an unsupported currency, when a purchase order creation is attempted, then the system throws a validation error.

## US004: Add Items to Purchase Order
As a procurement manager,  
I want to add items to a purchase order,  
So that I can specify the products and quantities needed.

**Acceptance Criteria:**
- Given a purchase order in Draft state, when an item with a valid ProductId, positive quantity (max 1000), and non-negative unit price is added, then the item is included in the order.
- Given a purchase order not in Draft state, when an attempt to add an item is made, then the system throws an error.
- Given a quantity greater than 1000 or a negative unit price, when an item is added, then the system throws a validation error.
- Given a purchase order that already contains 50 items, when another item is added, then the system throws an error.

## US005: Calculate Total Price
As a procurement manager,  
I want to calculate the total price of a purchase order,  
So that I can review costs before submission.

**Acceptance Criteria:**
- Given a purchase order with multiple items, when the total price is calculated, then it returns a Money object representing the sum of all item subtotals (quantity * unit price).
- Given a purchase order with no items, when the total price is calculated, then the system throws an error.
- Given a calculation request, when the total price is returned, then the currency of the Money object matches the order's currency.

## US006: Cancel Purchase Order
As a procurement manager,  
I want to cancel a purchase order,  
So that I can stop an order if it’s no longer needed.

**Acceptance Criteria:**
- Given a purchase order in any state except Completed, when the procurement manager cancels the order, then the state changes to Canceled state.
- Given a purchase order is in the Completed state, when a cancellation is attempted, then the system throws an error.
- Given a canceled purchase order, when further state transitions are attempted, then the system throws an error.

## US007: Manage the Purchase Order Lifecycle
As a procurement manager,  
I want to transition a purchase order through its lifecycle (Draft → Submitted → Approved → Shipped → Completed),  
So that I can track and manage the order process.

**Acceptance Criteria:**
- Given a purchase order, when it follows the sequence Draft → Submitted → Approved → Shipped → Completed, then each transition updates the state accordingly.
- Given a purchase order in a specific state, when an out-of-sequence transition is attempted (e.g., Draft to Approved), then the system throws a descriptive error.
- Given a state transition, when the transition is successful, then the order's state property reflects the new status.