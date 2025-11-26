# Users API Documentation

## POST /users/register

This endpoint allows the registration of a new user. It validates the user input, hashes the password, creates a new user, and returns an authentication token if successful.

### Request Body

The request body must be sent as JSON and include the following fields:

```json
{
  "fullname": {
    "firstname": "string, required, minimum 3 characters",
    "lastname": "string, optional, minimum 3 characters if provided"
  },
  "email": "string, required, valid email address",
  "password": "string, required, minimum 6 characters"
}
```

### Validation Rules

- `fullname.firstname`: Required, minimum length 3 characters.
- `fullname.lastname`: Optional, minimum length 3 characters if provided.
- `email`: Required, must be valid email format.
- `password`: Required, minimum length 6 characters.

### Response

- **201 Created**

  Successfully created the user and returns the created user object (excluding the password) and a JWT authentication token.

  ```json
  {
    "user": {
      "_id": "string",
      "fullname": {
        "firstname": "string",
        "lastname": "string"
      },
      "email": "string",
      "socketId": "string | null"
    },
    "token": "string (JWT token)"
  }
  ```

- **400 Bad Request**

  Validation errors occurred. The response returns an array of validation error messages.

  ```json
  {
    "errors": [
      {
        "msg": "Invalid email address",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "First name must be at least 3 characters long",
        "param": "fullname.firstname",
        "location": "body"
      },
      {
        "msg": "Password must be at least 6 characters long",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

### Example Request

```bash
POST /users/register HTTP/1.1
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword1"
}
```

### Notes

- Passwords are hashed before being saved.
- The email must be unique in the system.
- `socketId` is an optional field that can be updated later.


# `/users/login` Endpoint Documentation

## Description
The `/users/login` endpoint allows a registered user to authenticate by providing their email and password. Upon successful authentication, the endpoint responds with the user details and a JWT token that can be used for subsequent authenticated requests.

## HTTP Method
POST

## Endpoint
`/users/login`

## Request Body
The request body should be sent as JSON and must include the following fields:

| Field    | Type   | Required | Description                     |
|----------|--------|----------|---------------------------------|
| email    | String | Yes      | User's registered email address (must be a valid email format) |
| password | String | Yes      | User's password (minimum 6 characters) |

Example:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

## Response

### Success (Status Code: 200)
- Returns the authenticated user's details (excluding the password) and a JWT token for authorization.

Example:
```json
{
  "user": {
    "_id": "userId",
    "fullname": {
      "firstname": "First",
      "lastname": "Last"
    },
    "email": "user@example.com",
    "socketId": null
  },
  "token": "jwt_token_string_here"
}
```

### Client Errors

#### Validation Error (Status Code: 400)
- Returned when the email or password do not meet validation criteria (invalid email format or password less than 6 characters).
- Response contains an array of error messages related to the validation failure.

Example:
```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

#### Unauthorized (Status Code: 401)
- Returned when the user is not found in the database (email does not exist).
- Returned when the password does not match the stored hashed password for the user.

Example (user not found):
```json
{
  "message": "user not found"
}
```

Example (password mismatch):
```json
{
  "message": "Password does not match"
}
```

## Summary
- The endpoint expects a POST request with `email` and `password` in the JSON body.
- Validations are performed on the input.
- On success, it returns user info and a JWT token.
- On failure, it returns appropriate error messages and status codes 400 or 401.


# User Profile Endpoint Documentation

## Endpoint: GET /users/profile

### Description
This endpoint retrieves the profile information of the authenticated user. It requires a valid authentication token to access the user's data.

### Authentication
- **Required**: Yes
- **Method**: Bearer token in the Authorization header or token in cookies
- **Format**: `Authorization: Bearer <token>` or `token=<token>` in cookies

### Request
- **Method**: GET
- **URL**: `/users/profile`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>` (optional if token is in cookies)
- **Body**: None required

### Response
#### Success (200 OK)
- **Status Code**: 200
- **Content-Type**: application/json
- **Body**:
  ```json
  {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": "socket_id"
  }
  ```

#### Error (401 Unauthorized)
- **Status Code**: 401
- **Content-Type**: application/json
- **Body**:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Notes
- The password field is not included in the response for security reasons.
- The endpoint uses JWT authentication to verify the user's identity.
- If the token is blacklisted (e.g., after logout), access will be denied.


# Logout Endpoint Documentation

## Endpoint
`GET /users/logout`

## Description
This endpoint logs out the authenticated user by clearing the authentication token from the cookies and blacklisting the token to prevent its further use. The user will no longer be able to access protected routes until they log in again.

## Authentication
- **Required**: The request must include a valid JWT token for authentication.
- The token can be provided in one of the following ways:
  - **Cookies**: Include a `token` cookie containing the JWT token.
  - **Headers**: Include an `Authorization` header with the value `Bearer <jwt_token>`.

If no valid token is provided or the token is blacklisted, the request will be rejected with a 401 Unauthorized status.

## Request
- **Method**: GET
- **URL**: `/users/logout`
- **Headers** (optional if using cookies):
  - `Authorization: Bearer <jwt_token>`
- **Cookies** (optional if using headers):
  - `token=<jwt_token>`
- **Body**: No request body is required or accepted for this endpoint.

## Response
- **Status Code**: 200 OK
- **Body**:
  ```json
  {
    "message": "Logged out"
  }
  ```
- **Cookies**: The `token` cookie will be cleared (set to expire immediately).

## Error Responses
- **401 Unauthorized**: If no token is provided, the token is invalid, or the token is blacklisted.
  - Body: `{"message": "Unauthorized"}`

## Notes
- This endpoint uses the `authUser` middleware to verify the user's authentication before processing the logout.
- The token is added to a blacklist to ensure it cannot be reused, enhancing security.
