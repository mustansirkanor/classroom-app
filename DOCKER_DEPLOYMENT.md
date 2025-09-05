# Classroom App - Docker Deployment Guide

This guide explains how to deploy the Classroom App using Docker and Docker Compose.

## 🏗️ Architecture

The application consists of three main services:
- **Frontend**: React application served by Nginx (Port 80)
- **Backend**: Node.js/Express API server (Port 5000)
- **Database**: MongoDB (Port 27017)

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- Git (to clone the repository)

## 🚀 Quick Start

### Option 1: Use deployment script (Recommended)

**Windows:**
```bash
./deploy.bat
```

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual deployment

1. **Clone the repository** (if not already done):
```bash
git clone <repository-url>
cd classroom-app
```

2. **Build and start services**:
```bash
docker-compose up --build -d
```

3. **Check service status**:
```bash
docker-compose ps
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## 📊 Monitoring and Logs

### View logs for all services:
```bash
docker-compose logs -f
```

### View logs for specific service:
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb
```

### Check service health:
```bash
docker-compose ps
```

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration. Copy `.env.example` to `.env.production` and update values for production:

```bash
cp .env.example .env.production
```

**Important**: Change the `JWT_SECRET` and Cloudinary credentials for production deployment.

### Production Considerations

1. **Security**:
   - Change default JWT secret
   - Use secure Cloudinary credentials
   - Configure proper CORS origins
   - Use HTTPS in production

2. **Performance**:
   - Enable MongoDB authentication
   - Configure MongoDB replica set for high availability
   - Use a reverse proxy (like Nginx) for load balancing
   - Set up proper logging and monitoring

3. **Data Persistence**:
   - MongoDB data is persisted in Docker volumes
   - Backup volumes regularly in production

## 🛠️ Development

### Running in development mode:

1. **Start only MongoDB**:
```bash
docker-compose up mongodb -d
```

2. **Run backend and frontend locally**:
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

## 📁 Project Structure

```
classroom-app/
├── docker-compose.yml          # Main Docker Compose configuration
├── deploy.sh / deploy.bat      # Deployment scripts
├── .env.example               # Environment variables template
├── backend/
│   ├── Dockerfile            # Backend Docker configuration
│   ├── .dockerignore        # Backend Docker ignore file
│   └── ...                  # Backend source code
├── frontend/
│   ├── Dockerfile           # Frontend Docker configuration
│   ├── nginx.conf          # Nginx configuration
│   ├── .dockerignore       # Frontend Docker ignore file
│   └── ...                 # Frontend source code
```

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   # Check what's using the port
   netstat -ano | findstr :80
   netstat -ano | findstr :5000
   netstat -ano | findstr :27017
   
   # Change ports in docker-compose.yml if needed
   ```

2. **MongoDB connection issues**:
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB service
   docker-compose restart mongodb
   ```

3. **Frontend not loading**:
   ```bash
   # Check frontend logs
   docker-compose logs frontend
   
   # Rebuild frontend
   docker-compose build frontend
   docker-compose up -d frontend
   ```

4. **Backend API errors**:
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Check environment variables
   docker-compose exec backend env
   ```

### Reset everything:
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up --build -d
```

## 🔄 Updates and Maintenance

### Update application:
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up --build -d
```

### Backup MongoDB data:
```bash
# Create backup
docker-compose exec mongodb mongodump --out /data/backup

# Copy backup to host
docker cp classroom-mongodb:/data/backup ./mongodb-backup
```

### Restore MongoDB data:
```bash
# Copy backup to container
docker cp ./mongodb-backup classroom-mongodb:/data/restore

# Restore data
docker-compose exec mongodb mongorestore /data/restore
```

## 🛑 Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v
```

## 📞 Support

If you encounter any issues during deployment, please check:
1. Docker Desktop is running
2. Ports 80, 5000, and 27017 are available
3. Your system meets the minimum requirements
4. All environment variables are properly configured

For additional help, please refer to the main project documentation or create an issue in the repository.
