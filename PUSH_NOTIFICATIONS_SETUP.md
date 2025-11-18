# Push Notifications Setup Guide

## Overview
Push notifications are now integrated into the announcements system. Users can enable browser notifications to receive instant alerts for new announcements.

## Features Implemented

### ✅ Edit Announcements
- Edit button in AdminPanel for each announcement
- Inline edit form with title, content, and image URL fields
- "Edited" badge displayed on modified announcements
- Updated timestamp shown in both banner and list views
- Database trigger automatically sets `updated_at` and `is_edited` fields

### ✅ Enhanced Design
- Gradient backgrounds with modern styling
- Smooth animations and hover effects
- Custom scrollbars with red theme
- Improved visual hierarchy and spacing
- Badge indicators for edited announcements
- Responsive design for all screen sizes

### ✅ Push Notifications
- Service Worker for background notifications
- Browser notification API integration
- User-controlled enable/disable toggle
- Permission request handling
- Subscription management in database

## Setup Instructions

### 1. Generate VAPID Keys

You need VAPID (Voluntary Application Server Identification) keys for Web Push API.

```bash
npx web-push generate-vapid-keys
```

This will output:
```
Public Key: BG...
Private Key: _Y...
```

### 2. Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

### 3. Database Migration

Run the migration SQL file:

```bash
psql -U your_username -d your_database -f announcements-improvements-migration.sql
```

Or execute in Supabase SQL Editor:
- Open Supabase Dashboard
- Go to SQL Editor
- Run the contents of `announcements-improvements-migration.sql`

### 4. Update Existing Announcements

Add the new columns to existing announcements:

```sql
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE;
```

### 5. Service Worker Registration

The service worker is already included at `public/service-worker.js`. It will be automatically registered when users enable push notifications.

## How to Use

### For Admins

1. **Edit Announcements:**
   - Go to Admin Panel > Announcements tab
   - Click the blue edit (pencil) icon on any announcement
   - Modify title, content, or image URL
   - Click "Save" to update

2. **View Statistics:**
   - Each announcement shows read count
   - "Edited" badge appears on modified announcements
   - Updated timestamp displayed

### For Users

1. **Enable Push Notifications:**
   - Click the Settings (gear) icon on the homepage
   - Toggle "Push Notifications" switch
   - Grant permission when browser prompts
   - Notifications will now appear for new announcements

2. **Disable Push Notifications:**
   - Click Settings icon
   - Toggle switch off
   - Subscription will be removed

## Browser Support

Push notifications work in:
- ✅ Chrome (Desktop & Android)
- ✅ Firefox (Desktop & Android)
- ✅ Edge (Desktop)
- ✅ Safari (macOS 16.4+, iOS 16.4+)
- ❌ Opera Mini
- ❌ Internet Explorer

## Testing Push Notifications

### Manual Test

1. Open browser console
2. Run this code:

```javascript
navigator.serviceWorker.ready.then((registration) => {
  registration.showNotification('Test Notification', {
    body: 'This is a test notification',
    icon: '/img/logo.webp',
    badge: '/img/favicon.webp'
  });
});
```

### Create Announcement Test

1. Login as admin
2. Create a new announcement
3. Check if users with push enabled receive notification
4. Notification should appear even if browser is in background

## Troubleshooting

### Notifications Not Appearing

1. **Check Browser Support:**
   - Open DevTools Console
   - Look for "Push notifications are not supported" message

2. **Check Permissions:**
   - Browser settings > Site settings > Notifications
   - Ensure site has "Allow" permission

3. **Check Service Worker:**
   - DevTools > Application > Service Workers
   - Verify service worker is registered and active

4. **Check VAPID Keys:**
   - Ensure both public and private keys are set correctly
   - Keys must match (generated together)

### Service Worker Not Registering

1. **HTTPS Required:**
   - Push notifications require HTTPS (except localhost)
   - Ensure site is served over secure connection

2. **Check Console Errors:**
   - Look for service worker registration errors
   - Common issues: syntax errors, scope conflicts

## Database Schema

### announcements table (updated)
```sql
- id: UUID (primary key)
- title: TEXT
- content: TEXT
- image_url: TEXT (optional)
- created_at: TIMESTAMPTZ
- created_by: UUID
- updated_at: TIMESTAMPTZ (new)
- is_edited: BOOLEAN (new)
```

### user_push_subscriptions table (new)
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key)
- endpoint: TEXT
- p256dh: TEXT
- auth: TEXT
- enabled: BOOLEAN
- created_at: TIMESTAMPTZ
```

## API Endpoints

### Push Subscription Management

**POST /api/push-subscription**
- Save user's push subscription
- Requires: `endpoint`, `p256dh`, `auth`
- Auth: Bearer token

**DELETE /api/push-subscription**
- Remove user's push subscription
- Query param: `endpoint`
- Auth: Bearer token

**GET /api/push-subscription**
- Get user's active subscriptions
- Auth: Bearer token

### Announcement Management

**PUT /api/announcements/[id]**
- Edit existing announcement
- Body: `{ title, content, image_url }`
- Auth: Admin only

## Next Steps

### Optional Enhancements

1. **Send Push on Announcement Creation:**
   - Trigger push notification when admin creates announcement
   - Only send to users with push enabled

2. **Priority Levels:**
   - Add priority field (high/medium/low)
   - Send push only for high priority announcements

3. **Custom Notification Sounds:**
   - Add different sounds for different announcement types

4. **Rich Notifications:**
   - Include images in notifications
   - Add action buttons (Read, Dismiss)

5. **Notification History:**
   - Track which notifications were delivered
   - Show notification logs in admin panel

## Security Considerations

- VAPID keys should be kept secret (private key especially)
- Push subscriptions are tied to user accounts
- Users can revoke permission anytime through browser settings
- Service worker only has access to notification API
- All push subscription endpoints require authentication

## Performance

- Service worker is lazy-loaded (only when user enables push)
- Subscriptions stored in database for server-side sending
- Minimal impact on page load time
- Background notifications don't affect app performance

