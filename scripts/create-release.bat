@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Создание релиза Cinematheque
echo ========================================
echo.

set /p VERSION="Введите номер версии (например, 0.1.1): "

if "%VERSION%"=="" (
    echo [ERROR] Версия не указана!
    exit /b 1
)

echo.
echo [1/4] Создание Git-тега...
git tag -a v%VERSION% -m "Release v%VERSION%"
if errorlevel 1 (
    echo [WARNING] Тег уже существует или ошибка git
) else (
    echo [OK] Тег v%VERSION% создан
)

echo.
echo [2/4] Создание release-папки...
if not exist release rmdir /s /q release
mkdir release

echo.
echo [3/4] Копирование файлов проекта...
xcopy /E /I /EXCLUDE:release-exclude.txt . release\cinematicue-v%VERSION%\
if errorlevel 1 (
    echo [WARNING] Некоторые файлы не скопированы
)

echo.
echo [4/4] Создание ZIP-архива...
powershell -Command "Compress-Archive -Path 'release\cinematicue-v%VERSION%\*' -DestinationPath 'release\cinematicue-v%VERSION%.zip' -Force"

if exist release\cinematicue-v%VERSION%.zip (
    echo [OK] Архив создан: release\cinematicue-v%VERSION%.zip
    rmdir /s /q release\cinematicue-v%VERSION%\
) else (
    echo [ERROR] Ошибка создания архива!
)

echo.
echo ========================================
echo Release v%VERSION% создан!
echo ========================================
echo.
echo Следующие шаги:
echo 1. git push origin v%VERSION%
echo 2. Создать GitHub Release на странице тегов
echo 3. Приложить архив release\cinematicue-v%VERSION%.zip
echo ========================================

pause
