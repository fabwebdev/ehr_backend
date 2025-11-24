# Frontend Authentication API Guide

This document provides complete information about the authentication API endpoints and what the frontend developer needs to call after login.

## 🔐 Authentication Endpoints

### 1. Sign Up (Register)
**Endpoint:** `POST /api/auth/sign-up`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "fGMczMBJpui6WcuuaBkJvAxaP4tGdivr",
      "email": "user@example.com",
      "name": "John Doe",
      "image": null,
      "emailVerified": false,
      "createdAt": "2025-11-19T21:49:57.473Z",
      "updatedAt": "2025-11-19T21:49:57.473Z"
    }
  }
}
```

**Note:** The user is automatically assigned the "patient" role upon registration.

---

### 2. Sign In (Login)
**Endpoint:** `POST /api/auth/sign-in`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "fGMczMBJpui6WcuuaBkJvAxaP4tGdivr",
      "email": "user@example.com",
      "name": "John Doe",
      "image": null,
      "emailVerified": false,
      "createdAt": "2025-11-19T21:49:57.473Z",
      "updatedAt": "2025-11-19T21:49:57.473Z",
      "role": "patient"
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "code": "INVALID_EMAIL_OR_PASSWORD"
}
```

**Important Notes:**
- ✅ **Cookies are automatically set** by Better Auth (session-based authentication)
- ✅ The response includes the user's **role** in the user object
- ✅ Make sure to include cookies in subsequent requests (credentials: 'include' in fetch)
- ✅ The session cookie is httpOnly and secure (in production)

---

### 3. Sign Out (Logout)
**Endpoint:** `POST /api/auth/sign-out`

