# Container Management Guide
*Edwards Group Holdings Website Development*

## Overview
This guide provides everything you need to keep our container system running smoothly and gives me (Claude) easy access to development environments.

## Quick Start

### 1. Start the Website
```bash
./container-manager.sh start
```
- Website available at: http://localhost:8080
- Automatically restarts if it crashes
- CSV files are live-mounted for easy editing

### 2. Stop the Website
```bash
./container-manager.sh stop
```

### 3. Check Status
```bash
./container-manager.sh status
```

## Container Management Scripts

### Main Website (`./container-manager.sh`)
- **start** - Start the website container
- **stop** - Stop the website container
- **restart** - Restart the website container
- **status** - Show container status
- **logs** - Show container logs
- **build** - Rebuild containers
- **cleanup** - Remove all containers and images
- **dev-tools** - Start development tools container
- **monitor** - Real-time container monitoring

### Development Environments (`./dev-containers/dev-container-manager.sh`)
- **start <env>** - Start specific development environment
- **stop [env]** - Stop specific or all environments
- **connect <env>** - Connect to environment shell
- **quick-start** - Start common environments
- **list** - Show available environments

## Available Development Environments

### Node.js Environment
```bash
cd dev-containers
./dev-container-manager.sh start nodejs
./dev-container-manager.sh connect nodejs
```
- **Ports**: 3000, 3001
- **Use for**: React, Vue, Angular, Node.js APIs
- **Includes**: npm, yarn, node

### Python Environment
```bash
cd dev-containers
./dev-container-manager.sh start python
./dev-container-manager.sh connect python
```
- **Ports**: 8000, 8001
- **Use for**: Django, Flask, FastAPI, data analysis
- **Includes**: pip, python 3.11

### PHP Environment
```bash
cd dev-containers
./dev-container-manager.sh start php
```
- **Port**: 8082
- **Use for**: Contact forms, WordPress, PHP APIs
- **Includes**: Apache, PHP 8.2

### Database (MySQL)
```bash
cd dev-containers
./dev-container-manager.sh start database
```
- **Port**: 3306
- **Database**: egh_website
- **User**: egh_user
- **Password**: egh_password

### Redis Cache
```bash
cd dev-containers
./dev-container-manager.sh start redis
```
- **Port**: 6379
- **Use for**: Caching, session storage

### Development Tools
```bash
cd dev-containers
./dev-container-manager.sh start tools
./dev-container-manager.sh connect tools
```
- **Includes**: curl, git, vim, nano, htop
- **Use for**: General development tasks

## Keeping OrbStack/Docker Happy

### 1. Regular Maintenance
```bash
# Clean up unused containers/images (weekly)
./container-manager.sh cleanup

# Or clean up everything Docker-related
docker system prune -a --volumes
```

### 2. Monitor Resource Usage
```bash
# Check OrbStack status
orb status

# Monitor container resource usage
docker stats

# Check disk usage
docker system df
```

### 3. Restart OrbStack if needed
```bash
# Restart OrbStack service
orb restart
```

### 4. Update Containers
```bash
# Update base images
docker pull nginx:alpine
docker pull node:18-alpine
docker pull python:3.11-alpine

# Rebuild our containers
./container-manager.sh build
```

## For Claude's Development Access

### Quick Environment Setup
```bash
# Start common development environments
cd dev-containers
./dev-container-manager.sh quick-start

# This starts:
# - Node.js environment (ports 3000, 3001)
# - Python environment (ports 8000, 8001)  
# - Development tools container
```

### Container Access Commands
```bash
# Connect to Node.js environment
./dev-container-manager.sh connect nodejs

# Connect to Python environment
./dev-container-manager.sh connect python

# Connect to development tools
./dev-container-manager.sh connect tools
```

### File Editing
All containers have the project directory mounted, so changes made inside containers are immediately reflected in the host filesystem.

## Troubleshooting

### Container Won't Start
1. Check if OrbStack is running: `orb status`
2. Check if port is already in use: `lsof -i :8080`
3. Restart OrbStack: `orb restart`

### Website Not Loading
1. Check container status: `./container-manager.sh status`
2. Check logs: `./container-manager.sh logs`
3. Restart container: `./container-manager.sh restart`

### Out of Disk Space
1. Clean up containers: `./container-manager.sh cleanup`
2. Clean up Docker system: `docker system prune -a --volumes`
3. Check OrbStack settings for disk allocation

### Permission Issues
1. Ensure scripts are executable: `chmod +x *.sh`
2. Check file permissions in mounted volumes

## Daily Workflow

### Starting Development
```bash
# Start the website
./container-manager.sh start

# Start development tools if needed
cd dev-containers
./dev-container-manager.sh quick-start
```

### Ending Development
```bash
# Stop everything
./container-manager.sh stop
cd dev-containers
./dev-container-manager.sh stop
```

### Weekly Maintenance
```bash
# Clean up unused resources
./container-manager.sh cleanup
docker system prune -f
```

## Configuration Files

- `docker-compose.yml` - Main website configuration
- `dev-containers/docker-compose.dev.yml` - Development environments
- `Dockerfile` - Website container definition
- `.dockerignore` - Files to exclude from containers

## Support

If you encounter issues:
1. Check the logs: `./container-manager.sh logs`
2. Restart containers: `./container-manager.sh restart`
3. Check OrbStack status: `orb status`
4. Clean up and rebuild: `./container-manager.sh cleanup` then `./container-manager.sh build`

---

*This system is designed to be self-maintaining and give Claude easy access to development environments while keeping your system clean and efficient.*