@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Запуск Cinematheque
echo ========================================

echo.
echo [Backend] Запуск сервера на порту 3001...
echo.

cd backend
call npm start