**Request:** No body required (uses cookies for authentication)

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "User logged out successfully"
}
```

---

## 📋 After Login - Required API Calls

### 1. Get Current User Profile with Permissions ⭐ **REQUIRED**

**Endpoint:** `GET /api/auth/me`

**Headers:** 
- Cookies are automatically sent (session-based auth)

**Response (200 OK):**
```json
{
  "status": 200,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "fGMczMBJpui6WcuuaBkJvAxaP4tGdivr",
      "email": "user@example.com",
      "name": "John Doe",
      "image": null,
      "emailVerified": false,
      "createdAt": "2025-11-19T21:49:57.473Z",
      "updatedAt": "2025-11-19T21:49:57.473Z",
      "role": "patient",
      "permissions": [
        "view:patient"
      ]
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Access denied. No valid session found."
}
```

**When to Call:**
- ✅ Immediately after successful login
- ✅ On app initialization/refresh to check if user is still logged in
- ✅ When you need to verify user permissions for UI rendering

---

### 2. Get Current User's Permissions (Alternative)

**Endpoint:** `GET /api/rbac/my-permissions`

**Headers:** 
- Cookies are automatically sent (session-based auth)

**Response (200 OK):**
```json
{
  "status": 200,
  "data": {
    "role": "patient",
    "permissions": [
      "view:patient"
    ]
  }
}
```

**Note:** This endpoint returns only role and permissions, not full user data.

---

## 🔑 Available Roles

The system supports the following roles:

- `admin` - Full system access
- `doctor` - Medical staff with extensive permissions
- `nurse` - Medical staff with moderate permissions
- `patient` - Limited access (default for new users)
- `staff` - General staff access

---

## 🛡️ Available Permissions

### Patient Management
- `view:patient` - View patient records
- `create:patient` - Create new patient records
- `update:patient` - Update patient records
- `delete:patient` - Delete patient records

### Clinical Notes
- `view:clinical_notes` - View clinical notes
- `create:clinical_notes` - Create clinical notes
- `update:clinical_notes` - Update clinical notes
- `delete:clinical_notes` - Delete clinical notes

### Vital Signs
- `view:vital_signs` - View vital signs
- `create:vital_signs` - Create vital signs records
- `update:vital_signs` - Update vital signs
- `delete:vital_signs` - Delete vital signs

### Medications
- `view:medications` - View medications
- `create:medications` - Create medication records
- `update:medications` - Update medications
- `delete:medications` - Delete medications

### Reports
- `view:reports` - View reports
- `generate:reports` - Generate reports

### Admin
- `manage:users` - Manage user accounts
- `manage:roles` - Manage roles
- `manage:permissions` - Manage permissions
- `view:audit_logs` - View audit logs

---

## 📝 Role-Permission Mapping

### Admin
Has all permissions listed above.

### Doctor
- All patient management (view, create, update)
- All clinical notes (view, create, update)
- All vital signs (view, create, update)
- All medications (view, create, update)
- Reports (view, generate)

### Nurse
- Patient management (view, update)
- Clinical notes (view, create, update)
- Vital signs (view, create, update)
- Medications (view only)

### Patient
- `view:patient` only

### Staff
- `view:patient`
- `view:clinical_notes`
- `view:vital_signs`
- `view:medications`

---

## 💻 Frontend Implementation Example

### Using Fetch API

```javascript
// 1. Login
async function login(email, password) {
  const response = await fetch('http://localhost:3000/api/auth/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // IMPORTANT: Include cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data.data.user; // Contains user info with role
}

// 2. Get User Profile with Permissions (Call after login)
async function getUserProfile() {
  const response = await fetch('http://localhost:3000/api/auth/me', {
    method: 'GET',
    credentials: 'include', // IMPORTANT: Include cookies
  });

  if (!response.ok) {
    if (response.status === 401) {
      // User is not authenticated, redirect to login
      window.location.href = '/login';
      return null;
    }
    throw new Error('Failed to fetch user profile');
  }

  const data = await response.json();
  return data.data.user; // Contains user, role, and permissions
}

// 3. Check if user has permission
function hasPermission(user, permission) {
  return user.permissions && user.permissions.includes(permission);
}

// 4. Usage example
async function initializeApp() {
  try {
    // Check if user is logged in
    const user = await getUserProfile();
    
    if (user) {
      console.log('User logged in:', user.name);
      console.log('Role:', user.role);
      console.log('Permissions:', user.permissions);
      
      // Check permissions for UI rendering
      if (hasPermission(user, 'view:patient')) {
        // Show patient list
      }
      
      if (hasPermission(user, 'create:patient')) {
        // Show "Add Patient" button
      }
    }
  } catch (error) {
    console.error('Not authenticated:', error);
    // Redirect to login
  }
}
```

### Using Axios

```javascript
import axios from 'axios';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// 1. Login
async function login(email, password) {
  const response = await axios.post('/api/auth/sign-in', {
    email,
    password,
  });
  
  return response.data.data.user;
}

// 2. Get User Profile
async function getUserProfile() {
  try {
    const response = await axios.get('/api/auth/me');
    return response.data.data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    throw error;
  }
}
```

---

## 🔒 Important Security Notes

1. **Cookies are HttpOnly**: Session cookies cannot be accessed via JavaScript for security
2. **Automatic Cookie Handling**: Browsers automatically send cookies with requests when `credentials: 'include'` is set
3. **Session Expiry**: Sessions expire after 7 days of inactivity
4. **CORS Configuration**: Make sure your frontend URL is included in `CORS_ORIGIN` environment variable
5. **HTTPS in Production**: Cookies are secure (HTTPS only) in production mode

---

## 🚨 Error Handling

### Common Error Codes

- `401` - Unauthorized (not logged in or invalid session)
- `403` - Forbidden (logged in but insufficient permissions)
- `500` - Server error

### Error Response Format

```json
{
  "status": 401,
  "message": "Access denied. No valid session found."
}
```

---

## 📚 Additional Endpoints

### RBAC Endpoints (Admin Only)
- `GET /api/rbac/roles` - Get all available roles
- `GET /api/rbac/permissions` - Get all available permissions
- `GET /api/rbac/roles/:role/permissions` - Get permissions for a specific role

### User Management (Protected)
- `GET /api/users` - Get all users
- `GET /api/user/:id` - Get user by ID
- `POST /api/user/store` - Create new user
- `PUT /api/user/update/:id` - Update user
- `DELETE /api/user/:id` - Delete user

---

## ✅ Frontend Checklist

After implementing authentication, make sure:

- [ ] Login endpoint is called with `credentials: 'include'`
- [ ] After login, call `/api/auth/me` to get user profile with permissions
- [ ] Store user data (role, permissions) in your state management
- [ ] Check permissions before showing/hiding UI elements
- [ ] Handle 401 errors by redirecting to login
- [ ] Include `credentials: 'include'` in all authenticated API calls
- [ ] Call `/api/auth/me` on app initialization to check if user is still logged in

---

## 🆘 Troubleshooting

### Issue: "Access denied. No valid session found."
**Solution:** Make sure you're including cookies in your requests (`credentials: 'include'`)

### Issue: CORS errors
**Solution:** Check that your frontend URL is in the `CORS_ORIGIN` environment variable

### Issue: Cookies not being set
**Solution:** 
- Check browser console for cookie-related errors
- Verify `sameSite` and `domain` settings match your setup
- In development, cookies work on `localhost` by default

---

## 📞 Support

For issues or questions, check:
- Server logs for detailed error messages
- Network tab in browser DevTools to see request/response details
- Better Auth documentation: https://better-auth.com

