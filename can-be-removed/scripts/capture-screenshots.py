#!/usr/bin/env python3
"""
Screenshot Capture Script for Edwards Group Holdings Website
Captures website screenshots based on CSV configuration and optimizes them as WebP.

Usage:
    python3 scripts/capture-screenshots.py --preview   # Capture to temp folder for review
    python3 scripts/capture-screenshots.py --deploy    # Deploy approved screenshots to assets
    python3 scripts/capture-screenshots.py --help      # Show help
"""

import argparse
import csv
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import io

# Configuration
CSV_FILE = "screenshots.csv"
TEMP_DIR = "temp/screenshots"
ASSETS_DIR = "assets/screenshots"
THUMBNAIL_SIZE = (600, 450)

# Color codes for terminal output
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'


def print_status(message, color=RESET):
    """Print colored status message"""
    print(f"{color}{message}{RESET}")


def ensure_directory(path):
    """Create directory if it doesn't exist"""
    Path(path).mkdir(parents=True, exist_ok=True)


def optimize_webp(image_data, output_path, max_width=None):
    """Convert and optimize image as WebP"""
    img = Image.open(io.BytesIO(image_data))

    # Resize if max_width specified (for thumbnails)
    if max_width:
        aspect_ratio = img.height / img.width
        new_height = int(max_width * aspect_ratio)
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

    # Save as WebP with optimization
    img.save(output_path, 'WEBP', quality=85, method=6)

    # Return file size
    return os.path.getsize(output_path)


def capture_screenshot(url, viewport_width, viewport_height, wait_seconds, output_dir, main_filename, thumb_filename, force=False):
    """Capture screenshot of a URL and create both main and thumbnail versions"""

    # Check if files already exist (skip if force=False)
    main_path = os.path.join(output_dir, main_filename)
    thumb_path = os.path.join(output_dir, thumb_filename)

    if not force and os.path.exists(main_path) and os.path.exists(thumb_path):
        main_size = os.path.getsize(main_path)
        thumb_size = os.path.getsize(thumb_path)
        print_status(f"  ⏭️  Already captured, skipping...", YELLOW)
        print_status(f"    ✅ Main: {main_filename} ({main_size // 1024}KB)", GREEN)
        print_status(f"    ✅ Thumb: {thumb_filename} ({thumb_size // 1024}KB)", GREEN)
        return True, main_size + thumb_size

    print_status(f"  📸 Capturing {url}...", BLUE)

    try:
        with sync_playwright() as p:
            # Launch browser
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={'width': viewport_width, 'height': viewport_height},
                user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            )
            page = context.new_page()

            # Navigate and wait
            # Use 'load' instead of 'networkidle' for better compatibility with slow sites
            page.goto(url, wait_until='load', timeout=60000)
            page.wait_for_timeout(wait_seconds * 1000)

            # Capture screenshot
            screenshot_data = page.screenshot(full_page=False, type='png')

            browser.close()

        # Save main screenshot (1200x900)
        main_path = os.path.join(output_dir, main_filename)
        main_size = optimize_webp(screenshot_data, main_path, max_width=viewport_width)
        print_status(f"    ✅ Main: {main_filename} ({main_size // 1024}KB)", GREEN)

        # Save thumbnail (600x450)
        thumb_path = os.path.join(output_dir, thumb_filename)
        thumb_size = optimize_webp(screenshot_data, thumb_path, max_width=THUMBNAIL_SIZE[0])
        print_status(f"    ✅ Thumb: {thumb_filename} ({thumb_size // 1024}KB)", GREEN)

        return True, main_size + thumb_size

    except Exception as e:
        print_status(f"    ❌ Error: {str(e)}", RED)
        return False, 0


