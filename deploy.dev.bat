@echo off
REM Development deployment script with hot reloading
echo 🚀 Starting Classroom App in DEVELOPMENT mode with hot reloading...

REM Stop and remove existing containers
echo 📦 Stopping existing development containers...
docker-compose -f docker-compose.dev.yml down

REM Build and start services
echo 🔨 Building and starting development services...
docker-compose -f docker-compose.dev.yml up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check service health
echo 🔍 Checking service health...
docker-compose -f docker-compose.dev.yml ps

echo ✅ Development deployment complete!
echo 🌐 Frontend (Hot Reload): http://localhost:3000
echo 🔗 Backend API (Hot Reload): http://localhost:5000
echo 🐛 Backend Debugger: localhost:9229
echo 🗄️  MongoDB: localhost:27017

echo.
echo 📊 To view logs:
echo   docker-compose -f docker-compose.dev.yml logs -f
echo.
echo 🔄 Hot reloading is enabled:
echo   - Frontend: Edit files in ./frontend/src and see changes instantly
echo   - Backend: Edit files in ./backend and server will restart automatically
echo.
echo 🛑 To stop development services:
echo   docker-compose -f docker-compose.dev.yml down

pause
