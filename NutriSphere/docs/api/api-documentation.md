# NutriSphere — REST API Architecture Documentation

## Overview
The NutriSphere API follows RESTful design principles with JSON payloads, stateless JWT bearer token authentication, consistent response envelopes, and standard HTTP response status codes.

### Base URL
- Local Development: `http://localhost:8080/api`
- Production: `https://nutrisphere.example.com/api`

### Standard Response Envelope
All API responses adhere to the standard `ApiResponse<T>` structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response Envelope
Error responses adhere to the standard `ErrorResponse` structure:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: 'email' must be a valid email address",
  "timestamp": "2026-10-04T20:30:00.000"
}
```

### HTTP Status Code Conventions
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Invalid payload or missing parameters.
- `401 Unauthorized`: Missing or invalid JWT Bearer token.
- `403 Forbidden`: Authenticated user lacks sufficient role permission.
- `404 Not Found`: Target resource does not exist.
- `500 Internal Server Error`: Unhandled server exception.
