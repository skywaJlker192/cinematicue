# INCIDENT_REPORT.md

## 1. Инцидент
Ошибка при входе в систему: при вводе неверного пароля приложение падает с ошибкой "Cannot read properties of undefined (reading 'token')"

## 2. Где обнаружено
- **Среда:** Локальная разработка + deployed версия на Render.com
- **Дата обнаружения:** 09.06.2026
- **Компонент:** Frontend (форма авторизации)

## 3. Как воспроизвести
1. Открыть главную страницу проекта
2. Нажать кнопку "Войти"
3. Ввести корректный email: `test@mail.ru`
4. Ввести неверный пароль: `wrongpassword`
5. Нажать кнопку "ВОЙТИ"
6. **Результат:** Ошибка в консоли "Cannot read properties of undefined (reading 'token')"

## 4. Диагностика
**Проверенные логи и файлы:**
- Console DevTools: ошибка JavaScript на строке ~269 файла cinema.js
- Network tab: запрос POST /api/login возвращает 401 Unauthorized с телом `{"ok":false,"error":"Неверный пароль"}`
- Код обработки ответа: отсутствие проверки `response.ok` перед парсингом JSON

**Причина:**
Frontend-код пытается прочитать `data.token` из ответа, не проверяя успешность запроса. При 401 ответе сервер возвращает объект без поля `token`, что приводит к ошибке.

## 5. Исправление
**Измененные файлы:**
- `js/cinema.js` — добавлена проверка статуса ответа перед обращением к `token`

**Что изменено:**
```javascript
// Было:
const response = await fetch('/api/login', {...});
const data = await response.json();
const token = data.token;

// Стало:
const response = await fetch('/api/login', {...});
if (!response.ok) {
    const error = await response.json();
    alert(error.error || 'Ошибка входа');
    return;
}
const data = await response.json();
const token = data.token;
