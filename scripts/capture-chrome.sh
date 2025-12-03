#!/bin/bash
# AppleScript-based screenshot capture using Chrome
# For sites that don't play well with Playwright's networkidle

URL="$1"
OUTPUT_MAIN="$2"
OUTPUT_THUMB="$3"
WAIT_SECONDS="${4:-5}"

if [ -z "$URL" ] || [ -z "$OUTPUT_MAIN" ] || [ -z "$OUTPUT_THUMB" ]; then
    echo "Usage: $0 <url> <output_main.webp> <output_thumb.webp> [wait_seconds]"
    exit 1
fi

TEMP_PNG="/tmp/chrome-screenshot-$$.png"

echo "📸 Opening $URL in Chrome..."

# Open URL in Chrome and resize window to 1200x900
osascript <<EOF
tell application "Google Chrome"
    activate
    if (count of windows) is 0 then
        make new window
    end if
    set URL of active tab of front window to "$URL"
    delay $WAIT_SECONDS
    set bounds of front window to {0, 0, 1200, 900}
end tell
EOF

# Wait for window to resize
sleep 1

# Capture Chrome window using AppleScript to get bounds and screencapture
BOUNDS=$(osascript -e 'tell application "Google Chrome" to get bounds of front window')
X1=$(echo $BOUNDS | cut -d',' -f1 | tr -d ' ')
Y1=$(echo $BOUNDS | cut -d',' -f2 | tr -d ' ')
X2=$(echo $BOUNDS | cut -d',' -f3 | tr -d ' ')
Y2=$(echo $BOUNDS | cut -d',' -f4 | tr -d ' ')

# Capture region
screencapture -R"$X1,$Y1,$((X2-X1)),$((Y2-Y1))" "$TEMP_PNG" 2>/dev/null

if [ ! -f "$TEMP_PNG" ]; then
    echo "❌ Failed to capture screenshot"
    exit 1
fi

# Create main screenshot (1200x900)
magick "$TEMP_PNG" -resize 1200x900 -quality 85 "$OUTPUT_MAIN"
MAIN_SIZE=$(du -k "$OUTPUT_MAIN" | cut -f1)
echo "✅ Main: $OUTPUT_MAIN (${MAIN_SIZE}KB)"

# Create thumbnail (600x450)
magick "$TEMP_PNG" -resize 600x450 -quality 85 "$OUTPUT_THUMB"
THUMB_SIZE=$(du -k "$OUTPUT_THUMB" | cut -f1)
echo "✅ Thumb: $OUTPUT_THUMB (${THUMB_SIZE}KB)"

# Cleanup
rm "$TEMP_PNG"

echo "✨ Done!"
