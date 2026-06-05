@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Перезапуск Cinematheque
echo ========================================
echo.

echo [1/3] Остановка текущего процесса Node.js...
taskkill /F /IM node.exe 2>nul
if errorlevel 1 (
    echo [!] Node.js не был запущен
) else (
    echo [OK] Node.js остановлен
)

timeout /t 2 /nobreak >nul

echo.
echo [2/3] Очистка кэша...
if exist backend\node_modules (
    echo [OK] node_modules найден
) else (
    echo [!] node_modules отсутствует, будет переустановлен
)

echo.
echo [3/3] Повторный запуск...
echo.
echo Приложение будет доступно: http://localhost:3001
echo Для остановки нажмите Ctrl+C
echo.

cd backend
set NODE_ENV=production
call node server.js
