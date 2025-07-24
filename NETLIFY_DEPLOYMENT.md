# Розгортання на Netlify - Фінальна версія

Цей проект налаштований для розгортання на Netlify. Всі конфігурації оптимізовані для автоматичної роботи з плагіном `@netlify/plugin-nextjs`.

## Ключові виправлення

### 1. Переміщення файлів уроків
- **Проблема**: API не міг знайти файли уроків у `src/data/lessons/` в безсерверному середовищі Netlify
- **Рішення**: Перемістили всі файли уроків з `src/data/lessons/` до `public/lessons/`
- **Причина**: Файли в `public/` директорії доступні як статичні ресурси в Netlify Functions

### 2. Оновлення API з розширеним логуванням
- **Файл**: `src/app/api/lessons/[id]/route.ts`
- **Зміни**: 
  - Додано множинні шляхи пошуку файлів для різних середовищ
  - Розширене логування для діагностики проблем на Netlify
  - Обробка різних шляхів: `public/lessons/`, `.next/static/lessons/`, `/var/task/public/lessons/`
  - Детальна інформація про середовище виконання (CWD, __dirname, Netlify env)

### 3. Конфігурація Next.js
- **Файл**: `next.config.js`
- **Додано**: 
  - Webpack конфігурація для серверних модулів
  - Headers для API кешування
  - Підтримка Netlify Functions

### 4. Конфігурація Netlify
- **Файл**: `netlify.toml`
- **Створено**: Повна конфігурація для Netlify Functions та статичних файлів
- **Оновлено**: Додано `base = "."` для правильного визначення кореневої директорії
- **Оновлено**: Видалено `NPM_FLAGS` для уникнення конфліктів

### 5. Базові виправлення
- **Видалено `rewrites` з `next.config.js`**: Усунуто конфлікт з плагіном Netlify
- **Видалено `redirects` з `netlify.toml`**: Маршрутизація API повністю керується плагіном
- **In-Memory База Даних**: Забезпечує роботу API на read-only файловій системі Netlify

## Конфігураційні файли

### 1. `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
```

### 2. `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

## Структура файлів уроків

Файли уроків тепер знаходяться в каталозі `public/lessons/` і мають наступну структуру:
- `lesson-1-1.md`
- `lesson-1-2.md`
- `homework-1-1.md`
- тощо...

API автоматично знаходить файл за `lessonId` без необхідності вказувати повний шлях.

## Наступні кроки для розгортання

1. **Зробіть `commit` та `push`** всіх останніх змін до вашого GitHub репозиторію.
2. **Netlify автоматично запустить нову збірку** та розгорне оновлену версію сайту.
3. **Перевірте API ендпоінти** після завершення розгортання. Помилки 500 мають зникнути.

## Тестування після розгортання

Використовуйте `curl` або ваш браузер для перевірки:

```bash
# Перевірка API користувача (має повернути дані користувача Stepan)
curl https://your-site.netlify.app/api/users/stepan001

# Перевірка API запитів (має повернути порожній масив)
curl https://your-site.netlify.app/api/admin/requests

# Перевірка API уроку (має повернути вміст уроку з заголовками)
curl https://your-site.netlify.app/api/lessons/lesson-1-1/
```

## Важливі зміни в API уроків

- API тепер використовує файли з каталогу `public/lessons/`
- Додано перевірку існування файлу перед читанням
- Покращено обробку помилок з детальним логуванням
- Усі URL API уроків повинні закінчуватися на `/` (trailing slash)

Якщо проблеми залишаться, перевірте логи функцій безпосередньо в дашборді Netlify для отримання детальної інформації про помилки під час виконання.