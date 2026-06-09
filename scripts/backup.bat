@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Создание резервной копии Cinematheque
echo ========================================
echo.

if not exist backups mkdir backups

echo [1/3] Копирование базы данных...
if exist backend\db.json (
    for /f "tokens=2-4 delims=/ " %%a in ("%date%") do set DATE=%%c%%b%%a
    for /f "tokens=1-2 delims=:." %%a in ("%time%") do set TIME=%%a%%b
    set BACKUP_NAME=backup_%DATE%_%TIME%

    copy backend\db.json backups\%BACKUP_NAME%.json
    echo [OK] db.json скопирован
) else (
    echo [!] backend\db.json не найден!
)

echo.
echo [2/3] Архивация...
powershell -Command "if (Test-Path 'backups\%BACKUP_NAME%.json') { Compress-Archive -Path 'backups\%BACKUP_NAME%.json' -DestinationPath 'backups\%BACKUP_NAME%.zip' -Force }"

echo.
echo [3/3] Очистка временных файлов...
if exist backups\%BACKUP_NAME%.json del backups\%BACKUP_NAME%.json

echo.
echo ========================================
echo Бэкап создан: backups\%BACKUP_NAME%.zip
echo ========================================
dir backups\*.zip /O-D | findstr /C:"zip"
pause
