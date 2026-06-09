@echo off
chcp 65001 > nul
cd /d "%~dp0\..\backend"

echo ========================================
echo Проверка зависимостей (npm audit)
echo ========================================
echo.

echo [1/2] Проверка уязвимостей...
npm audit --audit-level=moderate
if errorlevel 1 (
    echo.
    echo [!] Найдены уязвимости
) else (
    echo [OK] Критических уязвимостей не найдено
)

echo.
echo [2/2] Проверка устаревших пакетов...
npm outdated
echo.
echo ========================================
echo Проверка завершена.
echo ========================================
pause
