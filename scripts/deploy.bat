@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Production-развертывание Cinematheque
echo ========================================
echo.

echo [1/3] Проверка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [!] Node.js не установлен!
    pause
    exit /b 1
)
echo [OK] Node.js найден

echo.
echo [2/3] Установка зависимостей...
cd backend
call npm install --production
if errorlevel 1 (
    echo [!] Ошибка установки зависимостей!
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Запуск сервера в production-режиме...
echo.
echo Приложение будет доступно: http://localhost:3001
echo Для остановки нажмите Ctrl+C
echo.

cd backend
set NODE_ENV=production
call node server.js
