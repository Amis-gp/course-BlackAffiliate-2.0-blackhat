# Troubleshooting Announcements

## Проблема: "Failed to fetch"

Ця помилка означає, що запит взагалі не дійшов до сервера.

### Можливі причини:

1. **Сервер не запущений**
   - Перевірте чи працює `npm run dev`
   - Перегляньте термінал на помилки

2. **CORS проблеми** (рідко на localhost)
   - Сервер блокує запити з фронтенду

3. **Мережеві проблеми**
   - VPN або firewall блокує запити
   - Проблеми з інтернетом

## Діагностика кроки:

### Крок 1: Перевірте чи сервер працює

Відкрийте термінал де запущено `npm run dev` і подивіться чи є помилки.

### Крок 2: Перевірте консоль браузера

Відкрийте DevTools (F12) > Console і спробуйте створити повідомлення.

Ви повинні побачити лог:
```
[API] POST /api/announcements - Request received
[API] User authenticated: your@email.com
[API] User is admin, proceeding...
[API] Request body: { title: '...', content: '...', has_image: false }
[API] Inserting into database...
[API] Announcement created successfully: xxxxx-xxxx-xxxx
```

### Крок 3: Перевірте Network tab

1. Відкрийте DevTools > Network
2. Спробуйте створити повідомлення
3. Знайдіть запит до `/api/announcements`
4. Подивіться:
   - Status Code (має бути 200)
   - Response (що повертає сервер)
   - Request Headers (чи є Authorization)
   - Request Payload (чи передаються дані)

### Крок 4: Тест прямим запитом

Відкрийте консоль браузера і виконайте:

```javascript
// Тест GET
fetch('/api/announcements', {
  headers: {
    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
  }
}).then(r => r.json()).then(console.log);
```

```javascript
// Тест POST
fetch('/api/announcements', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
  },
  body: JSON.stringify({
    title: 'Test',
    content: 'Test content'
  })
}).then(r => r.json()).then(console.log);
```

## Типові помилки та рішення:

### Error: "Not authenticated" (401)
**Причина:** Токен не передається або невалідний

**Рішення:**
1. Перевірте чи ви залогінені
2. Спробуйте розлогінитися і залогінитися знову
3. Перевірте чи є токен: `(await supabase.auth.getSession()).data.session`

### Error: "Unauthorized - Admin only" (403)
**Причина:** Ваш користувач не має роль admin

**Рішення:**
1. Перевірте в Supabase Dashboard:
   ```sql
   SELECT email, role FROM profiles WHERE email = 'your@email.com';
   ```
2. Якщо role не 'admin', оновіть:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```

### Error: "Title and content are required" (400)
**Причина:** Дані не передаються правильно

**Рішення:**
- Перевірте чи заповнені поля Title і Content
- Подивіться в Network tab чи передаються дані в body

### Error: Database error (500)
**Причина:** Проблема з Supabase або структурою таблиці

**Рішення:**
1. Перевірте Supabase Dashboard чи таблиця announcements існує
2. Перевірте чи правильна структура:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'announcements';
   ```
3. Запустіть міграцію якщо потрібно:
   ```bash
   psql -f announcements-improvements-migration.sql
   ```

### "Failed to fetch" без деталей
**Причина:** Запит не дійшов до сервера

**Рішення:**
1. Перезапустіть dev сервер:
   ```bash
   # Зупиніть (Ctrl+C)
   # Запустіть знову
   npm run dev
   ```

2. Очистіть кеш Next.js:
   ```bash
   rm -rf .next
   npm run dev
   ```

3. Перевірте чи немає конфлікту портів:
   ```bash
   lsof -i :3000
   ```

## Швидкий тест API

Якщо нічого не допомагає, створіть тестовий файл:

```typescript
// pages/api/test-announce.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'API is working!',
    timestamp: new Date().toISOString()
  });
}
```

Потім відкрийте: `http://localhost:3000/api/test-announce`

Якщо бачите JSON - сервер працює, проблема в authentication або database.
Якщо помилка - проблема з сервером.

## Контакт для допомоги

Якщо нічого не допомогло, надішліть мені:
1. Повну помилку з консолі браузера
2. Логи з терміналу де запущено сервер
3. Screenshot Network tab з запитом
4. Ваш email з якого логінитесь

