# E-Commerce Backend API

A simple, scalable e-commerce backend built with **Node.js, Express, MongoDB**, and **JWT-based authentication**.  
This project demonstrates clean architecture, role-based access control, and real-world backend workflows such as carts and orders.

---

##  Features

- User authentication with JWT
- Role-based access control (`admin`, `customer`)
- Product management (admin only)
- Product listing with pagination & filters
- Shopping cart management
- Order placement with stock consistency
- MongoDB transactions for atomic operations
- Clean layered architecture (routes → controllers → services → repositories)
- Interactive API documentation using Swagger (OpenAPI)

---

##  Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing

---

## Project Structure

```
src/
├── app.js
├── server.js
├── config/
│   └── db.js
├── controllers/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
```

### Architecture Overview

- **Routes** – HTTP layer & middleware binding  
- **Controllers** – Request/response handling  
- **Services** – Business logic  
- **Repositories** – Database access abstraction  
- **Models** – Mongoose schemas  
- **Middlewares** – Auth, roles, error handling  

This separation keeps the codebase maintainable and testable.

---

## Authentication & Authorization

- Authentication is handled via **JWT tokens**
- Token must be sent using:
  ```
  Authorization: Bearer <token>
  ```
- Role-based authorization is enforced at route level

### Supported Roles
- `admin` – manage products
- `customer` – manage cart and orders

---

##  Cart Design Note

Although the requirement mentions "session-based cart", the cart is implemented as **user-scoped persistent storage** rather than server memory sessions.

### Why?
- Keeps backend **stateless**
- Works with horizontal scaling / serverless environments
- Avoids session-store complexity
- Cart is still temporary and cleared after order placement

This aligns with modern cloud-native backend practices.

---

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |

---

### Products
| Method | Endpoint | Access |
|------|---------|--------|
| POST | `/products` | Admin |
| PUT | `/products/:id` | Admin |
| DELETE | `/products/:id` | Admin |
| GET | `/products` | Public |
| GET | `/products/:id` | Public |

Supports filtering:
```
/products?categoryId=electronics&minPrice=500&maxPrice=2000&page=1&limit=10
```

---

### Cart
| Method | Endpoint | Access |
|------|---------|--------|
| GET | `/cart` | Customer |
| POST | `/cart/items` | Customer |
| DELETE | `/cart/items/:productId` | Customer |

---

### Orders
| Method | Endpoint | Access |
|------|---------|--------|
| POST | `/orders` | Customer |
| GET | `/orders` | Customer |

Order placement:
- Validates stock
- Deducts inventory
- Clears cart
- Uses MongoDB transactions for consistency

---

##  Setup Instructions

### 1. Clone repository
```bash
git clone <repo-url>
cd ecommerce-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables

Create `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
```

An `.env.example` file is provided.

---

### 4. Start server
```bash
npm run dev
```

Server runs at:
```
http://localhost:3000
```
API Docs available at: 
``` 
http://localhost:3000/api-docs
```


---

##  Assumptions & Simplifications

- Payments are out of scope
- Product categories stored as strings
- One active cart per user
- Stock deducted only on order placement
- No order cancellation flow implemented

---

##  Possible Improvements

- Rate limiting
- Redis caching
- Soft deletes for products
- Order status lifecycle
- Payment integration

---

## NOTE:
```Due to time constraints, automated tests were not added. Given more time, I would add integration tests for auth, cart, and order flows using Jest and Supertest.
```

## Note: 
```MongoDB transactions require a replica set. 
In local development, the application falls back to non-transactional writes.
In production, a replica set is assumed.
```


##  API Examples

### 1️ Register User

**Request**
```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Response**
```json
{
  "message": "User registered successfully"
}
```

---

### 2️ Login User

**Request**
```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "token": "jwt_token_here"
}
```

---

### 3️ Create Product (Admin)

**Request**
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "name": "iPhone 15",
  "description": "Latest Apple smartphone",
  "price": 1200,
  "stockQuantity": 10,
  "categoryId": "electronics"
}
```

**Response**
```json
{
  "_id": "64f0...",
  "name": "iPhone 15",
  "price": 1200,
  "stockQuantity": 10
}
```

---

### 4️ List Products (Public)

**Request**
```http
GET /products?page=1&limit=10&categoryId=electronics
```

**Response**
```json
{
  "items": [
    {
      "_id": "64f0...",
      "name": "iPhone 15",
      "price": 1200
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

---

### 5️ Add Item to Cart (Customer)

**Request**
```http
POST /cart/items
Authorization: Bearer <customer_token>
Content-Type: application/json
```

```json
{
  "productId": "64f0...",
  "quantity": 2
}
```

**Response**
```json
{
  "items": [
    {
      "productId": "64f0...",
      "quantity": 2,
      "priceAtAddTime": 1200
    }
  ],
  "subtotal": 2400,
  "total": 2400
}
```

---

### Update Cart Item Quantity

Updates the quantity of a specific product in the user’s cart.

Setting the quantity to `0` will remove the item from the cart.

**Request**
```http
PUT /cart/items/:productId
Authorization: Bearer <customer_token>

```
```json
{
  "quantity": 3
}
```
**Response**
```json
{
  "_id": "65ff2c1e8d3f1a001234abcd",
  "userId": "65ff2bfa8d3f1a001234aaaa",
  "items": [
    {
      "productId": "65ff2a998d3f1a0012349999",
      "quantity": 3,
      "priceAtAddTime": 499
    }
  ],
  "updatedAt": "2026-01-19T18:45:12.321Z"
}

```

---
### 7 Place Order

**Request**
```http
POST /orders
Authorization: Bearer <customer_token>
```

**Response**
```json
{
  "_id": "650a...",
  "totalAmount": 2400,
  "status": "PLACED",
  "createdAt": "2025-01-01T10:00:00Z"
}
```

---

###  API Documentation
Interactive API documentation is available via Swagger:

```
http://localhost:3000/api-docs
```


## Author

**Shishupal Kumar**  
Backend Engineer (Node.js / MongoDB)
