@echo off
echo 🚀 Starting all servers...

:: Start Llama.cpp server
echo 🔹 Starting Llama.cpp server on port 8080...
start cmd /k "cd C:\Users\sunay\llama.cpp\build\bin\Release && llama-server.exe --port 8080 --model C:\Users\sunay\models\Llama-3.2-3B-Instruct-Q4_K_M.gguf --threads 8"

:: Start backend server
echo 🔹 Starting backend server on port 5000...
start cmd /k "cd C:\Users\sunay\chat-board\backend && node index.js"

:: Start frontend React app
echo 🔹 Starting frontend React app on port 3000...
start cmd /k "cd C:\Users\sunay\Documents\my-react-app && npm start"

echo ✅ All servers launched in separate terminals.
pause