@echo off
chcp 65001 > nul
setlocal

echo ======================================================
echo    GeoHistory - Creation du package de distribution
echo ======================================================
echo.

set PYTHON_EXE=d:\skipple\Skipple-Api\venv\Scripts\python.exe

if not exist "%PYTHON_EXE%" (
    set PYTHON_EXE=python
)

"%PYTHON_EXE%" build_package.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERREUR] L'empaquetage a echoue.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ======================================================
echo    Fichier pret dans le dossier 'dist' !
echo ======================================================
echo.
pause
