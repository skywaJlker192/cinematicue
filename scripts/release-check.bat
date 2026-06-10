@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Финальная проверка перед релизом
echo ========================================
echo.

set ERRORS=0

echo [1/5] Проверка качества кода...
cd backend
call npm run lint --if-present
if errorlevel 1 (
    echo [FAIL] Линтер нашел ошибки
    set /a ERRORS+=1
) else (
    echo [OK] Линтер прошел успешно
)
cd ..

echo.
echo [2/5] Запуск тестов...
cd backend
call npm test --if-present
if errorlevel 1 (
    echo [FAIL] Тесты не прошли
    set /a ERRORS+=1
) else (
    echo [OK] Тесты прошли успешно
)
cd ..

echo.
echo [3/5] Сборка проекта...
cd backend
call npm run build --if-present
if errorlevel 1 (
    echo [FAIL] Сборка завершилась с ошибками
    set /a ERRORS+=1
) else (
    echo [OK] Сборка успешна
)
cd ..

echo.
echo [4/5] Проверка безопасности зависимостей...
cd backend
call npm audit --audit-level=high --if-present
if errorlevel 1 (
    echo [WARNING] Найдены уязвимости высокого уровня
    set /a ERRORS+=1
) else (
    echo [OK] Критических уязвимостей нет
)
cd ..

echo.
echo [5/5] Проверка наличия необходимых файлов...
if exist README.md (
    echo [OK] README.md найден
) else (
    echo [FAIL] README.md не найден
    set /a ERRORS+=1
)

if exist docs\CHANGELOG.md (
    echo [OK] CHANGELOG.md найден
) else (
    echo [FAIL] CHANGELOG.md не найден
    set /a ERRORS+=1
)

if exist docs\RELEASE_NOTES.md (
    echo [OK] RELEASE_NOTES.md найден
) else (
    echo [FAIL] RELEASE_NOTES.md не найден
    set /a ERRORS+=1
)

echo.
echo ========================================
if %ERRORS% EQU 0 (
    echo ✅ Project is ready for release!
    echo ========================================
) else (
    echo ❌ Найдено ошибок: %ERRORS%
    echo ========================================
    echo Исправьте ошибки перед релизом
)
echo ========================================

pause
exit /b %ERRORS%
