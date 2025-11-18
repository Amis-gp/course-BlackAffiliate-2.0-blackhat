# Logging Guide - Announcements

## Тепер активовано детальне логування!

### Де дивитися логи:

#### 1. **Консоль Браузера** (F12 > Console)
Показує логи з фронтенду (AdminPanel)

#### 2. **Термінал** (де запущено `npm run dev`)
Показує логи з бекенду (API routes)

---

## Логи при створенні повідомлення

### У консолі браузера побачите:

```
[ADMIN] Starting announcement creation...
[ADMIN] Form data: { title: "...", contentLength: 123, hasImage: false }
[ADMIN] Normalized image URL: ...
[ADMIN] Session check: { hasSession: true, hasToken: true, tokenLength: 456 }
[ADMIN] Sending request to /api/announcements
[ADMIN] Request body: { title: "...", content: "...", image_url: undefined }
[ADMIN] Response received: { status: 200, statusText: "OK", ok: true, headers: {...} }
[ADMIN] Response data: { success: true, announcement: {...} }
[ADMIN] Announcement created successfully!
```

### У терміналі сервера побачите:

```
[API] POST /api/announcements - Request received
[API] User authenticated: admin@example.com
[API] User is admin, proceeding...
[API] Request body: { title: "...", content: "...", has_image: false }
[API] Inserting into database...
[API] Announcement created successfully: xxxxx-xxxx-xxxx-xxxx
```

---

## Логи при видаленні повідомлення

### У консолі браузера:

```
[ADMIN] Starting announcement deletion... xxxxx-xxxx-xxxx
[ADMIN] DELETE - Session check: { hasSession: true, hasToken: true, announcementId: "..." }
[ADMIN] Sending DELETE request to /api/announcements/xxxxx
[ADMIN] DELETE Response: { status: 200, statusText: "OK", ok: true }
[ADMIN] DELETE Response data: { success: true, message: "..." }
[ADMIN] Announcement deleted successfully!
```

### У терміналі сервера:

```
[API] DELETE /api/announcements/xxxxx-xxxx-xxxx
[API] DELETE - User authenticated: admin@example.com
[API] DELETE - User is admin
[API] Deleting announcement from database...
[API] Announcement deleted successfully
```

---

## Типові помилки та що означають логи

### Помилка: "No authentication token found"

**Логи в браузері:**
```
[ADMIN] Session check: { hasSession: false, hasToken: false, tokenLength: undefined }
[ADMIN] No authentication token found!
```

**Рішення:** Розлогіньтесь і залогіньтесь знову

---

### Помилка: "Network error"

**Логи в браузері:**
```
[ADMIN] Exception during creation: TypeError: Failed to fetch
```

**Рішення:** 
- Перевірте чи запущено сервер
- Перезапустіть `npm run dev`

---

### Помилка: "User is not admin"

**Логи в терміналі:**
```
[API] User authenticated: user@example.com
[API] User is not admin. Role: user
```

**Рішення:** Змініть роль в базі даних:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'user@example.com';
```

---

### Помилка: Database error

**Логи в терміналі:**
```
[API] Database error: { code: "...", message: "...", details: "..." }
```

**Рішення:** Перевірте структуру таблиці та права доступу в Supabase

---

## Як читати логи для діагностики

### Крок 1: Чи дійшов запит до сервера?

**Дивіться в термінал:**
- ✅ Якщо бачите `[API] POST /api/announcements` - запит дійшов
- ❌ Якщо не бачите - проблема з мережею або сервер не працює

### Крок 2: Чи пройшла авторизація?

**Дивіться в термінал:**
- ✅ `[API] User authenticated: ...` - авторизація OK
- ❌ `[API] No token provided` - токен не переданий
- ❌ `[API] Auth error: ...` - токен невалідний

### Крок 3: Чи користувач адмін?

**Дивіться в термінал:**
- ✅ `[API] User is admin, proceeding...` - роль OK
- ❌ `[API] User is not admin. Role: user` - роль не адмін

### Крок 4: Чи дані правильні?

**Дивіться в термінал:**
- ✅ `[API] Request body: { title: "...", content: "..." }` - дані є
- ❌ `[API] Missing required fields` - щось не передалось

### Крок 5: Чи спрацював database insert?

**Дивіться в термінал:**
- ✅ `[API] Announcement created successfully: xxxxx` - все OK!
- ❌ `[API] Database error: ...` - помилка БД

---

## Швидка перевірка

Якщо щось не працює:

1. **Відкрийте 2 вікна поруч:**
   - Ліве: Браузер з Admin Panel + DevTools Console
   - Праве: Термінал з `npm run dev`

2. **Спробуйте створити повідомлення**

3. **Порівняйте логи:**
   - Чи збігаються кроки в браузері і терміналі?
   - Де перервався процес?

4. **Знайдіть перший ERROR лог** - там проблема!

---

## Приклад успішного створення

### Браузер:
```
[ADMIN] Starting announcement creation...
[ADMIN] Form data: { title: "Test", contentLength: 12, hasImage: false }
[ADMIN] Normalized image URL: 
[ADMIN] Session check: { hasSession: true, hasToken: true, tokenLength: 234 }
[ADMIN] Sending request to /api/announcements
[ADMIN] Request body: { title: "Test", content: "Test content", image_url: undefined }
[ADMIN] Response received: { status: 200, statusText: "OK", ok: true }
[ADMIN] Response data: { success: true, announcement: {...} }
[ADMIN] Announcement created successfully!
```

### Термінал:
```
[API] POST /api/announcements - Request received
[API] User authenticated: admin@example.com
[API] User is admin, proceeding...
[API] Request body: { title: "Test", content: "Test content", has_image: false }
[API] Inserting into database...
[API] Announcement created successfully: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Результат: ✅ Success!

---

## Приклад з помилкою

### Браузер:
```
[ADMIN] Starting announcement creation...
[ADMIN] Session check: { hasSession: true, hasToken: true, tokenLength: 234 }
[ADMIN] Sending request to /api/announcements
[ADMIN] Response received: { status: 403, statusText: "Forbidden", ok: false }
[ADMIN] Response data: { success: false, message: "Unauthorized - Admin only" }
[ADMIN] Create failed: { status: 403, statusText: "Forbidden", data: {...} }
```

### Термінал:
```
[API] POST /api/announcements - Request received
[API] User authenticated: user@example.com
[API] User is not admin. Role: user
```

### Проблема: ❌ Користувач не адмін!

---

Тепер у вас є повний контроль і видимість всього процесу! 🔍

