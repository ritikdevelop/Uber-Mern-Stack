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
