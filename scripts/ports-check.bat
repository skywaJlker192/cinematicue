@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка открытых портов
echo ========================================
echo.

echo [1/2] Docker-контейнеры...
docker compose ps 2>nul
if errorlevel 1 (
    echo [!] Docker Compose не запущен
)

echo.
echo [2/2] Порты Windows...
netstat -ano | findstr LISTENING | findstr :3001
if errorlevel 1 (
    echo [!] Порт 3001 не слушается
) else (
    echo [OK] Порт 3001 активен
)

echo.
echo ========================================
echo Проверка завершена.
echo ========================================
pause
