# DEPLOYMENT.md — Развертывание Cinematheque

## 1. Где развернут проект
Вариант: PaaS (Render.com)
Адрес: https://cinematheque.onrender.com

## 2. Требования
- GitHub-аккаунт
- Render.com-аккаунт
- Node.js 16+ (для локальной разработки)

## 3. Команды развертывания
Развертывание происходит автоматически через Render при push в ветку main.

Локальный production-запуск:
```bash
git clone https://github.com/skywaJlker192/cinematicue.git
cd cinematicue
cp .env.production.example .env.production
cd backend
npm install
npm start
