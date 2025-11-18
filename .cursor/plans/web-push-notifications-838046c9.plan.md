<!-- 838046c9-2b8f-4a1d-a01a-253b770b3d55 3231cdd5-85ba-44ae-9af0-cc7be8075019 -->
# News & Announcements System

## Огляд

Створення системи новин для відображення важливих анонсів та оновлень курсу. Новини відображаються як спливаючі banneri на головній сторінці з badge непрочитаних.

## Технічна реалізація

### 1. База даних (Supabase)

**Таблиця `announcements`:**

- `id` (UUID) - унікальний ID
- `title` (TEXT) - заголовок новини
- `content` (TEXT) - текст новини
- `image_url` (TEXT, nullable) - посилання на фото
- `created_at` - дата створення
- `created_by` (UUID) - ID адміна який створив

**Таблиця `user_read_announcements`:**

- `id` (UUID) - унікальний ID
- `user_id` (UUID) - ID користувача
- `announcement_id` (UUID) - ID новини
- `read_at` - коли прочитано
- Unique constraint на (user_id, announcement_id)

### 2. Типи TypeScript

**Файл:** `src/types/announcements.ts`

- Інтерфейси: Announcement, UserReadAnnouncement
- CreateAnnouncementRequest, AnnouncementWithReadStatus

### 3. API Endpoints

**GET `/api/announcements`** - отримати всі новини з позначками read/unread для користувача

**POST `/api/announcements`** - створити новину (тільки адмін)

**DELETE `/api/announcements/[id]`** - видалити новину (тільки адмін)

**POST `/api/announcements/[id]/mark-read`** - позначити новину як прочитану

### 4. Компоненти

**`src/components/AnnouncementBanner.tsx`:**

- Спливаючий banner з новиною
- Показує одну новину за раз
- Кнопка "Mark as Read" і "Next" для наступної
- Кнопка закриття (X)
- Автоматично показується при завантаженні сторінки якщо є непрочитані

**`src/components/AnnouncementsList.tsx`:**

- Список всіх новин (модальне вікно або окрема сторінка)
- Позначка прочитано/не прочитано
- Фільтрація

**`src/components/AnnouncementsButton.tsx`:**

- Кнопка з іконкою Bell в header
- Badge з кількістю непрочитаних
- При кліку відкриває AnnouncementsList

### 5. Admin Panel розширення

**Оновлення:** `src/components/AdminPanel.tsx`

- Додати новий таб "Announcements"
- Форма створення новини:
  - Title (input)
  - Content (textarea)
  - Image URL (input, optional)
  - Upload image (optional)
- Список існуючих новин з можливістю видалення
- Показувати статистику: скільки користувачів прочитали

### 6. Інтеграція на головну сторінку

**Оновлення:** `src/app/page.tsx`

- Додати AnnouncementsButton в header поруч з іменем користувача
- Додати AnnouncementBanner компонент
- Завантажувати непрочитані новини при mount

### 7. Context для новин (опційно)

**Файл:** `src/contexts/AnnouncementsContext.tsx`

- Глобальний стан новин
- Функції: loadAnnouncements, markAsRead, getUnreadCount
- Provider для всього додатку

## SQL Міграція

**Файл:** `announcements-migration.sql`

```sql
CREATE TABLE announcements (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE user_read_announcements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, announcement_id)
);

-- RLS policies
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_read_announcements ENABLE ROW LEVEL SECURITY;
```

## UI/UX деталі

**AnnouncementBanner:**

- Позиція: fixed top або після header
- Анімація: slide-down при появі
- Стиль: червоно-чорна тема проекту
- Можливість закрити тимчасово (не позначаючи прочитаним)
- Автопоказ наступної новини якщо є декілька

**Badge:**

- Червоний кружок з числом
- Максимум показувати 99+
- Зникає коли всі прочитані

## Ключові файли

### Нові:

- `src/types/announcements.ts`
- `src/components/AnnouncementBanner.tsx`
- `src/components/AnnouncementsList.tsx`
- `src/components/AnnouncementsButton.tsx`
- `src/contexts/AnnouncementsContext.tsx` (опційно)
- `src/app/api/announcements/route.ts`
- `src/app/api/announcements/[id]/route.ts`
- `src/app/api/announcements/[id]/mark-read/route.ts`
- `announcements-migration.sql`

### Оновлені:

- `src/app/page.tsx` - додати AnnouncementsButton та AnnouncementBanner
- `src/components/AdminPanel.tsx` - додати таб Announcements

### To-dos

- [ ] Створити TypeScript типи для announcements
- [ ] Створити SQL міграцію для таблиць announcements
- [ ] Створити GET API для отримання новин
- [ ] Створити POST API для створення новин (admin)
- [ ] Створити DELETE API для видалення новин
- [ ] Створити API для позначення новини прочитаною
- [ ] Створити компонент AnnouncementBanner
- [ ] Створити компонент AnnouncementsList
- [ ] Створити компонент AnnouncementsButton з badge
- [ ] Додати таб Announcements в Admin Panel
- [ ] Інтегрувати компоненти на головну сторінку