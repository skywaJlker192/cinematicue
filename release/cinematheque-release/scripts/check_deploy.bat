@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка развертывания Cinematheque
echo ========================================
echo.

echo [1/4] Проверка процесса Node.js...
tasklist | findstr /C:"node.exe" >nul
if errorlevel 1 (
    echo [!] Node.js не запущен!
    echo Запустите: scripts\deploy.bat
    pause
    exit /b 1
) else (
    echo [OK] Node.js запущен
)

echo.
echo [2/4] Проверка порта 3001...
netstat -ano | findstr ":3001" | findstr "LISTENING" >nul
if errorlevel 1 (
    echo [!] Порт 3001 не слушается!
    pause
    exit /b 1
) else (
    echo [OK] Порт 3001 активен
)

echo.
echo [3/4] Проверка API...
curl -s http://localhost:3001/api/cinemas | findstr /C:"id" >nul
if errorlevel 1 (
    echo [!] API недоступен или возвращает ошибку!
    pause
    exit /b 1
) else (
    echo [OK] API отвечает корректно
)

echo.
echo [4/4] Проверка структуры файлов...
if exist index.html (echo [OK] index.html) else (echo [!] index.html не найден)
if exist cinema.html (echo [OK] cinema.html) else (echo [!] cinema.html не найден)
if exist backend\server.js (echo [OK] backend\server.js) else (echo [!] server.js не найден)

echo.
echo ========================================
echo Все проверки пройдены!
echo Приложение доступно: http://localhost:3001
echo ========================================
pause
