@echo off
echo 🛑 Stopping all servers...

:: Kill Llama.cpp server
taskkill /F /IM llama-server.exe >nul 2>&1

:: Kill backend Node.js server
taskkill /F /IM node.exe >nul 2>&1

:: Kill frontend React dev server (npm start runs under node.exe too)
taskkill /F /IM node.exe >nul 2>&1

echo ✅ All servers stopped.
pause