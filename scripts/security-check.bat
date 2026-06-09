@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка безопасности Cinematheque
echo ========================================
echo.

echo [1/3] Поиск реальных секретов в коде...
git grep -n -i -E "password|secret|token|api_key|jwt|smtp|database_url" -- . ":!node_modules" ":!backups" ":!screenshots" ":!docs" ":!*.md" ":!*.py" ":!*.json" ":!*.html" ":!*.css" ":!*.bat" 2>nul
if errorlevel 1 (
    echo [OK] Явных секретов в исходном коде не найдено
) else (
    echo [!] Найдены совпадения. Если это примеры/хеши/поля форм — всё в порядке.
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
echo [3/3] Проверка индекса Git на наличие .env...
git ls-files --error-unmatch .env >nul 2>&1
if errorlevel 1 (
    echo [OK] .env не отслеживается Git
) else (
    echo [!] Внимание: .env находится в Git! Удалите: git rm --cached .env
)

echo.
echo ========================================
echo Проверка завершена.
echo Примечание: Хеши в db.json ($2b$10$...) и поля форм в HTML безопасны.
echo ========================================
pause
