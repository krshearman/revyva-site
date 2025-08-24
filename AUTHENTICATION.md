# Revyva Unified Authentication System

## Overview

This system now supports **unified authentication** across all Revyva properties using Gumroad licenses. Users who purchase the app through Gumroad can use the same license key to access workbook and journal materials.

## How It Works

### 1. App Authentication
- Users enter their Gumroad license key in the React app
- The app verifies the license via Netlify serverless function
- License data is stored in localStorage for future use

### 2. Workbook/Journal Authentication  
- Users can enter the same Gumroad license key
- The system calls the same verification endpoint as the app
- Fallback to legacy hash-based authentication for existing users

### 3. Cross-Property License Sharing
- License verification uses the deployed app's Netlify function
- Same product ID and verification logic across all properties
- Seamless experience for customers

## Files Changed

### New Files
- `gumroad-auth.js` - Shared authentication logic
- `netlify/functions/verify-license.js` - Serverless function for license verification

### Updated Files
- `workbook/index.html` - Now supports Gumroad licenses
- `journal/index.html` - Now supports Gumroad licenses
- `netlify.toml` - Configuration for serverless functions

## Configuration

### Gumroad Settings
```javascript
const GUMROAD_PRODUCT_ID = 'V20f5aJqNEX4CqPFnwpt0A==';
const GUMROAD_VERIFY_ENDPOINT = 'https://revyva-app.netlify.app/api/verify-license';
```

### Legacy Fallback
```javascript
const ACCESS_KEY_HASH = 'ed1e70b20c2f496bbf58638229dde8edb1c18b113434bf367ceb32d64d464580';
```

## Testing

1. **Valid Gumroad License**: Enter a real license key from a Gumroad purchase
2. **Legacy Access**: Enter the original access key (still works)
3. **Invalid Key**: Should show appropriate error message

## Benefits

✅ **Unified Experience**: One license key for all content  
✅ **Backwards Compatible**: Legacy access keys still work  
✅ **Secure**: Server-side verification prevents tampering  
✅ **Real-time**: Immediate verification via Gumroad API  
✅ **Scalable**: Easy to add new content areas  

## Future Enhancements

- Add license usage tracking
- Implement license expiration checks
- Add customer information display
- Support multiple product tiers
