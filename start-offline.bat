@echo off
echo Starting Freelancer Finans Takip (Offline Mode)
cd /d "%~dp0frontend/build"
python -m http.server 8080
pause