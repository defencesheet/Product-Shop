# Authentication & Product CRUD

A complete e-commerce REST API and React frontend implementing:

- JWT access + refresh token authentication
- Register, login, refresh-token, logout and me APIs
- Password hashing with bcrypt
- Refresh-token hashing and server-side revocation
- httpOnly refresh-token cookie
- Protected product write routes
- Product CRUD APIs
- express-validator validation with field-level 400 errors
- React frontend for authentication and product CRUD

## Tech Stack

Backend:
- Node.js
- Express
- MongoDB / Mongoose
- JWT
- bcryptjs
- express-validator
- cookie-parser
- CORS

Frontend:
- React
- Vite
- Fetch API
- CSS

## Project Structure

```text
sheryians-auth-product-crud/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 1. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

## 2. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Authentication APIs

### Register

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Ram",
  "email": "Ram12@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```
### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "Ram12@example.com",
  "password": "Password123"
}
```

Returns an access token in JSON and sets the refresh token as an httpOnly cookie.

### Refresh Access Token

```http
POST /api/auth/refresh-token
```

The browser automatically sends the refresh-token cookie.

### Logout

```http
POST /api/auth/logout
Authorization: Bearer ACCESS_TOKEN
```

The stored refresh-token hash is removed and the cookie is cleared.

### Current User

```http
GET /api/auth/me
Authorization: Bearer ACCESS_TOKEN
```

## Product APIs

### Create

```http
POST /api/products
Authorization: Bearer ACCESS_TOKEN
```

Body:

```json
{
  "name": "Wireless Headphones",
  "description": "Noise cancelling wireless headphones",
  "price": 2499,
  "stock": 25,
  "category": "Electronics",
  "image": "https://example.com/headphones.jpg"
}
```

### List

```http
GET /api/products?page=1&limit=10
```

### Single Product

```http
GET /api/products/:id
```

### Update

```http
PUT /api/products/:id
Authorization: Bearer ACCESS_TOKEN
```

### Delete

```http
DELETE /api/products/:id
Authorization: Bearer ACCESS_TOKEN
```

## Validation

All body, route parameter and query input is validated before controller logic.

Examples:
- invalid email -> 400
- weak password -> 400
- mismatched confirmPassword -> 400
- negative price -> 400
- negative stock -> 400
- invalid product ID -> 400
- invalid pagination -> 400

Validation responses use field-level errors:

```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Enter a valid email",
    "password": "Password must be at least 8 characters"
  }
}
```

## Security Decisions

1. Passwords are hashed with bcrypt using 12 salt rounds.
2. Password is never returned in API responses.
3. Password is never logged.
4. Access tokens expire after 15 minutes.
5. Refresh tokens expire after 7 days.
6. Refresh tokens are stored as bcrypt hashes in MongoDB.
7. Refresh token is sent through an httpOnly cookie.
8. Logout removes the stored refresh-token hash.
9. Protected routes require a Bearer access token.
10. Product IDs are validated before database queries.
11. Duplicate emails return HTTP 409.
12. Wrong login credentials return a generic HTTP 401 message.

