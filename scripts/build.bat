@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Сборка проекта Cinematheque
echo ========================================
echo.

echo [1/3] Проверка зависимостей...
cd backend
if exist package.json (
    call npm install
    if errorlevel 1 (
        echo [ERROR] Ошибка установки зависимостей!
        exit /b 1
    )
    echo [OK] Зависимости установлены
) else (
    echo [ERROR] package.json не найден!
    exit /b 1
)

echo.
echo [2/3] Сборка проекта...
if exist package.json (
    call npm run build --if-present
    if errorlevel 1 (
        echo [WARNING] Сборка завершилась с предупреждениями
    ) else (
        echo [OK] Сборка завершена успешно
    )
)

echo.
echo [3/3] Создание release-архива...
cd ..
if not exist release mkdir release

for /f "tokens=2-4 delims=/ " %%a in ("%date%") do set DATE=%%c%%b%%a
for /f "tokens=1-2 delims=:." %%a in ("%time%") do set TIME=%%a%%b

set ARCHIVE_NAME=cinematicue-release_%DATE%_%TIME%.zip

powershell -Command "Compress-Archive -Path '.\*' -DestinationPath '.\release\%ARCHIVE_NAME%' -Exclude 'node_modules','release','*.git*','backups','logs'"

if exist release\%ARCHIVE_NAME% (
    echo [OK] Release-архив создан: release\%ARCHIVE_NAME%
) else (
    echo [ERROR] Ошибка создания архива!
)

echo.
echo ========================================
echo Сборка завершена!
echo ========================================
pause
