@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Восстановление из резервной копии
echo ========================================
echo.

if "%~1"=="" (
    echo Использование: restore.bat backup_YYYYMMDD_HHMM.zip
    echo Доступные бэкапы:
    dir backups\*.zip /O-D
    pause
    exit /b 1
)

set BACKUP_FILE=%1

echo [1/3] Проверка файла...
if not exist backups\%BACKUP_FILE% (
    echo [!] Файл не найден: backups\%BACKUP_FILE%
    pause
    exit /b 1
)
echo [OK] Файл найден

echo.
echo [2/3] Распаковка...
powershell -Command "Expand-Archive -Path 'backups\%BACKUP_FILE%' -DestinationPath 'backups\temp' -Force"

echo.
echo [3/3] Восстановление db.json...
if exist backups\temp\*.json (
    copy /Y backups\temp\*.json backend\db.json
    echo [OK] db.json восстановлен
    rmdir /s /q backups\temp
) else (
    echo [!] Ошибка восстановления
)

echo.
echo ========================================
echo Восстановление завершено!
echo ========================================
pause
