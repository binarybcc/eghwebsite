# Edwards Group Holdings Website - Deployment Guide

Simple deployment instructions for the EGH corporate website.

## Overview

This is a static website with dynamic CSV data loading. It requires no server-side processing and can be deployed to any web hosting service that supports static files.

## Quick Deployment

### Option 1: Simple Web Server
```bash
# For development/testing
python3 -m http.server 8000

# Access at: http://localhost:8000
```

### Option 2: Static Hosting Services

**Recommended Services:**
- **Netlify** - Drag and drop deployment
- **Vercel** - Git-based deployment
- **GitHub Pages** - Free with GitHub integration
- **AWS S3** - Scalable cloud hosting

## Pre-Deployment Checklist

### 1. File Verification
Ensure all required files are present:
- [ ] `index.html` - Homepage
- [ ] `about.html` - About page
- [ ] `leadership.html` - Leadership page
- [ ] `careers.html` - Careers page
- [ ] `contact.html` - Contact page
- [ ] `publishing.html` - Publishing division
- [ ] `radio.html` - Radio division
- [ ] `printing.html` - Printing division
- [ ] `styles.css` - Main stylesheet
- [ ] `script.js` - JavaScript functionality
- [ ] `assets/` - All images and photos
- [ ] `*.csv` - All data files

### 2. CSV Data Files
Required CSV files:
- [ ] `newspapers.csv` - Newspaper properties
- [ ] `radio_networks.csv` - Radio station data
- [ ] `printing_companies.csv` - Printing company data
- [ ] `leadership.csv` - Executive team data
- [ ] `corporate_office.csv` - Corporate office data

### 3. Image Assets
Verify all images are optimized:
- [ ] Original images in `assets/originals/`
- [ ] Optimized images in `assets/`
- [ ] WebP versions for modern browsers
- [ ] Proper naming convention followed

## Deployment Steps

### Step 1: Prepare Files
```bash
# Create deployment directory
mkdir egh-website-deploy
cd egh-website-deploy

# Copy all necessary files
cp -r /path/to/eghwebsite-master/* .

# Remove development files (if any)
rm -f README.md CLAUDE.md DEPLOYMENT.md
```

### Step 2: Test Locally
```bash
# Start local server
python3 -m http.server 8000

# Test all pages:
# http://localhost:8000/
# http://localhost:8000/about.html
# http://localhost:8000/leadership.html
# http://localhost:8000/careers.html
# http://localhost:8000/contact.html
# http://localhost:8000/publishing.html
# http://localhost:8000/radio.html
# http://localhost:8000/printing.html
```

### Step 3: Deploy to Hosting Service

#### Netlify Deployment
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Site will be live immediately
4. Configure custom domain if needed

#### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts for deployment
4. Site will be live with automatic HTTPS

#### GitHub Pages
1. Create new GitHub repository
2. Upload all files to repository
3. Go to Settings > Pages
4. Select source branch (usually main)
5. Site will be available at `username.github.io/repo-name`

#### Traditional Web Hosting
1. Upload all files via FTP/SFTP
2. Ensure files are in public_html or equivalent
3. Test all pages load correctly
4. Configure proper MIME types if needed

## Post-Deployment Configuration

### 1. Domain Configuration
- Point domain to hosting service
- Configure SSL certificate (most services provide free SSL)
- Set up www redirect if needed

### 2. Performance Optimization
- Enable gzip compression
- Set appropriate cache headers
- Configure CDN if using high-traffic deployment

### 3. Security Headers
Add these headers via hosting service or .htaccess:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 4. Analytics Setup
- Add Google Analytics code if needed
- Configure any other tracking tools

## Content Updates

### Updating Company Data
1. Edit relevant CSV files
2. Test changes locally
3. Upload updated CSV files to hosting
4. Changes will appear immediately

### Adding Team Photos
1. Follow naming convention from CLAUDE.md
2. Optimize images for web
3. Upload to `assets/` directory
4. Update HTML to replace placeholders

### Updating Content
1. Edit HTML files directly
2. Test changes locally
3. Upload updated files
4. Clear any CDN cache if applicable

## Troubleshooting

### Common Issues

**CSV Data Not Loading:**
- Check browser console for errors
- Verify CSV files are accessible
- Ensure proper MIME type for CSV (text/csv)

**Images Not Displaying:**
- Verify image paths are correct
- Check file permissions
- Ensure images are web-optimized

**Mobile Issues:**
- Test on actual mobile devices
- Check viewport meta tag
- Verify responsive CSS is loading

**Performance Issues:**
- Optimize images (use WebP where supported)
- Minimize CSS and JavaScript
- Enable compression on server

### Browser Compatibility
- Test in Chrome, Firefox, Safari, Edge
- Check mobile browsers (iOS Safari, Chrome Mobile)
- Verify functionality works without JavaScript

## Maintenance

### Regular Tasks
- [ ] Update CSV data as needed
- [ ] Add new team photos when available
- [ ] Check for broken links quarterly
- [ ] Monitor site performance
- [ ] Update contact information as needed

### Annual Tasks
- [ ] Review and update all content
- [ ] Optimize images and assets
- [ ] Test across all supported browsers
- [ ] Update any dependencies if applicable

## Support

For deployment issues:
1. Check hosting service documentation
2. Review browser console for errors
3. Test locally to isolate issues
4. Contact hosting service support if needed

---

*Edwards Group Holdings Website - Classical design with modern functionality*