@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка безопасности Cinematheque
echo ========================================
echo.

echo [1/3] Поиск подозрительных слов в коде...
git grep -n -i -E "password|secret|token|api_key|jwt|smtp|database_url" -- . ":!docs" ":!screenshots" ":!*.md" 2>nul
if errorlevel 1 (
    echo [OK] Явных секретов не найдено
) else (
    echo [!] Найдены совпадения — проверьте, что это примеры
)

echo.
echo [2/3] Проверка .gitignore...
findstr /C:".env" .gitignore >nul
if errorlevel 1 (
    echo [!] .env не добавлен в .gitignore!
) else (
    echo [OK] .env исключён из Git
)

echo.
echo [3/3] Проверка статуса репозитория...
git status --short
echo.
echo ========================================
echo Проверка завершена.
echo ========================================
pause
