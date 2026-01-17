# SMS Service Implementation

## Overview

SMS functionality has been implemented in the backend to send notifications to customers. The service supports multiple providers and integrates with the order management system.

## Features

- ✅ SMS service with support for multiple providers (Twilio, AWS SNS, Mock)
- ✅ Automatic SMS notifications for order creation and status updates
- ✅ SMS API endpoints for manual SMS sending
- ✅ Bulk SMS functionality
- ✅ Promotional SMS campaigns
- ✅ Respects customer notification preferences (`notification_channel`, `send_notifications`)

## SMS Providers

### 1. Mock Provider (Default - Development)
- No configuration needed
- Logs SMS messages to console
- Perfect for development and testing

### 2. Twilio
- Professional SMS service
- Requires Twilio account and credentials
- Install: `npm install twilio`

### 3. AWS SNS
- Amazon Simple Notification Service
- Requires AWS credentials
- Install: `npm install @aws-sdk/client-sns`

## Configuration

Add these environment variables to your `.env` file:

```env
# SMS Provider (mock, twilio, or aws)
SMS_PROVIDER=mock

# Twilio Configuration (if using Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# AWS Configuration (if using AWS SNS)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

## Installation

### For Twilio:
```bash
cd backend
npm install twilio
```

### For AWS SNS:
```bash
cd backend
npm install @aws-sdk/client-sns
```

## API Endpoints

### Send SMS to Single Customer
```
POST /api/sms/send
Authorization: Bearer <token>
Body: {
  "customer_id": "uuid",  // Optional if phone is provided
  "phone": "+1234567890", // Optional if customer_id is provided
  "message": "Your message here"
}
```

### Send Bulk SMS
```
POST /api/sms/send/bulk
Authorization: Bearer <token>
Body: {
  "customer_ids": ["uuid1", "uuid2", ...],
  "message": "Your message here"
}
```

### Send Promotional SMS
```
POST /api/sms/send/promotional
Authorization: Bearer <token>
Body: {
  "category": "vip",  // Optional - filter by customer category
  "message": "Your promotional message"
}
```

## Automatic Notifications

SMS notifications are automatically sent when:

1. **Order Created**: Customer receives confirmation SMS
2. **Order Status Updated**: Customer receives status update SMS
3. **Order Ready**: Special notification when order is ready for pickup

Notifications respect the `notification_channel` and `send_notifications` fields in the orders table:
- `notification_channel`: 'email', 'sms', or 'both'
- `send_notifications`: true/false

## Integration Points

### Order Controller
- `createOrder`: Sends order confirmation SMS
- `updateOrder`: Sends status update SMS when order status changes

### SMS Service Methods
- `sendSMS()`: Generic SMS sending
- `sendOrderConfirmationSMS()`: Order confirmation
- `sendOrderStatusUpdateSMS()`: Status updates
- `sendOrderReadySMS()`: Ready for pickup
- `sendDeliveryNotificationSMS()`: Delivery notifications
- `sendPasswordResetSMS()`: Password reset codes
- `sendPromotionalSMS()`: Marketing campaigns

## Testing

In development mode with `SMS_PROVIDER=mock`, all SMS messages are logged to the console:

```
📱 SMS would be sent: {
  to: '+1234567890',
  from: 'Lavatec',
  message: 'Your message here'
}
```

## Error Handling

- SMS failures don't break order creation/updates
- Errors are logged to console
- Failed SMS attempts in bulk operations are reported in the response

## Next Steps

1. Choose your SMS provider (Twilio recommended for production)
2. Install the corresponding npm package
3. Add credentials to `.env`
4. Set `SMS_PROVIDER` in `.env`
5. Test with a single SMS before enabling automatic notifications
