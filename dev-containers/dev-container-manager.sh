#!/bin/bash

# Development Container Manager
# Easy access to development environments

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

COMPOSE_FILE="docker-compose.dev.yml"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE} Development Container Manager${NC}"
    echo -e "${BLUE}========================================${NC}"
}

check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start OrbStack/Docker first."
        exit 1
    fi
}

check_compose() {
    if ! command -v docker-compose > /dev/null 2>&1; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
}

# Start specific development environment
start_env() {
    local env="$1"
    if [ -z "$env" ]; then
        print_error "Please specify an environment to start"
        show_available_envs
        return 1
    fi
    
    print_status "Starting $env development environment..."
    $COMPOSE_CMD --profile "$env" up -d
    
    # Show connection info
    case "$env" in
        "nodejs")
            print_status "Node.js environment started!"
            print_status "Access with: docker exec -it dev-nodejs sh"
            print_status "Ports: 3000, 3001"
            ;;
        "python")
            print_status "Python environment started!"
            print_status "Access with: docker exec -it dev-python sh"
            print_status "Ports: 8000, 8001"
            ;;
        "php")
            print_status "PHP environment started!"
            print_status "Access at: http://localhost:8082"
            print_status "Access with: docker exec -it dev-php bash"
            ;;
        "database")
            print_status "MySQL database started!"
            print_status "Connection: localhost:3306"
            print_status "Database: egh_website"
            print_status "User: egh_user / Password: egh_password"
            ;;
        "redis")
            print_status "Redis started!"
            print_status "Connection: localhost:6379"
            ;;
        "nginx")
            print_status "Nginx started!"
            print_status "Access at: http://localhost:8081"
            ;;
        "tools")
            print_status "Development tools started!"
            print_status "Access with: docker exec -it dev-tools-advanced sh"
            ;;
    esac
}

# Stop specific environment
stop_env() {
    local env="$1"
    if [ -z "$env" ]; then
        print_status "Stopping all development environments..."
        $COMPOSE_CMD down
    else
        print_status "Stopping $env environment..."
        $COMPOSE_CMD stop "$env"
    fi
}

# Show available environments
show_available_envs() {
    echo "Available development environments:"
    echo "  nodejs    - Node.js development environment"
    echo "  python    - Python development environment"
    echo "  php       - PHP development environment"
    echo "  database  - MySQL database"
    echo "  redis     - Redis cache"
    echo "  nginx     - Nginx web server"
    echo "  tools     - Development tools container"
}

# Show running containers
show_status() {
    print_status "Development Environment Status:"
    docker ps --filter "name=dev-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Connect to container
connect() {
    local env="$1"
    if [ -z "$env" ]; then
        print_error "Please specify an environment to connect to"
        show_available_envs
        return 1
    fi
    
    case "$env" in
        "nodejs")
            docker exec -it dev-nodejs sh
            ;;
        "python")
            docker exec -it dev-python sh
            ;;
        "php")
            docker exec -it dev-php bash
            ;;
        "tools")
            docker exec -it dev-tools-advanced sh
            ;;
        *)
            print_error "Unknown environment: $env"
            show_available_envs
            ;;
    esac
}

# Quick start common environments
quick_start() {
    print_status "Starting common development environments..."
    $COMPOSE_CMD --profile nodejs --profile python --profile tools up -d
    print_status "Common environments started!"
    print_status "Node.js: docker exec -it dev-nodejs sh"
    print_status "Python: docker exec -it dev-python sh"
    print_status "Tools: docker exec -it dev-tools-advanced sh"
}

# Show help
show_help() {
    echo "Development Container Manager"
    echo ""
    echo "Usage: $0 [COMMAND] [ENVIRONMENT]"
    echo ""
    echo "Commands:"
    echo "  start <env>     Start specific development environment"
    echo "  stop [env]      Stop specific or all environments"
    echo "  status          Show running containers"
    echo "  connect <env>   Connect to environment shell"
    echo "  quick-start     Start common environments (nodejs, python, tools)"
    echo "  list            Show available environments"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start nodejs         # Start Node.js environment"
    echo "  $0 connect python       # Connect to Python environment"
    echo "  $0 quick-start          # Start common environments"
    echo "  $0 stop                 # Stop all environments"
}

# Main function
main() {
    print_header
    
    check_docker
    check_compose
    
    case "${1:-help}" in
        "start")
            start_env "$2"
            ;;
        "stop")
            stop_env "$2"
            ;;
        "status")
            show_status
            ;;
        "connect")
            connect "$2"
            ;;
        "quick-start")
            quick_start
            ;;
        "list")
            show_available_envs
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

main "$@"