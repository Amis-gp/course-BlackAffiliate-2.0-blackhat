# Access Level 6 Setup Guide

## Overview
Access Level 6 "Creative Method Only" provides restricted access to a single lesson: **Lesson 4-9: New method for bypassing creative moderation**.

## Database Setup

### For Existing Database
Run the following SQL command in your Supabase SQL Editor:

```sql
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_access_level_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_access_level_check CHECK (access_level IN (1, 2, 3, 4, 5, 6));
```

Or use the provided file:
```bash
# Execute the SQL file in Supabase
cat update-access-level-6.sql
```

### For New Database
The `supabase-setup.sql` file has been updated to include access level 6 by default.

## Features

### User Experience
- Users with access level 6 can **only** see and access Lesson 4-9
- Navigation shows only Section 4 with Lesson 4-9
- All other lessons and sections are hidden
- Direct URL access to other lessons is blocked by API

### Admin Panel
Access level 6 is available in:
1. **User Creation Form** - Select "Creative Method Only" when creating new users
2. **User Management** - Edit existing users to change their access level to 6
3. **Registration Approval** - Approve new registration requests with level 6 access

## Access Level Definitions

| Level | Name | Description |
|-------|------|-------------|
| 1 | Basic | Standard access |
| 2 | Premium | Premium access |
| 3 | VIP | Full VIP access |
| 4 | Without Road Map | VIP without Road Map button |
| 5 | Blocked | No access (blocked) |
| 6 | Creative Method Only | Access to Lesson 4-9 only |

## Implementation Details

### Files Modified
- `src/types/auth.ts` - Added access level 6 type
- `src/contexts/AuthContext.tsx` - Updated hasAccess logic with lessonId parameter
- `src/components/AccessControl.tsx` - Added special handling for level 6
- `src/components/CourseNavigation.tsx` - Filter lessons for level 6 users
- `src/components/AdminPanel.tsx` - Added level 6 to all dropdowns
- `src/app/api/lessons/[id]/route.ts` - Added API-level access control
- `src/data/courseData.ts` - Added lesson-4-9 to section 4
- `supabase-setup.sql` - Updated access_level constraint

### Files Created
- `public/lessons/lesson-4-9.md` - New lesson content
- `public/img/4.9/` - Lesson images directory
- `update-access-level-6.sql` - Database migration script

## Testing

1. Create a test user with access level 6
2. Login as that user
3. Verify only Lesson 4-9 is visible in navigation
4. Try accessing other lessons directly - should be blocked
5. Verify lesson content loads correctly

## Important Notes

⚠️ **Replace placeholder images** in `public/img/4.9/` with actual screenshots from the lesson content.

⚠️ **Run database migration** before deploying to production.

⚠️ Users with level 6 will have **extremely limited** access - use this level carefully.

