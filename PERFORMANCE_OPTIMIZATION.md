# Performance Optimization Guide - Edwards Group Holdings Website

## Critical Image Compression Needed

### High Priority Images (Massive files that need immediate compression)

**PNG Files:**
- `assets/tj-stocks.png` - **26MB** → Target: <200KB (99%+ reduction)
- `assets/tj-adv00.png` - **15MB** → Target: <200KB (99%+ reduction)

**JPG Files:**
- `assets/tj-allstaff-stairs.jpg` - **21MB** → Target: <200KB (99%+ reduction)
- `assets/tj-comp-it-long.jpg` - **16MB** → Target: <200KB (99%+ reduction)
- `assets/tj-design.jpg` - **14MB** → Target: <200KB (99%+ reduction)
- `assets/tj-editorial00.jpg` - **14MB** → Target: <200KB (99%+ reduction)
- `assets/tj-allstaff-sidewalk.jpg` - **14MB** → Target: <200KB (99%+ reduction)
- `assets/tj-it.jpg` - **13MB** → Target: <200KB (99%+ reduction)
- `assets/tj-frontdesk01.jpg` - **12MB** → Target: <200KB (99%+ reduction)
- `assets/tj-sports.jpg` - **12MB** → Target: <200KB (99%+ reduction)

## Recommended Compression Settings

### For Team Photos (displayed at 200px height)
- **Format**: JPG or WebP
- **Dimensions**: 400x300px (2x for retina)
- **Quality**: 80-85% JPG / 75-80% WebP
- **Target size**: <150KB each

### For Hero Images
- **Format**: JPG or WebP
- **Dimensions**: 1920x1080px maximum
- **Quality**: 85% JPG / 80% WebP
- **Target size**: <300KB each

### For Screenshots/Graphics
- **Format**: PNG or WebP
- **Optimize**: Use tools like TinyPNG or ImageOptim
- **Target size**: <200KB each

## Compression Tools

### Online Tools
- **TinyPNG**: https://tinypng.com/ (PNG/JPG)
- **Squoosh**: https://squoosh.app/ (All formats, Google tool)
- **ImageOptim**: https://imageoptim.com/online (All formats)

### Command Line Tools
```bash
# Install ImageMagick
brew install imagemagick

# Batch compress JPGs to 400px width, 85% quality
for file in assets/*.jpg; do
    convert "$file" -resize 400x300^ -quality 85 "${file%.*}_optimized.jpg"
done

# Convert to WebP
for file in assets/*.jpg; do
    cwebp -q 80 "$file" -o "${file%.*}.webp"
done
```

## Performance Improvements Implemented

### ✅ Completed Optimizations
1. **Lazy Loading**: Added for all images with `data-src` attribute
2. **Resource Preloading**: Critical CSS, JS, and logo preloaded
3. **Deferred JavaScript**: All scripts now load with `defer` attribute
4. **Image Optimization Hints**: Added `loading`, `decoding`, and dimensions
5. **DNS Prefetch**: Added for external resources

### 📋 Manual Steps Required
1. **Compress all images** using tools above
2. **Generate WebP versions** of all images
3. **Update HTML** to use compressed images
4. **Test on 3G connection** to verify improvements

## Expected Performance Gains

### Before Optimization
- **Total asset size**: ~228MB
- **Load time on 3G**: 30-60+ seconds
- **Largest Contentful Paint**: 10+ seconds

### After Optimization
- **Total asset size**: ~5-10MB (95%+ reduction)
- **Load time on 3G**: 3-8 seconds
- **Largest Contentful Paint**: 2-4 seconds

## Implementation Status

- ✅ JavaScript performance optimization
- ✅ CSS loading optimization
- ✅ Lazy loading implementation
- ✅ Resource preloading
- ⚠️ **Manual image compression required**
- ⚠️ **WebP format conversion needed**

## Next Steps

1. **Immediate**: Compress the top 10 largest images
2. **Phase 2**: Convert all images to WebP with JPG fallbacks
3. **Phase 3**: Implement responsive images (`srcset`)
4. **Phase 4**: Add image CDN for production

---

*This optimization will transform the site from unusable on rural 3G to fast and responsive.*