# 📊 Database Schema (ERD)

This document describes the core entities, their fields, and relationships used in the E-Commerce Backend API.
The system uses **MongoDB**, so relationships are represented via document references.

---

## User

**Collection:** `users`

| Field | Type | Description |
|------|-----|-------------|
| `_id` | ObjectId | Primary identifier |
| `email` | String | Unique user email |
| `password` | String | Hashed password |
| `role` | String | `admin` or `customer` |
| `createdAt` | Date | Record creation time |
| `updatedAt` | Date | Last update time |

---

##  Product

**Collection:** `products`

| Field | Type | Description |
|------|-----|-------------|
| `_id` | ObjectId | Primary identifier |
| `name` | String | Product name |
| `description` | String | Product details |
| `price` | Number | Product price |
| `stockQuantity` | Number | Available inventory |
| `categoryId` | String | Category identifier |
| `createdAt` | Date | Record creation time |
| `updatedAt` | Date | Last update time |

**Indexes:**
- `price`
- `categoryId`

---

## Cart

**Collection:** `carts`

| Field | Type | Description |
|------|-----|-------------|
| `_id` | ObjectId | Primary identifier |
| `userId` | ObjectId | Reference to User |
| `items` | Array | List of cart items |
| `createdAt` | Date | Record creation time |
| `updatedAt` | Date | Last update time |

### Cart Item (Embedded Document)

| Field | Type | Description |
|------|-----|-------------|
| `productId` | ObjectId | Reference to Product |
| `quantity` | Number | Quantity added |
| `priceAtAddTime` | Number | Price snapshot |

---

## Order

**Collection:** `orders`

| Field | Type | Description |
|------|-----|-------------|
| `_id` | ObjectId | Primary identifier |
| `userId` | ObjectId | Reference to User |
| `items` | Array | Ordered items |
| `totalAmount` | Number | Final order total |
| `status` | String | `PLACED` / `CANCELLED` |
| `createdAt` | Date | Order creation time |
| `updatedAt` | Date | Last update time |

### Order Item (Embedded Document)

| Field | Type | Description |
|------|-----|-------------|
| `productId` | ObjectId | Reference to Product |
| `quantity` | Number | Quantity ordered |
| `price` | Number | Price at order time |

---

## Entity Relationships

- **User 1 — 1 Cart**
- **User 1 — N Orders**
- **Product 1 — N Cart Items**
- **Product 1 — N Order Items**

---

## Design Notes

- Embedded documents are used for cart and order items to ensure consistency.
- Prices are captured at cart and order time.
- MongoDB transactions ensure atomic order placement.
