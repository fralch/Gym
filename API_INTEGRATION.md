# API Integration Guide

This document describes the API integration implemented in the Gym app.

## Overview

The app now integrates with the Gimnasio API v1 (`https://grupoviajesroxana.com/api/v1/endpoint/gimnasio`) to handle:
- User authentication
- Member management
- Membership tracking
- Attendance records
- QR code check-in

## Setup

### 1. Install Dependencies

```bash
npm install axios
```

### 2. Configuration

The API base URL is configured in `src/services/api.js`:
```javascript
const BASE_URL = 'https://grupoviajesroxana.com/api/v1/endpoint';
```

To change the API endpoint, modify this constant.

## Services

### API Service (`src/services/api.js`)
- Axios instance with automatic token injection
- Request/response interceptors for error handling
- Automatic token refresh on 401 errors

### Auth Service (`src/services/authService.js`)
- `login(email, password)` - Login user
- `logout()` - Clear user session
- `setToken(token)` - Store auth token
- `getToken()` - Retrieve auth token
- `setUserData(userData)` - Store user data
- `getUserData()` - Retrieve user data
- `isAuthenticated()` - Check auth status

### Miembros Service (`src/services/miembrosService.js`)
- `getAll(search)` - List all members
- `getById(id_usuario)` - Get member details
- `create(memberData)` - Create new member
- `update(id_usuario, memberData)` - Update member
- `delete(id_usuario)` - Delete member

### Membresías Service (`src/services/membresiasService.js`)
- `getAll(filters)` - List memberships
- `getById(id_membresia)` - Get membership details
- `create(membershipData)` - Create membership
- `update(id_membresia, membershipData)` - Update membership
- `delete(id_membresia)` - Delete membership
- `getActiveMembership(id_usuario)` - Get active membership for user

### Asistencias Service (`src/services/asistenciasService.js`)
- `getAll(filters)` - List attendance records
- `getById(id_asistencia)` - Get attendance details
- `create(attendanceData)` - Create attendance record
- `update(id_asistencia, attendanceData)` - Update attendance
- `delete(id_asistencia)` - Delete attendance
- `getByUser(id_usuario, limit)` - Get user attendance
- `getTodayAttendance(id_usuario)` - Check today's attendance

### Check-in Service (`src/services/checkinService.js`)
- `marcarAsistencia(qrToken)` - Mark attendance via QR code
- `hasCheckedInToday()` - Check if already checked in today

## Features

### 1. Authentication Flow

The app uses JWT token authentication with `AsyncStorage`:

1. User logs in via `LoginScreen`
2. Token is stored securely
3. Token is automatically added to all API requests
4. App redirects to main screens after successful login

**Test Mode**: Use the "Modo Prueba" button on login screen to test without credentials.

### 2. QR Code Check-in

When scanning a QR code:
1. Camera captures QR data
2. App calls `checkinService.marcarAsistencia(qrData)`
3. API validates:
   - User authentication
   - QR token validity
   - Active membership
   - Duplicate check-in
4. Success/error message is displayed

### 3. User Information

`UserInfoScreen` displays:
- Member name, DNI
- Active membership status
- Start/end dates
- Remaining days
- Real-time data from API

### 4. Statistics

`StatsScreen` shows:
- Last 7 days attendance chart
- Weekly attendance count
- Current streak
- Total attendance
- All calculated from real API data

## Authentication Context

The `AuthContext` provides:
- `user` - Current user data
- `isAuthenticated` - Auth status
- `loading` - Loading state
- `login(email, password)` - Login function
- `logout()` - Logout function
- `setAuthData(token, userData)` - Set auth data manually
- `updateUser(userData)` - Update user data
- `checkAuthStatus()` - Refresh auth status

### Usage Example

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Text>Please login</Text>;
  }

  return (
    <View>
      <Text>Welcome {user.nombre}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

## Protected Routes

The `AppNavigator` automatically handles route protection:
- Shows `LoginScreen` when `isAuthenticated === false`
- Shows main app screens when `isAuthenticated === true`
- No manual navigation needed

## Error Handling

All services include comprehensive error handling:

1. **Network Errors**: Caught and logged
2. **401 Unauthorized**: Auto-logout, redirect to login
3. **403 Forbidden**: Display error message to user
4. **422 Validation**: Show validation errors
5. **Other Errors**: Generic error message

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

### Check-in Response
```json
{
  "mensaje": "Asistencia registrada",
  "hora": "14:30:00"
}
```

## QR Token Configuration

The QR check-in requires a valid token. Default token: `GYM_TOKEN_2025`

To update the QR token on the server:
```sql
UPDATE g_configuracion
SET valor='NEW_TOKEN'
WHERE clave='qr_checkin_token';
```

## Testing

### Test User Data
To test the app without a real backend:
1. Click "Modo Prueba" on login screen
2. Mock user data is created:
   - id_usuario: 1
   - nombre: "Usuario de Prueba"
   - email: "test@example.com"

### API Testing
Use tools like Postman or curl to test the API:

```bash
# Login
curl -X POST https://grupoviajesroxana.com/api/v1/endpoint/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Check-in
curl -X POST https://grupoviajesroxana.com/api/v1/endpoint/gimnasio/marcar-asistencia \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"qr_token":"GYM_TOKEN_2025"}'
```

## Next Steps

1. **Install axios**: `npm install axios`
2. **Configure API URL**: Update `BASE_URL` in `src/services/api.js` if needed
3. **Set up backend**: Ensure API endpoints are accessible
4. **Test authentication**: Try logging in with real credentials
5. **Configure QR token**: Set up the QR token on server

## Troubleshooting

### "Network Error"
- Check internet connection
- Verify API URL is correct
- Ensure API server is running

### "401 Unauthorized"
- Token may be expired
- Try logging in again
- Check token is being sent in headers

### "403 Forbidden - QR inválido"
- Verify QR token matches server configuration
- Check QR code contains correct token

### "Membresía inactiva"
- User's membership has expired
- Create/renew membership on server

## Security Notes

- Tokens are stored in `AsyncStorage` (secure on device)
- Never commit tokens or credentials to git
- Use HTTPS for all API calls
- Implement token refresh if sessions expire
- Add additional security layers as needed (biometrics, etc.)