def read_csv_config():
    """Read screenshot configuration from CSV"""
    if not os.path.exists(CSV_FILE):
        print_status(f"❌ Error: {CSV_FILE} not found", RED)
        sys.exit(1)

    screenshots = []
    with open(CSV_FILE, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            screenshots.append(row)

    return screenshots


def preview_mode(force=False):
    """Capture screenshots to temp directory for review"""
    mode_msg = "\n🔍 PREVIEW MODE - Capturing to temp folder for review\n"
    if force:
        mode_msg += "⚡ FORCE MODE: Recapturing all screenshots\n"
    print_status(mode_msg, YELLOW)

    # Ensure temp directory exists
    ensure_directory(TEMP_DIR)

    screenshots = read_csv_config()
    total = len(screenshots)
    successful = 0
    failed = 0
    total_size = 0

    print_status(f"Found {total} screenshots to capture\n", BLUE)

    for idx, config in enumerate(screenshots, 1):
        division = config['division']
        property_name = config['property_name']
        url = config['url']

        print_status(f"[{idx}/{total}] {property_name} ({division})", BLUE)

        # Create division subdirectory
        output_dir = os.path.join(TEMP_DIR, division)
        ensure_directory(output_dir)

        # Capture screenshot
        success, size = capture_screenshot(
            url=url,
            viewport_width=int(config['viewport_width']),
            viewport_height=int(config['viewport_height']),
            wait_seconds=int(config['wait_seconds']),
            output_dir=output_dir,
            main_filename=config['main_filename'],
            thumb_filename=config['thumb_filename'],
            force=force
        )

        if success:
            successful += 1
            total_size += size
        else:
            failed += 1

        print()  # Blank line between entries

    # Summary
    print_status("=" * 60, BLUE)
    print_status(f"✅ Successful: {successful}/{total}", GREEN)
    if failed > 0:
        print_status(f"❌ Failed: {failed}/{total}", RED)
    print_status(f"📦 Total size: {total_size // 1024}KB ({total_size / 1024 / 1024:.1f}MB)", BLUE)
    print_status("=" * 60, BLUE)
    print_status(f"\n📁 Screenshots saved to: {TEMP_DIR}/", YELLOW)
    print_status(f"👀 Review them, then run with --deploy to publish\n", YELLOW)


def deploy_mode():
    """Deploy screenshots from temp to assets directory"""
    print_status("\n🚀 DEPLOY MODE - Moving screenshots to assets\n", YELLOW)

    if not os.path.exists(TEMP_DIR):
        print_status(f"❌ Error: Temp directory not found. Run --preview first.", RED)
        sys.exit(1)

    screenshots = read_csv_config()
    deployed = 0

    for config in screenshots:
        division = config['division']
        main_filename = config['main_filename']
        thumb_filename = config['thumb_filename']

        # Source paths (temp)
        temp_division_dir = os.path.join(TEMP_DIR, division)
        main_temp = os.path.join(temp_division_dir, main_filename)
        thumb_temp = os.path.join(temp_division_dir, thumb_filename)

        # Destination paths (assets)
        assets_division_dir = os.path.join(ASSETS_DIR, division)
        ensure_directory(assets_division_dir)
        main_dest = os.path.join(assets_division_dir, main_filename)
        thumb_dest = os.path.join(assets_division_dir, thumb_filename)

        # Copy files
        try:
            if os.path.exists(main_temp):
                os.replace(main_temp, main_dest)
                print_status(f"✅ Deployed: {main_filename}", GREEN)
                deployed += 1

            if os.path.exists(thumb_temp):
                os.replace(thumb_temp, thumb_dest)
                print_status(f"✅ Deployed: {thumb_filename}", GREEN)
                deployed += 1
        except Exception as e:
            print_status(f"❌ Error deploying {main_filename}: {str(e)}", RED)

    print_status(f"\n✅ Deployed {deployed} files to {ASSETS_DIR}/", GREEN)
    print_status(f"🗑️  Temp directory can be removed\n", YELLOW)


def main():
    parser = argparse.ArgumentParser(
        description='Capture website screenshots for Edwards Group Holdings',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Capture screenshots to temp folder for review
  python3 scripts/capture-screenshots.py --preview

  # Deploy approved screenshots to assets
  python3 scripts/capture-screenshots.py --deploy

  # Capture and deploy in one step (skip review)
  python3 scripts/capture-screenshots.py --preview && python3 scripts/capture-screenshots.py --deploy
        """
    )

    parser.add_argument('--preview', action='store_true',
                        help='Capture screenshots to temp folder for review')
    parser.add_argument('--deploy', action='store_true',
                        help='Deploy approved screenshots from temp to assets')
    parser.add_argument('--force', action='store_true',
                        help='Force recapture of all screenshots (ignore existing files)')

    args = parser.parse_args()

    if args.preview:
        preview_mode(force=args.force)
    elif args.deploy:
        deploy_mode()
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == '__main__':
    main()
