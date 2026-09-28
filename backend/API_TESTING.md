# Quick API Testing Checklist

Use Postman or Thunder Client.

## Register

POST http://localhost:5000/api/auth/register

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

Expected: 201.

## Duplicate Register

Send the same request again.

Expected: 409.

## Login

POST http://localhost:5000/api/auth/login

```json
{
  "email": "test@example.com",
  "password": "Password123"
}
```

Expected: 200 and `accessToken`.

Keep cookies enabled in your API client.

## Me

GET http://localhost:5000/api/auth/me

Header:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Expected: 200.

## Create Product

POST http://localhost:5000/api/products

Header:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "name": "Laptop",
  "description": "A programming laptop",
  "price": 55000,
  "stock": 10,
  "category": "Electronics",
  "image": "https://example.com/laptop.jpg"
}
```

Expected: 201.

## Get Products

GET http://localhost:5000/api/products

Expected: 200.

## Update

PUT http://localhost:5000/api/products/PRODUCT_ID

Use the same authorization header.

Expected: 200.

## Delete

DELETE http://localhost:5000/api/products/PRODUCT_ID

Use the same authorization header.

Expected: 200.

## Refresh

POST http://localhost:5000/api/auth/refresh-token

No Authorization header is needed. The refresh cookie is used.

Expected: 200 and a new access token.

## Logout

POST http://localhost:5000/api/auth/logout

Use the access token.

Expected: 200.
