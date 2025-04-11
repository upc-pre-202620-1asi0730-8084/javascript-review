# User Stories

## US001: Create a Supplier
As a procurement manager,  
I want to create a supplier with a name and optional contact email,  
So that I can track vendors in the supply chain system.

**Acceptance Criteria:**
- Supplier must have a unique ID (UUID).
- Name must be between 2 and 100 characters.
- Contact email, if provided, must be a valid email format.
- Last order total price is optional and initially null.

## US002: Record Last Order Total for Supplier
As a procurement manager,  
I want to record the total price of the last order for a supplier,  
So that I can analyze supplier performance and order history.

**Acceptance Criteria:**
- Last order total price must be a valid Money object or null.
- Currency must match the purchase order currency if set.

## US003: Create a Purchase Order
As a procurement manager,  
I want to create a purchase order with a supplier and currency,  
So that I can begin ordering products.

**Acceptance Criteria:**
- Purchase order must have a unique ID (UUID).
- Must specify a valid SupplierId.
- Must specify a valid Currency (USD, EUR, GBP, JPY).
- Order date defaults to current date/time if not provided.
- Initial state is Draft.

## US004: Add Items to Purchase Order
As a procurement manager,  
I want to add items to a purchase order,  
So that I can specify the products and quantities needed.

**Acceptance Criteria:**
- Can only add items when the purchase order is in Draft state.
- Product ID must be a valid UUID.
- Quantity must be a positive integer, max 1000.
- Unit price must be a non-negative number in the order's currency.
- Maximum of 50 items per purchase order.

## US005: Calculate Total Price
As a procurement manager,  
I want to calculate the total price of a purchase order,  
So that I can review costs before submission.

**Acceptance Criteria:**
- Total price is the sum of all item subtotals (quantity * unit price).
- Returns a Money object in the order's currency.
- Fails if the order has no items.

## US006: Cancel Purchase Order
As a procurement manager,  
I want to cancel a purchase order,  
So that I can stop an order if it’s no longer needed.

**Acceptance Criteria:**
- Can cancel from any state except Completed.
- State changes to Canceled.
- Fails if the order is already Completed.

## US007: Manage Purchase Order Lifecycle
As a procurement manager,  
I want to transition a purchase order through its lifecycle (Draft → Submitted → Approved → Shipped → Completed),  
So that I can track and manage the order process.

**Acceptance Criteria:**
- Draft to Submitted: Allowed only from Draft.
- Submitted to Approved: Allowed only from Submitted.
- Approved to Shipped: Allowed only from Approved.
- Shipped to Completed: Allowed only from Shipped.
- Each transition updates the state accordingly.
- Invalid transitions throw an error with a descriptive message.