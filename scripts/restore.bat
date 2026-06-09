@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Восстановление из резервной копии
echo ========================================
echo.

if "%~1"=="" (
    echo Использование: restore.bat backup_YYYYMMDD_HHMMSS.zip
    echo.
    echo Доступные бэкапы:
    dir backups\*.zip /B /O-D
    pause
    exit /b 1
)

set BACKUP_FILE=%1

echo [1/3] Проверка файла...
if not exist "backups\%BACKUP_FILE%" (
    echo [!] Файл не найден: backups\%BACKUP_FILE%
    echo Проверьте имя файла (должно заканчиваться на .zip)
    pause
    exit /b 1
)
echo [OK] Файл найден: %BACKUP_FILE%

echo.
echo [2/3] Распаковка...
if exist backups\temp rmdir /s /q backups\temp
mkdir backups\temp
powershell -Command "Expand-Archive -Path 'backups\%BACKUP_FILE%' -DestinationPath 'backups\temp' -Force"

echo.
echo [3/3] Восстановление db.json...
if exist backups\temp\*.json (
    copy /Y backups\temp\*.json backend\db.json
    echo [OK] db.json восстановлен
    rmdir /s /q backups\temp
) else (
    echo [!] Ошибка: JSON файл не найден в архиве
    rmdir /s /q backups\temp
    pause
    exit /b 1
)

echo.
echo ========================================
echo Восстановление завершено!
echo Запустите сервер и проверьте данные.
echo ========================================
pause
