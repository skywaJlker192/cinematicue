@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка логов на критические ошибки
echo ========================================
echo.

echo [1/2] Поиск ошибок в логах...
if exist logs\ (
    findstr /C:"ERROR" /C:"FATAL" /C:"500" logs\*.log 2>nul
    if errorlevel 1 (
        echo [OK] Критических ошибок не найдено
    ) else (
        echo [!] Найдены ошибки
    )
) else (
    echo [!] Папка logs/ не найдена
)

echo.
echo [2/2] Проверка логов Render...
echo Откройте панель Render и проверьте вкладку Logs
echo ========================================
pause
