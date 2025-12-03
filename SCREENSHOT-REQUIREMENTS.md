# Screenshot Requirements for Media Properties

## Overview
This document outlines the screenshot requirements for displaying website previews across the Edwards Group Holdings corporate site. Screenshots are captured automatically using a CSV-driven Python script.

## Screenshot Specifications

**Dimensions:**
- **Main images**: 1200px × 900px (4:3 ratio) - balanced quality/performance
- **Thumbnails**: 600px × 450px (4:3 ratio) - retina-ready for mobile

**Format:**
- WebP format for optimal compression
- Quality: 85% (good balance of size/clarity)

**File Size Targets:**
- Main: <150KB each
- Thumbnail: <50KB each

**Why These Dimensions?**
- Main (1200x900): Covers retina displays at max 600px display width
- Thumbnails (600x450): Covers retina displays at max 300px display width
- Optimized for rural 3G+ connections (performance-first approach)

---

## Automated Screenshot Capture (Recommended Method)

### Setup (One-Time)

```bash
# 1. Install Python dependencies
cd /Users/user/Development/work/_archive/eghwebsite-master
pip3 install -r scripts/requirements.txt

# 2. Install Playwright browsers
playwright install chromium
```

### Configuration

All screenshot URLs and settings are managed in **screenshots.csv**:

```csv
division,property_name,url,main_filename,thumb_filename,viewport_width,viewport_height,wait_seconds
publishing,The Journal,https://upstatetoday.com,tj-main.webp,tj-thumb.webp,1200,900,3
publishing,The Ranger,https://rivertonranger.com,tr-main.webp,tr-thumb.webp,1200,900,3
...
```

**To add new properties**: Just add a row to screenshots.csv

### Usage

**Step 1: Preview Mode** (Capture to temp folder for review)
```bash
python3 scripts/capture-screenshots.py --preview
```

This will:
- Read all URLs from screenshots.csv
- Capture screenshots at specified viewport sizes
- Generate both main (1200x900) and thumbnail (600x450) versions
- Optimize as WebP format
- Save to `temp/screenshots/{division}/` for review
- Show progress and file sizes

**Step 2: Review Screenshots**
```bash
# Open temp folder to review captures
open temp/screenshots/

# Check for:
# - Sites loaded correctly (no errors)
# - Content looks appropriate
# - Above-the-fold content captured well
```

**Step 3: Deploy Mode** (Move approved screenshots to production)
```bash
python3 scripts/capture-screenshots.py --deploy
```

This will:
- Move approved screenshots from temp to `assets/screenshots/{division}/`
- Overwrite existing screenshots
- Clean up temp directory

### Example Workflow

```bash
# Capture all screenshots
python3 scripts/capture-screenshots.py --preview

# Output:
# 🔍 PREVIEW MODE - Capturing to temp folder for review
#
# Found 14 screenshots to capture
#
# [1/14] The Journal (publishing)
#   📸 Capturing https://upstatetoday.com...
#     ✅ Main: tj-main.webp (142KB)
#     ✅ Thumb: tj-thumb.webp (48KB)
# ...
#
# ✅ Successful: 14/14
# 📦 Total size: 2.1MB
# 📁 Screenshots saved to: temp/screenshots/

# Review captures
open temp/screenshots/publishing/

# If approved, deploy
python3 scripts/capture-screenshots.py --deploy

# Output:
# 🚀 DEPLOY MODE - Moving screenshots to assets
# ✅ Deployed: tj-main.webp
# ✅ Deployed: tj-thumb.webp
# ...
```

---

## Alternative: Manual Capture (macOS)

If you prefer manual screenshot capture:

```bash
# 1. Capture screenshot
screencapture -i ~/Desktop/screenshot.png

# 2. Optimize and convert to WebP
magick ~/Desktop/screenshot.png -resize 1200x900 -quality 85 assets/screenshots/publishing/tj-main.webp
magick ~/Desktop/screenshot.png -resize 600x450 -quality 85 assets/screenshots/publishing/tj-thumb.webp
```

---

## Required Screenshots by Division

### Publishing Division

| Property | Main Screenshot | Thumbnail | URL |
|----------|----------------|-----------|-----|
| The Journal | `tj-main.webp` | `tj-thumb.webp` | upstatetoday.com |
| The Ranger | `tr-main.webp` | `tr-thumb.webp` | rivertonranger.com |
| The Lander Journal | `lj-main.webp` | `lj-thumb.webp` | thelanderjournal.com |
| The Advertiser | `ta-main.webp` | `ta-thumb.webp` | tuscolatoday.com |

### Radio Division

| Property | Main Screenshot | Thumbnail | URL |
|----------|----------------|-----------|-----|
| WyoToday Network | `wy-main.webp` | `wy-thumb.webp` | wyotoday.com |
| True North - News | `tn-main.webp` | `tn-thumb.webp` | truenorthradionetwork.com |
| WATZ 99.3 FM | `tn-watz-main.webp` | `tn-watz-thumb.webp` | truenorthradionetwork.com/watz |
| WKJC 104.5 FM | `tn-wkjc-main.webp` | `tn-wkjc-thumb.webp` | truenorthradionetwork.com/wkjc |
| WYUL 94.7 FM | `tn-wyul-main.webp` | `tn-wyul-thumb.webp` | truenorthradionetwork.com/wyul |
| WMKC 102.9 FM | `tn-wmkc-main.webp` | `tn-wmkc-thumb.webp` | truenorthradionetwork.com/wmkc |
| WQXO 96.5 FM | `tn-wqxo-main.webp` | `tn-wqxo-thumb.webp` | truenorthradionetwork.com/wqxo |
| WHSB 107.7 FM | `tn-whsb-main.webp` | `tn-whsb-thumb.webp` | truenorthradionetwork.com/whsb |
| WCBY 1240 AM | `tn-wcby-main.webp` | `tn-wcby-thumb.webp` | truenorthradionetwork.com/wcby |
| WATZ 1450 AM | `tn-watzam-main.webp` | `tn-watzam-thumb.webp` | truenorthradionetwork.com/watz-am |

