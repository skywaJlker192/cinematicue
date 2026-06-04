@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Запуск Cinematheque в Docker
echo ========================================

docker compose up --build
