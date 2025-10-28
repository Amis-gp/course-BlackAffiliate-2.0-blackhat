# 📢 Announcements System - Setup Guide

## Що було реалізовано:

✅ Система новин/анонсів для всіх користувачів
✅ Спливаючі banner з новинами на головній сторінці
✅ Відстеження прочитаних/непрочитаних новин
✅ Badge з кількістю непрочитаних
✅ Admin Panel для створення та видалення новин
✅ Підтримка зображень в новинах

## 🚀 Швидкий старт:

### Крок 1: Виконайте SQL міграцію в Supabase

1. Відкрийте ваш Supabase проект: https://supabase.com/dashboard
2. Перейдіть в **SQL Editor**
3. Натисніть **New Query**
4. Скопіюйте SQL з файлу `announcements-migration.sql` або з нижче:

```sql
-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create user_read_announcements table
CREATE TABLE IF NOT EXISTS user_read_announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_announcement UNIQUE(user_id, announcement_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_read_announcements_user_id ON user_read_announcements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_read_announcements_announcement_id ON user_read_announcements(announcement_id);

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_read_announcements ENABLE ROW LEVEL SECURITY;

-- Policies for announcements
DROP POLICY IF EXISTS "Anyone can view announcements" ON announcements;
CREATE POLICY "Anyone can view announcements" ON announcements
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can create announcements" ON announcements;
CREATE POLICY "Admins can create announcements" ON announcements
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Admins can delete announcements" ON announcements;
CREATE POLICY "Admins can delete announcements" ON announcements
  FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Policies for user_read_announcements
DROP POLICY IF EXISTS "Users can view their own read status" ON user_read_announcements;
CREATE POLICY "Users can view their own read status" ON user_read_announcements
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark announcements as read" ON user_read_announcements;
CREATE POLICY "Users can mark announcements as read" ON user_read_announcements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all read statuses" ON user_read_announcements;
CREATE POLICY "Admins can view all read statuses" ON user_read_announcements
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
```

5. Натисніть **Run** або `Cmd/Ctrl + Enter`

### Крок 2: Перевірте створення таблиць

Виконайте для перевірки:

```sql
SELECT * FROM announcements;
SELECT * FROM user_read_announcements;
```

Повинні з'явитися порожні таблиці.

### Крок 3: Перезапустіть сервер

```bash
npm run dev
```

## 📋 Як користуватися:

### Для адміна:

1. Увійдіть в систему як адміністратор
2. Перейдіть в **Admin Panel**
3. Виберіть вкладку **Announcements**
4. Заповніть форму:
   - **Title**: Заголовок новини
   - **Content**: Текст новини (підтримує багаторядковий текст)
   - **Image URL** (опційно): посилання на зображення
5. Натисніть **Create Announcement**

### Для користувачів:

**Спливаючий banner:**
- Автоматично з'являється на головній сторінці якщо є непрочитані новини
- Показує одну новину за раз
- Кнопки:
  - **Mark as Read** - позначити як прочитану і перейти до наступної
  - **Next** - перейти до наступної (якщо є)
  - **X** - закрити banner (можна відкрити знову через кнопку дзвіночка)

**Кнопка дзвіночка:**
- Знаходиться в header поруч із заголовком "Black Affiliate"
- Показує badge з кількістю непрочитаних новин
- При кліку відкриває список всіх новин

**Список новин:**
- Показує всі новини (нові та прочитані)
- Непрочитані виділені червоною лінією зліва
- Можна позначити як прочитану клацнувши по іконці кола
- Прочитані мають сіру лінію та галочку

## 🎨 UI/UX Features:

- **Червоно-чорна тема** проекту
- **Анімація slide-down** для банера
- **Badge** з кількістю непрочитаних
- **Адаптивний дизайн** для мобільних пристроїв
- **Підтримка зображень** в новинах
- **Українська локалізація** дат

## 📂 Створені файли:

### Типи:
- `src/types/announcements.ts`

### Компоненти:
- `src/components/AnnouncementBanner.tsx` - спливаючий banner
- `src/components/AnnouncementsList.tsx` - список новин
- `src/components/AnnouncementsButton.tsx` - кнопка з badge

### API:
- `src/app/api/announcements/route.ts` - GET (список), POST (створення)
- `src/app/api/announcements/[id]/route.ts` - DELETE (видалення)
- `src/app/api/announcements/[id]/mark-read/route.ts` - POST (позначити прочитаним)

### Оновлені файли:
- `src/app/page.tsx` - інтеграція компонентів
- `src/components/AdminPanel.tsx` - таб Announcements
- `src/app/globals.css` - анімація slide-down

### SQL:
- `announcements-migration.sql` - міграція бази даних

## 🔒 Безпека:

- ✅ Тільки адміни можуть створювати/видаляти новини
- ✅ Всі користувачі можуть читати новини
- ✅ Користувачі бачать тільки свої read statuses
- ✅ Row Level Security захищає дані
- ✅ Cascade delete при видаленні користувача

## ✨ Функціонал:

- ✅ Створення новин адміном
- ✅ Видалення новин адміном
- ✅ Автоматичний показ непрочитаних новин
- ✅ Badge з кількістю непрочитаних
- ✅ Позначення як прочитані
- ✅ Список всіх новин
- ✅ Підтримка зображень (опційно)
- ✅ Багаторядковий текст з пробілами
- ✅ Адаптивний дизайн

## 🎯 Приклади використання:

### Анонс нового уроку:
```
Title: New Lesson Available - Module 3
Content: We've just released a new lesson on traffic arbitrage! 
Check it out in Module 3.
Image URL: https://example.com/lesson-preview.jpg
```

### Важливе оновлення:
```
Title: Important Update
Content: The course schedule has been updated. 
Please check your dashboard for new lesson dates.
Image URL: (optional)
```

### Нагадування:
```
Title: Don't Forget Your Homework!
Content: Homework for Module 2 is due this Friday. 
Make sure to submit it on time!
```

---

**Готово!** Система новин повністю працездатна та готова до використання. 🎉

Користувачі будуть отримувати сповіщення про важливі оновлення курсу!

