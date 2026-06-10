@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Запуск тестов и проверок Cinematheque
echo ========================================
echo.

echo [1/3] Проверка структуры проекта...
if exist backend\server.js (
    echo [OK] backend/server.js найден
) else (
    echo [ERROR] backend/server.js не найден!
    exit /b 1
)

if exist package.json (
    echo [OK] package.json найден
) else (
    echo [ERROR] package.json не найден!
    exit /b 1
)

echo.
echo [2/3] Запуск тестов backend...
cd backend
if exist package.json (
    call npm test
    if errorlevel 1 (
        echo [WARNING] Тесты не прошли или не настроены
    ) else (
        echo [OK] Тесты пройдены успешно
    )
) else (
    echo [WARNING] package.json не найден в backend/
)

cd ..

echo.
echo [3/3] Проверка качества кода...
cd backend
if exist package.json (
    call npm run lint --if-present
    if errorlevel 1 (
        echo [WARNING] Линтер нашел проблемы
    ) else (
        echo [OK] Линтер не нашел ошибок
    )
)

cd ..

echo.
echo ========================================
echo Проверка завершена!
echo ========================================
pause
