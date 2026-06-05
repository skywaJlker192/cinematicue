@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Форматирование кода (Prettier)
echo ========================================

echo.
echo Применяем единый стиль кода...
call npx prettier --write "**/*.{js,json,css,md,html}"

echo.
echo [OK] Код успешно отформатирован!
echo.
echo ========================================
pause
