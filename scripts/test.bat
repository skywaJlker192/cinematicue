@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Smoke-тесты Cinematheque
echo ========================================

echo.
echo [1/3] Проверка структуры файлов...
if exist index.html (echo [OK] index.html) else (echo [ERROR] index.html not found)
if exist cinema.html (echo [OK] cinema.html) else (echo [ERROR] cinema.html not found)
if exist backend\server.js (echo [OK] server.js) else (echo [ERROR] server.js not found)

echo.
echo [2/3] Проверка API...
curl -s https://cinematicue.onrender.com/api/cinemas | findstr /C:"id" >nul
if errorlevel 1 (
    echo [ERROR] API не отвечает
) else (
    echo [OK] API отвечает
)

echo.
echo [3/3] Проверка завершена!
echo ========================================
pause
