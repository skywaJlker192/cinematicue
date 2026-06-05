@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Сборка release-архива Cinematheque
echo ========================================
echo.

echo [1/5] Остановка процессов Node.js...
taskkill /F /IM node.exe 2>nul
if errorlevel 1 (
    echo [OK] Node.js не был запущен
) else (
    echo [OK] Node.js остановлен
)

echo.
echo [2/5] Очистка временных файлов...
if exist backend\node_modules (
    echo Удаление backend\node_modules...
    rmdir /s /q backend\node_modules 2>nul
    if exist backend\node_modules (
        echo [!] Не удалось удалить node_modules. Закрой VS Code и антивирус, затем повтори.
    ) else (
        echo [OK] backend\node_modules удалён
    )
)

if exist release (
    echo Удаление старой папки release...
    rmdir /s /q release 2>nul
)

echo.
echo [3/5] Создание папки release\cinematheque-release...
mkdir release\cinematheque-release

echo.
echo [4/5] Копирование файлов проекта...
echo Копирование HTML/CSS/JS...
xcopy /E /I /Y /Q index.html cinema.html about.html contacts.html release\cinematheque-release\ 2>nul
xcopy /E /I /Y /Q css\ release\cinematheque-release\css\ 2>nul
xcopy /E /I /Y /Q js\ release\cinematheque-release\js\ 2>nul
xcopy /E /I /Y /Q images\ release\cinematheque-release\images\ 2>nul

echo Копирование backend...
xcopy /E /I /Y /Q backend\server.js release\cinematheque-release\backend\ 2>nul
xcopy /E /I /Y /Q backend\package.json release\cinematheque-release\backend\ 2>nul
xcopy /E /I /Y /Q backend\db.json release\cinematheque-release\backend\ 2>nul

echo Копирование документов...
xcopy /E /I /Y /Q README.md DEPLOYMENT.md DEMO_GUIDE.md RELEASE_NOTES.md .env.example .env.production.example release\cinematheque-release\ 2>nul
xcopy /E /I /Y /Q scripts\ release\cinematheque-release\scripts\ 2>nul
xcopy /E /I /Y /Q docs\ release\cinematheque-release\docs\ 2>nul

echo.
echo [5/5] Создание ZIP-архива...
powershell -Command "if (Test-Path 'release\cinematheque-release') { Compress-Archive -Path 'release\cinematheque-release\*' -DestinationPath 'release\cinematheque-release.zip' -Force; Write-Host 'Архив создан успешно' } else { Write-Host 'Ошибка: папка не найдена' }"

echo.
echo ========================================
if exist release\cinematheque-release.zip (
    echo Release-архив создан: release\cinematheque-release.zip
    dir release\cinematheque-release.zip
) else (
    echo [!] Ошибка создания архива
)
echo ========================================
pause
