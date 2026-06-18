# CHANGELOG.md

Все изменения проекта Cinematheque.

Формат дат: YYYY-MM-DD

---

## [0.1.1] - 2026-06-10

### Fixed
- Исправлена критическая ошибка при входе с неверным паролем (#12)
  - Добавлена проверка `response.ok` перед парсингом JSON
  - Добавлены понятные сообщения об ошибках для пользователя
  - Исправлена обработка undefined token в cinema.js

### Added
- GitHub Actions CI/CD workflow (#15)
  - Автоматическая проверка при push и pull request
  - Установка зависимостей и запуск тестов
  - Сборка проекта
- BAT-скрипты для автоматизации:
  - `test.bat` — запуск тестов
  - `build.bat` — сборка проекта
  - `release-check.bat` — финальная проверка перед релизом
  - `create-release.bat` — создание релизного архива
- INCIDENT_REPORT.md для документирования инцидентов
- RELEASE_NOTES.md для описания релизов
- RELEASE_CHECKLIST.md для проверки перед релизом

### Changed
- Улучшена обработка ошибок в API (#14)
- Обновлены зависимости:
  - express: 4.21.0 → 4.21.2 (security fix)
  - cors: 2.8.5 (без изменений)
- Улучшена структура проекта

### Verified
- Локальные проверки: `make check`, `scripts\test.bat`
- CI: GitHub Actions passed ✅
- Ручная проверка сценариев: вход, регистрация, бронирование
- Проверка логов: критических ошибок нет

---

## [0.1.0] - 2026-06-05

### Added
- Первоначальный релиз проекта
- Frontend: каталог фильмов, схема зала, форма оплаты
- Backend: REST API на Node.js + Express
- Авторизация через JWT
- Развертывание на Render.com
- Базовая документация

### Changed
- Настроена структура проекта
- Добавлены .env.example и .gitignore

---

**Ссылки:**
- [0.1.1]: https://github.com/skywaJlker192/cinematicue/compare/v0.1.0...v0.1.1
- [0.1.0]: https://github.com/skywaJlker192/cinematicue/releases/tag/v0.1.0
