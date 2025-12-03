#!/bin/bash

###############################################################################
# Edwards Group Holdings Website - Deployment Script
#
# Usage: ./deploy.sh [options]
# Options:
#   --no-backup    Skip backup creation
#   --dry-run      Show what would be deployed without actually deploying
#   --help         Show this help message
###############################################################################

set -e  # Exit on error

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.production"
BACKUP_ENABLED=true
DRY_RUN=false
AUTO_CONFIRM=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-backup)
            BACKUP_ENABLED=false
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --yes|-y)
            AUTO_CONFIRM=true
            shift
            ;;
        --help)
            echo "Edwards Group Holdings Website - Deployment Script"
            echo ""
            echo "Usage: ./deploy.sh [options]"
            echo ""
            echo "Options:"
            echo "  --no-backup    Skip backup creation"
            echo "  --dry-run      Show what would be deployed without actually deploying"
            echo "  --yes, -y      Auto-confirm deployment (non-interactive)"
            echo "  --help         Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Functions
print_step() {
    echo -e "\n${BLUE}==> $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Load environment variables
print_step "Loading deployment configuration"
if [ ! -f "$ENV_FILE" ]; then
    print_error ".env.production file not found!"
    echo "Please create $ENV_FILE with your server credentials."
    exit 1
fi

# Source the .env file
export $(grep -v '^#' "$ENV_FILE" | xargs)

if [ -z "$HOST" ] || [ -z "$USER" ] || [ -z "$PASSWORD" ]; then
    print_error "Missing required credentials in .env.production"
    echo "Required: HOST, USER, PASSWORD"
    exit 1
fi

print_success "Configuration loaded"
echo "  Host: $HOST"
echo "  User: $USER"

# Check for required commands
print_step "Checking required tools"
if ! command -v sshpass &> /dev/null; then
    print_warning "sshpass not found. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install hudochenkov/sshpass/sshpass
    else
        print_error "Please install sshpass: brew install hudochenkov/sshpass/sshpass"
        exit 1
    fi
fi
print_success "All required tools available"

# Validate local files
print_step "Validating local files"

REQUIRED_FILES=(
    "index.html"
    "about.html"
    "leadership.html"
    "media-properties.html"
    "contact.html"
    "publishing.html"
    "radio.html"
    "printing.html"
    "styles.css"
    "script.js"
    "csv-manager.js"
    "simple_email.php"
    "newspapers.csv"
    "radio_networks.csv"
    "printing_companies.csv"
    "leadership.csv"
    "corporate_office.csv"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$SCRIPT_DIR/$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    print_error "Missing required files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

print_success "All required files present"

# Check assets directory
if [ ! -d "$SCRIPT_DIR/assets" ]; then
    print_error "assets/ directory not found!"
    exit 1
fi

# Count files to deploy
HTML_COUNT=$(ls -1 "$SCRIPT_DIR"/*.html 2>/dev/null | wc -l)
CSS_COUNT=$(ls -1 "$SCRIPT_DIR"/*.css 2>/dev/null | wc -l)
JS_COUNT=$(ls -1 "$SCRIPT_DIR"/*.js 2>/dev/null | wc -l)
CSV_COUNT=$(ls -1 "$SCRIPT_DIR"/*.csv 2>/dev/null | wc -l)
ASSET_COUNT=$(find "$SCRIPT_DIR/assets" -type f 2>/dev/null | wc -l)

echo ""
echo "Files to deploy:"
echo "  HTML files: $HTML_COUNT"
echo "  CSS files: $CSS_COUNT"
echo "  JavaScript files: $JS_COUNT"
echo "  CSV files: $CSV_COUNT"
echo "  Asset files: $ASSET_COUNT"

# Dry run check
if [ "$DRY_RUN" = true ]; then
    print_warning "DRY RUN MODE - No files will be deployed"
    echo ""
    echo "Would deploy to: $USER@$HOST:$PORT"
    echo ""
    echo "Files that would be uploaded:"
    echo "  - All HTML files"
    echo "  - All CSS files"
    echo "  - All JavaScript files"
    echo "  - All CSV files"
    echo "  - All assets/"
    echo ""
    print_success "Dry run complete"
    exit 0
fi

# Confirm deployment
if [ "$AUTO_CONFIRM" = false ]; then
    echo ""
    read -p "Deploy to $HOST? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled"
        exit 0
    fi
else
    print_success "Auto-confirmed deployment to $HOST"
fi

# Create backup if enabled
if [ "$BACKUP_ENABLED" = true ]; then
    print_step "Creating backup of production site"

    BACKUP_DIR="backups/backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$SCRIPT_DIR/$BACKUP_DIR"

    # Download current production files
    sshpass -p "$PASSWORD" sftp -oPort=$PORT -oBatchMode=no -b - "$USER@$HOST" << EOF > /dev/null 2>&1 || true
get -r public_html "$SCRIPT_DIR/$BACKUP_DIR/"
bye
EOF

    if [ -d "$SCRIPT_DIR/$BACKUP_DIR/public_html" ]; then
        print_success "Backup created: $BACKUP_DIR"
    else
        print_warning "Backup creation failed or no existing files"
    fi
fi

# Deploy files
print_step "Deploying website files"

# Create SFTP batch file
BATCH_FILE=$(mktemp)
cat > "$BATCH_FILE" << 'EOFBATCH'
# Change to public_html directory
cd public_html

# Upload HTML files
put index.html
put about.html
put leadership.html
put media-properties.html
put contact.html
put publishing.html
put radio.html
put printing.html

# Upload CSS and JavaScript
put styles.css
put script.js
put csv-manager.js

# Upload PHP
put simple_email.php
put email_config.php

# Upload CSV files
put newspapers.csv
put radio_networks.csv
put printing_companies.csv
put leadership.csv
put corporate_office.csv

# Upload assets directory
put -r assets

bye
EOFBATCH

# Execute SFTP upload
echo "Uploading files..."
if sshpass -p "$PASSWORD" sftp -oPort=$PORT -oBatchMode=no -b "$BATCH_FILE" "$USER@$HOST"; then
    print_success "Files uploaded successfully"
else
    print_error "Upload failed"
    rm "$BATCH_FILE"
    exit 1
fi

# Clean up
rm "$BATCH_FILE"

# Verify deployment
print_step "Verifying deployment"
echo "Checking if files are accessible..."

# Try to verify via SSH (optional)
if sshpass -p "$PASSWORD" ssh -p $PORT "$USER@$HOST" "ls public_html/index.html" > /dev/null 2>&1; then
    print_success "index.html verified on server"
else
    print_warning "Could not verify files (this may be normal)"
fi

# Deployment summary
print_step "Deployment Summary"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo ""
echo "Deployed to: $HOST"
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "Next steps:"
echo "  1. Visit your website to verify deployment"
echo "  2. Test all pages and functionality"
echo "  3. Check CSV data is loading correctly"
echo "  4. Test contact form submission"
echo ""

if [ "$BACKUP_ENABLED" = true ] && [ -d "$SCRIPT_DIR/$BACKUP_DIR" ]; then
    echo "Backup location: $BACKUP_DIR"
    echo "  To restore: Use SFTP to upload backup files"
    echo ""
fi

print_success "Done!"