### Printing Division

*(URLs to be added to screenshots.csv when available)*

---

## File Structure

```
assets/screenshots/
├── publishing/
│   ├── tj-main.webp      # The Journal - Full size
│   ├── tj-thumb.webp     # The Journal - Thumbnail
│   ├── tr-main.webp      # The Ranger - Full size
│   ├── tr-thumb.webp     # The Ranger - Thumbnail
│   ├── lj-main.webp      # Lander Journal - Full size
│   ├── lj-thumb.webp     # Lander Journal - Thumbnail
│   ├── ta-main.webp      # The Advertiser - Full size
│   └── ta-thumb.webp     # The Advertiser - Thumbnail
├── radio/
│   ├── wy-main.webp      # WyoToday - Full size
│   ├── wy-thumb.webp     # WyoToday - Thumbnail
│   ├── tn-main.webp      # True North News - Full size
│   ├── tn-thumb.webp     # True North News - Thumbnail
│   ├── tn-watz-main.webp # WATZ 99.3 - Full size
│   ├── tn-watz-thumb.webp# WATZ 99.3 - Thumbnail
│   └── ...               # Additional radio stations
└── printing/
    └── (future)

temp/screenshots/         # Preview captures (not deployed)
├── publishing/
├── radio/
└── printing/
```

---

## Temporary Placeholders

Until real screenshots are captured, the site displays:
- SVG placeholder images with site names
- Gray background (#e2e8f0)
- Site name and domain text
- "Screenshot placeholder" message

The site is fully functional with placeholders; screenshots enhance visual presentation.

---

## Maintenance Schedule

**Update screenshots when:**
- A site redesigns
- Homepage content changes significantly
- Quarterly review (or as needed)
- User feedback indicates outdated content

**Quick update workflow:**
```bash
# Update screenshots.csv if needed (add/remove/modify URLs)
# Run the script
python3 scripts/capture-screenshots.py --preview
open temp/screenshots/  # Review
python3 scripts/capture-screenshots.py --deploy
```

---

## Troubleshooting

### Script fails with "playwright not found"
```bash
pip3 install playwright
playwright install chromium
```

### Screenshots show errors or blank pages
- Check URL is accessible
- Increase `wait_seconds` in screenshots.csv (try 5-10)
- Test URL manually in browser first

### File sizes too large
- Reduce quality in script (change `quality=85` to `quality=75`)
- Verify WebP format (not PNG/JPG)

### Screenshots look blurry
- Verify dimensions: 1200x900 for main, 600x450 for thumb
- Check WebP quality setting (85% recommended)

---

## Testing Checklist

After deploying screenshots:

- [ ] All images load at http://localhost:8080/publishing.html
- [ ] Hover overlay works ("Visit Site →")
- [ ] Images are sharp on retina displays
- [ ] File sizes meet targets (<150KB main, <50KB thumb)
- [ ] Alt text is descriptive
- [ ] Links open in new tabs (`target="_blank"`)
- [ ] Mobile responsive (images scale properly)
- [ ] Lazy loading works (check Network tab)

---

## Adding New Properties

1. **Add URL to screenshots.csv**:
```csv
radio,KNEW 101.1 FM,https://example.com/knew,tn-knew-main.webp,tn-knew-thumb.webp,1200,900,3
```

2. **Run capture script**:
```bash
python3 scripts/capture-screenshots.py --preview
python3 scripts/capture-screenshots.py --deploy
```

3. **Update HTML** to reference new screenshots

---

## Performance Considerations

**Why CSV-driven automation?**
- ✅ Consistent quality across all captures
- ✅ Reproducible (anyone can run the script)
- ✅ Saves time (14 screenshots in ~2 minutes)
- ✅ Easy to update (modify CSV, run script)
- ✅ Supervised process (review before deploy)

**Why not live iframes?**
- ❌ Performance: Each iframe loads entire site (slow on rural 3G)
- ❌ Security: Third-party content in your site
- ❌ Control: External sites can change unexpectedly
- ✅ Static screenshots: Fast, safe, controlled

**Total page weight with screenshots:**
- Publishing page: ~800KB (4 thumbnails @ ~50KB each + page assets)
- Showcase page: ~2.5MB (4 main @ ~150KB each + page assets)
- Loads well on 3G+ connections (optimized for target market)

---

## Next Steps

1. **Install dependencies**: `pip3 install -r scripts/requirements.txt && playwright install chromium`
2. **Review screenshots.csv**: Verify all URLs are correct
3. **Run preview**: `python3 scripts/capture-screenshots.py --preview`
4. **Review captures**: `open temp/screenshots/`
5. **Deploy**: `python3 scripts/capture-screenshots.py --deploy`
6. **Test**: Visit http://localhost:8080/publishing.html and media-properties.html
7. **Repeat for radio/printing** when ready

---

*Last Updated: 2025-11-22 - Updated for 1200x900 main screenshots and automated CSV-driven workflow*
