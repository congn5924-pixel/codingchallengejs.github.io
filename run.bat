@echo off
setlocal

set "PORT=%~1"
if "%PORT%"=="" set "PORT=8000"

echo Serving %CD% on http://localhost:%PORT%

start http://localhost:%PORT%
where python >nul 2>&1
if %ERRORLEVEL%==0 (
    python -m http.server %PORT%
    exit /b
)

where node >nul 2>&1
if %ERRORLEVEL%==0 (
    npx http-server -p %PORT% .
    exit /b
)

echo.
echo No Python or Node detected.
exit /b 1