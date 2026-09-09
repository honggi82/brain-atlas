@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22.13 or later is required. Install it from https://nodejs.org/
  pause
  exit /b 1
)
where python >nul 2>nul
if errorlevel 1 (
  echo Python 3 is required. Install it from https://www.python.org/
  pause
  exit /b 1
)
if not exist node_modules (
  call npm.cmd ci
  if errorlevel 1 exit /b 1
)
call npm.cmd run build
if errorlevel 1 (
  pause
  exit /b 1
)
if /I "%~1"=="--no-open" (
  python scripts/serve.py
) else (
  python scripts/serve.py --open
)
if errorlevel 1 pause
