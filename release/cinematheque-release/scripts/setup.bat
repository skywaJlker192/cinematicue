@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Установка зависимостей Cinematheque
echo ========================================

echo.
echo [1/2] Установка frontend зависимостей...
if exist package.json (
    npm install
) else (
    echo package.json не найден в корне проекта
)

echo.
echo [2/2] Установка backend зависимостей...
if exist backend\package.json (
    cd backend
    npm install
    cd ..
) else (
    echo backend/package.json не найден
)

echo.
echo ========================================
echo Установка завершена!
echo ========================================
