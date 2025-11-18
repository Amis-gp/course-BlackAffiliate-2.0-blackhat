# Test Announcements API

## Quick Test in Browser Console

Відкрийте консоль браузера на сторінці Admin Panel та виконайте:

### 1. Test Create Announcement
```javascript
async function testCreate() {
  const response = await fetch('/api/announcements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Test Announcement',
      content: 'This is a test message',
      image_url: ''
    })
  });
  const data = await response.json();
  console.log('Create response:', data);
  return data;
}

testCreate();
```

### 2. Test Get Announcements
```javascript
async function testGet() {
  const response = await fetch('/api/announcements');
  const data = await response.json();
  console.log('Get response:', data);
  return data;
}

testGet();
```

### 3. Test Delete Announcement
```javascript
async function testDelete(announcementId) {
  const response = await fetch(`/api/announcements/${announcementId}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log('Delete response:', data);
  return data;
}

// Replace 'your-announcement-id' with actual ID
testDelete('your-announcement-id');
```

## Troubleshooting

### If create fails with 401:
- Check if you're logged in as admin
- Check if token is being sent correctly
- Verify Supabase connection

### If create fails with 403:
- Your user role is not 'admin'
- Check database: `SELECT role FROM profiles WHERE email = 'your-email'`

### If create fails with 500:
- Check Supabase connection
- Check database permissions
- Look at server logs in terminal

### Common Issues:

1. **"Not authenticated"** - Token not sent or invalid
2. **"Unauthorized - Admin only"** - User is not admin
3. **"Title and content are required"** - Missing required fields
4. **"Failed to create announcement"** - Database error

## Manual Database Check

Можна перевірити безпосередньо в Supabase:

```sql
-- Check announcements table
SELECT * FROM announcements ORDER BY created_at DESC LIMIT 5;

-- Check your user role
SELECT email, role FROM profiles WHERE email = 'your-email@example.com';

-- Check user permissions
SELECT * FROM user_read_announcements WHERE user_id = 'your-user-id';
```

