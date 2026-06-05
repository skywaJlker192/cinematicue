@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Логи Cinematheque
echo ========================================

docker compose logs -f
