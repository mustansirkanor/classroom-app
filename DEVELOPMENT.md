# Development Mode Quick Reference

## Hot Reloading Development Setup

### Quick Start
```bash
# Windows
./deploy.dev.bat

# Linux/macOS  
./deploy.dev.sh
```

### What You Get
- **Frontend Hot Reload**: Edit React files → instant browser refresh
- **Backend Hot Reload**: Edit Node.js files → server auto-restarts
- **Debug Support**: Connect debugger to port 9229
- **Live Database**: MongoDB with separate dev volumes
- **Volume Mapping**: Your code changes reflect immediately

### URLs
- Frontend: http://localhost:3000 
- Backend: http://localhost:5000   
- Debugger: localhost:9229 
- MongoDB: localhost:27017 

### Key Features

#### Frontend (React)
- Uses `npm start` instead of production build
- `CHOKIDAR_USEPOLLING=true` for file watching in Docker
- Volume mounted: `./frontend:/app`
- Anonymous volume: `/app/node_modules` (preserves Docker-installed packages)

#### Backend (Node.js)
- Uses `nodemon` for auto-restart on file changes
- Debug port exposed: `--inspect=0.0.0.0:9229`
- Volume mounted: `./backend:/app`
- Anonymous volume: `/app/node_modules`

#### Database (MongoDB)
- Separate dev volumes: `mongodb_data_dev`, `mongodb_config_dev`
- Won't interfere with production data

### Development Workflow

1. **Start development mode**:
   ```bash
   ./deploy.dev.bat
   ```

2. **Edit frontend code**:
   - Change files in `./frontend/src/`
   - Browser auto-refreshes with changes

3. **Edit backend code**:
   - Change files in `./backend/`
   - Server auto-restarts with nodemon

4. **Debug backend**:
   - Connect your IDE debugger to `localhost:9229`
   - Set breakpoints and debug live

5. **View logs**:
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

6. **Stop development**:
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### File Structure
```
classroom-app/
├── docker-compose.yml         # Production setup
├── docker-compose.dev.yml     # Development setup with hot reload
├── deploy.bat / deploy.sh     # Production deployment
├── deploy.dev.bat / .sh       # Development deployment
├── backend/
│   ├── Dockerfile            # Production backend
│   ├── Dockerfile.dev        # Development backend (nodemon)
│   └── ...
├── frontend/
│   ├── Dockerfile            # Production frontend (nginx)
│   ├── Dockerfile.dev        # Development frontend (npm start)
│   └── ...
```

### Troubleshooting

**Hot reload not working?**
- Check volume mounts are correct
- Ensure `CHOKIDAR_USEPOLLING=true` is set
- Try rebuilding: `docker-compose -f docker-compose.dev.yml up --build`

**Backend not restarting?**
- Check nodemon is installed in container
- Verify volume mount: `./backend:/app`
- Check logs: `docker-compose -f docker-compose.dev.yml logs backend`

**Port conflicts?**
- Stop production containers first: `docker-compose down`
- Check what's using ports: `netstat -ano | findstr :3000`

### Production vs Development

| Feature | Production | Development |
|---------|------------|-------------|
| Frontend | Nginx static files | npm start |
| Backend | Node.js | Nodemon |
| Rebuild needed | Yes | No (hot reload) |
| Debug support | No | Yes (port 9229) |
| Volume mounts | No | Yes |
| Database | Shared | Separate dev volumes |
