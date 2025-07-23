# Розгортання на Netlify - Оновлено

Цей проект налаштований для розгортання на Netlify з підтримкою API Routes та in-memory базою даних.

## Ключові зміни для Netlify

### 1. In-Memory База Даних
- Файлова система не працює в Netlify Functions
- Реалізовано in-memory сховище для користувачів та запитів
- Автоматична ініціалізація з тестовими даними

### 2. Тестові Користувачі
Автоматично створюються:
- **Admin**: `admin@example.com` / `admin123`
- **Stepan**: `stepan@example.com` / `stepan123` (ID: stepan001)

## Конфігураційні файли

### 1. netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
  NEXT_PRIVATE_TARGET = "server"

[functions]
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/___netlify-handler"
  status = 200
  force = true
```

### 2. Оновлена База Даних (src/lib/db.ts)
- Автоматичне визначення Netlify середовища
- In-memory сховище замість файлової системи
- Ініціалізація з тестовими даними

## Кроки розгортання

1. **Підключіть репозиторій до Netlify:**
   - Увійдіть в Netlify Dashboard
   - Натисніть "New site from Git"
   - Виберіть ваш репозиторій

2. **Налаштування збірки:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18 (автоматично з .nvmrc)

3. **Змінні середовища:**
   ```
   NETLIFY=true (автоматично встановлюється)
   ```

## API Ендпоінти

Доступні маршрути:
- `GET /api/users/stepan001` - отримати користувача
- `GET /api/admin/requests` - список запитів реєстрації
- `POST /api/admin/requests` - створити запит реєстрації
- `GET /api/lessons/[id]` - отримати урок

## Важливі зауваження

- **Дані тимчасові**: При кожному перезапуску функції дані скидаються
- **Логування**: Розширене логування для діагностики
- **CORS**: Налаштований для всіх доменів
- **Автоініціалізація**: База даних ініціалізується автоматично

## Діагностика проблем

1. **Перевірте логи функцій** в Netlify Dashboard > Functions
2. **Тестові дані** завжди доступні після розгортання
3. **API відповіді** включають детальне логування
4. **Користувач stepan001** завжди існує для тестування

## Тестування після розгортання

```bash
# Тест API користувача
curl https://your-site.netlify.app/api/users/stepan001

# Тест API запитів
curl https://your-site.netlify.app/api/admin/requests
```

## Обмеження

- Дані не зберігаються між сесіями
- Для production потрібна зовнішня база даних
- In-memory сховище підходить тільки для демонстрації

## Наступні кроки

1. Зробіть commit та push змін до репозиторію
2. Netlify автоматично перезбудує сайт
3. Перевірте API ендпоінти після розгортання
4. Користувач `stepan001` буде доступний для тестування