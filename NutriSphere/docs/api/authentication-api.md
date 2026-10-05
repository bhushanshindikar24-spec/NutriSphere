# NutriSphere — Authentication & Identity API

## Authentication Endpoints (`/api/auth`)

### 1. User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "patient@nutrisphere.com",
  "password": "password"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "userId": 3,
    "email": "patient@nutrisphere.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PATIENT"
  }
}
```

### 2. User Registration
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "newuser@nutrisphere.com",
  "password": "StrongPassword123!",
  "firstName": "Alex",
  "lastName": "Rivera",
  "role": "PATIENT"
}
```

### 3. Refresh Access Token
- **Endpoint**: `POST /api/auth/refresh`
- **Access**: Public
- **Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}
```

### 4. Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Access**: Authenticated (Bearer Token)
- **Response**: Returns current logged-in user profile, role, and permissions.
