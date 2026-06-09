@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Создание резервной копии Cinematheque
echo ========================================
echo.

if not exist backups mkdir backups

echo [1/3] Генерация имени файла...
for /f %%i in ('powershell -command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set TS=%%i
set BACKUP_NAME=backup_%TS%

echo [2/3] Копирование базы данных...
if exist backend\db.json (
    copy /Y backend\db.json "backups\%BACKUP_NAME%.json" >nul
    echo [OK] db.json скопирован
) else (
    echo [!] backend\db.json не найден! Запустите сервер, чтобы создать БД.
    pause
    exit /b 1
)

echo.
echo [3/3] Архивация...
powershell -Command "Compress-Archive -Path 'backups\%BACKUP_NAME%.json' -DestinationPath 'backups\%BACKUP_NAME%.zip' -Force"

if exist "backups\%BACKUP_NAME%.zip" (
    echo [OK] Архив создан: backups\%BACKUP_NAME%.zip
    del "backups\%BACKUP_NAME%.json"
) else (
    echo [!] Ошибка создания архива
)

echo.
echo ========================================
echo Готово! Используйте: scripts\restore.bat %BACKUP_NAME%.zip
echo ========================================
pause
