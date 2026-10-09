@echo off
chcp 65001 > nul
echo Generation des icones PNG pour l'extension GeoHistory...
"d:\skipple\Skipple-Api\venv\Scripts\python.exe" create_icons.py
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Icones icon16.png, icon48.png et icon128.png generees avec succes dans le dossier icons/ !
) else (
    echo.
    echo [ERREUR] Impossible de generer les icones PNG.
)
pause
