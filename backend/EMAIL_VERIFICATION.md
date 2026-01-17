# Email Verification Implementation

## Overview

Email verification has been implemented to ensure users verify their email addresses after registration. This helps prevent fake accounts and ensures valid communication channels.

## Features

- ✅ Token-based email verification
- ✅ 24-hour token expiration
- ✅ Resend verification email functionality
- ✅ Email verification status tracking
- ✅ Secure token generation using crypto
- ✅ Email verification endpoint
- ✅ Integration with SendGrid email service

## Database Schema

The following columns are added to the `users` table via migration:

- `email_verified` (BOOLEAN, default: false)
- `email_verification_token` (VARCHAR(255))
- `email_verification_token_expires_at` (TIMESTAMP)
- `password_reset_token` (VARCHAR(255)) - for password reset functionality
- `password_reset_token_expires_at` (TIMESTAMP)

## API Endpoints

### 1. Register (with email verification)
```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "user",  // optional
  "branch_id": "uuid"  // optional
}

Response: {
  "message": "User registered successfully. Please check your email to verify your account.",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    "email_verified": false
  }
}
```

### 2. Verify Email
```
GET /api/auth/verify-email?token=verification_token

Response: {
  "message": "Email verified successfully",
  "verified": true
}
```

### 3. Resend Verification Email
```
POST /api/auth/resend-verification
Body: {
  "email": "user@example.com"
}

Response: {
  "message": "Verification email sent successfully. Please check your inbox."
}
```

### 4. Login (returns verification status)
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "message": "Login successful" or "Login successful. Please verify your email address.",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    "email_verified": true/false
  },
  "requiresVerification": false/true
}
```

## Configuration

### Environment Variables

Make sure these are set in your `.env` file:

```env
# SendGrid Configuration (for sending verification emails)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@lavatec.com
FRONTEND_URL=http://localhost:5173  # URL for verification links
```

### Frontend URL

The verification email contains a link that points to:
```
${FRONTEND_URL}/verify-email?token=verification_token
```

Make sure your frontend has a route to handle this URL.

## Migration

Run the email verification migration:

```bash
cd backend
npm run migrate:email-verification
```

This will add the necessary columns to the `users` table.

## Email Verification Flow

1. **User Registration**:
   - User registers with email and password
   - System generates a unique verification token (32 bytes, hex)
   - Token expires in 24 hours
   - Verification email is sent automatically
   - User can still login (verification is optional by default)

2. **Email Verification**:
   - User clicks link in email: `/verify-email?token=xxx`
   - Backend validates token and expiration
   - If valid, sets `email_verified = true` and clears token
   - If already verified, returns success message
   - If expired, returns error message

3. **Resend Verification**:
   - User can request a new verification email
   - System generates a new token (24-hour expiration)
   - New verification email is sent
   - Old token is invalidated

## Security Features

- ✅ Secure token generation using `crypto.randomBytes(32)`
- ✅ Token expiration (24 hours)
- ✅ Tokens are cleared after verification
- ✅ Case-insensitive email matching
- ✅ Email normalization (lowercase, trimmed)
- ✅ Protection against timing attacks (generic error messages)

## Optional: Require Email Verification for Login

Currently, users can login without verifying their email. To require email verification:

1. Open `backend/src/controllers/authController.ts`
2. Find the `login` function
3. Uncomment these lines (around line 117):

```typescript
if (!user.email_verified) {
  throw new AppError('Please verify your email address before logging in. Check your inbox for the verification email.', 403);
}
```

## Frontend Integration

Your frontend should:

1. **Handle verification link**: Create a page at `/verify-email` that:
   - Extracts the token from URL query params
   - Calls `GET /api/auth/verify-email?token=xxx`
   - Shows success/error message

2. **Show verification status**: Display verification status in user profile
   - Show "Email verified" badge if verified
   - Show "Resend verification" button if not verified

3. **Resend verification**: Provide a way to resend verification email
   - Call `POST /api/auth/resend-verification` with email

## Testing

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Test Verification
```bash
# Get token from email or database, then:
curl http://localhost:5000/api/auth/verify-email?token=YOUR_TOKEN
```

### Test Resend
```bash
curl -X POST http://localhost:5000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Troubleshooting

### Email not sending
- Check SendGrid API key in `.env`
- Check SendGrid account status
- Check email service logs
- In development, emails are logged to console

### Token expired
- User must request a new verification email
- Use `/api/auth/resend-verification` endpoint

### Token invalid
- Token may have already been used
- Token may be from a different user
- Check token format (should be 64 hex characters)

## Next Steps

1. ✅ Run migration: `npm run migrate:email-verification`
2. ✅ Configure SendGrid in `.env`
3. ✅ Set `FRONTEND_URL` in `.env`
4. ✅ Implement frontend verification page
5. ⚠️ (Optional) Enable required verification for login
6. ✅ Test the complete flow
