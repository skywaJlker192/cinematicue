@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка качества кода (ESLint)
echo ========================================

echo.
echo [1/2] Проверка frontend JS...
call npx eslint js/ --ext .js

echo.
echo [2/2] Проверка backend JS...
call npx eslint backend/ --ext .js

if errorlevel 1 (
    echo.
    echo [!] Найдены ошибки линтера. Исправьте код.
    pause
    exit /b 1
)

echo.
echo [OK] Линтер не нашел критических ошибок!
echo.
echo ========================================
pause
