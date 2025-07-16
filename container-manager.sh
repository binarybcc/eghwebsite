#!/bin/bash

# Edwards Group Holdings - Container Management System
# This script provides easy management of development containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="egh-website"
COMPOSE_FILE="docker-compose.yml"

# Function to print colored output
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
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} EGH Container Management System${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start OrbStack/Docker first."
        exit 1
    fi
}

# Check if docker-compose is available
check_compose() {
    if ! command -v docker-compose > /dev/null 2>&1; then
        print_warning "docker-compose not found, trying 'docker compose'"
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
}

# Start containers
start_containers() {
    print_status "Starting EGH Website containers..."
    $COMPOSE_CMD up -d
    print_status "Containers started successfully!"
    print_status "Website available at: http://localhost:8080"
}

# Stop containers
stop_containers() {
    print_status "Stopping EGH Website containers..."
    $COMPOSE_CMD down
    print_status "Containers stopped successfully!"
}

# Restart containers
restart_containers() {
    print_status "Restarting EGH Website containers..."
    $COMPOSE_CMD restart
    print_status "Containers restarted successfully!"
}

# Show container status
show_status() {
    print_status "Container Status:"
    docker ps --filter "label=project=${PROJECT_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Show logs
show_logs() {
    if [ -n "$1" ]; then
        docker logs -f "$1"
    else
        print_status "Available containers:"
        docker ps --filter "label=project=${PROJECT_NAME}" --format "{{.Names}}"
        echo ""
        print_status "Showing logs for website container:"
        docker logs -f egh-website
    fi
}

# Build containers
build_containers() {
    print_status "Building EGH Website containers..."
    $COMPOSE_CMD build
    print_status "Containers built successfully!"
}

# Clean up containers and images
cleanup() {
    print_warning "This will remove all containers and images for this project."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up containers..."
        $COMPOSE_CMD down -v --rmi all
        docker system prune -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Development tools
start_dev_tools() {
    print_status "Starting development tools container..."
    $COMPOSE_CMD --profile dev-tools up -d dev-tools
    print_status "Development tools container started!"
    print_status "To access: docker exec -it egh-dev-tools sh"
}

# Monitor containers
monitor() {
    print_status "Monitoring containers (Press Ctrl+C to stop)..."
    watch -n 2 "docker ps --filter 'label=project=${PROJECT_NAME}' --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
}

# Show help
show_help() {
    echo "EGH Container Management System"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start      Start all containers"
    echo "  stop       Stop all containers"
    echo "  restart    Restart all containers"
    echo "  status     Show container status"
    echo "  logs       Show container logs"
    echo "  build      Build containers"
    echo "  cleanup    Remove all containers and images"
    echo "  dev-tools  Start development tools container"
    echo "  monitor    Monitor containers in real-time"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start                 # Start website"
    echo "  $0 logs                  # Show website logs"
    echo "  $0 logs egh-website      # Show specific container logs"
    echo "  $0 dev-tools             # Start development tools"
}

# Main script logic
main() {
    print_header
    
    # Check prerequisites
    check_docker
    check_compose
    
    # Handle commands
    case "${1:-help}" in
        "start")
            start_containers
            ;;
        "stop")
            stop_containers
            ;;
        "restart")
            restart_containers
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs "$2"
            ;;
        "build")
            build_containers
            ;;
        "cleanup")
            cleanup
            ;;
        "dev-tools")
            start_dev_tools
            ;;
        "monitor")
            monitor
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function
main "$@"