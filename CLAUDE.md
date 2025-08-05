# CLAUDE.md - Edwards Group Holdings Website Development Notes

## Project Overview
Edwards Group Holdings corporate website - a multi-state media company with operations in South Carolina, Wyoming, and Michigan. Classical design with modern functionality serving newspapers, radio stations, and printing companies.

## Asset Management System

### Image Naming Convention
Assets in the `/assets` folder follow a strict naming convention based on company/location:

**Publishing Division:**
- **tj-*** - The Journal (Seneca, SC)
- **tr-*** - The Ranger (Riverton, WY)  
- **ta-*** - The Advertiser (Caro, MI)
- **lj-*** - The Lander Journal (Lander, WY)

**Radio Division:**
- **wy-*** - WyoToday Network (Riverton, WY)
- **tn-*** - True North Radio Network (Alpena, MI)

**Printing Division:**
- **ep-*** - Edwards Printing (Westminster, SC)
- **rp-*** - Ranger Printers (Riverton, WY)
- **hp-*** - Heritage Press (Caro, MI)

**Corporate:**
- **Cote-*** - Corporate/Leadership photos
- **egh-*** - Corporate branding assets

### Team Photos Status

**Currently Available:**
- **The Journal (tj-)**: 15 team photos covering all departments and workspaces
- **WyoToday (wy-)**: wy-allstaff.jpg, wy-staff.jpg, wy-staff00.jpg, wy-kshields.webp  
- **The Ranger (tr-)**: tr-kshields.webp, tr-pressmen.jpg, tr-pressmen01.jpg, tr-rstover.webp
- **The Advertiser (ta-)**: 17 individual team member photos (portrait format, WebP optimized)

**Photos Needed (Future):**
- **The Lander Journal (lj-)**: No photos available yet
- **True North Radio Network (tn-)**: No photos available yet
- **Edwards Printing (ep-)**: No photos available yet
- **Ranger Printers (rp-)**: No photos available yet
- **Heritage Press (hp-)**: No photos available yet

## Technical Architecture

### File Structure
```
eghwebsite/
├── index.html              # Homepage
├── about.html               # About Us page
├── leadership.html          # Leadership team
├── careers.html             # Career opportunities
├── contact.html             # Contact information
├── publishing.html          # Publishing division
├── radio.html               # Radio division
├── printing.html            # Printing division
├── styles.css               # Main stylesheet
├── script.js                # JavaScript functionality
├── *.csv                    # Data files
├── /assets/                 # Images and Photos
├── README.md               # General project documentation
└── CLAUDE.md               # Development notes (this file)
```

### Data Management
- **CSV-driven content**: All company data loaded dynamically from CSV files
- **Newspapers**: newspapers.csv
- **Radio Networks**: radio_networks.csv  
- **Printing Companies**: printing_companies.csv
- **Leadership**: leadership.csv
- **Corporate Office**: corporate_office.csv

### Recent Updates (2025-01-05)

**Major Modernization (Branch: modernization):**
- **SEO Enhancement**: Comprehensive JSON-LD structured data added to all pages
- **Security Upgrade**: Content Security Policy and enhanced headers implemented
- **Performance Optimization**: Responsive images with srcset/sizes attributes
- **Team captions cleared** for future customization in all sections

**SEO Structured Data Implementation:**
- Organization schema with subsidiaries and leadership team
- Local business data for all newspaper locations (The Journal, Ranger, Advertiser, Lander Journal)
- Contact points and service area definitions for multi-state operations
- Publishing division services and coverage areas
- 700+ lines of structured markup across homepage, publishing, leadership, and contact pages

**Security Enhancements:**
- Content Security Policy headers via meta tags on all HTML pages
- Enhanced PHP email handler with HSTS, Referrer Policy, Permissions Policy
- Restricted external resource loading and frame embedding protection
- Comprehensive security headers for API endpoints

**Responsive Images System:**
- Created `/assets/responsive/` directory with 100+ image variants
- **Logo variants**: 200px, 400px, original sizes with smart srcset
- **Team photos**: 400px, 600px variants for tj-, tr-, wy- images  
- **Portrait photos**: 300px, 500px variants for ta- team members
- **Complete coverage**: All available WebP images now implemented with responsive variants
- Lazy loading implementation for all below-fold images
- Automated responsive image generation workflow created

**Team Photo Coverage Completed:**
- **The Journal (tj-)**: 15 team photos with full responsive implementation
- **The Ranger (tr-)**: 4 team photos including previously unused tr-pressmen.webp
- **WyoToday Network (wy-)**: 8 team photos (expanded from 3) with JPG→WebP conversion
- **The Advertiser (ta-)**: 17 individual portraits with responsive variants
- All team sections now use consistent responsive image pattern with lazy loading

**Image Optimization (Previous):**
- All Advertiser (ta-) team photos converted to WebP format and resized to 800px wide
- EXIF data stripped from all ta- images for privacy and performance
- Portrait orientation enforced for all team member photos
- tr-kshields.webp and tr-rstover.webp converted and optimized

**Publishing Page Enhancements:**
- Added all 15 tj- department photos to The Journal team section  
- Increased team photo height from 200px to 280px (desktop) to prevent head cropping
- Responsive breakpoints updated: 210px (tablet), 170px (mobile)

**File Management:**
- ta-LandynSchott2.webp renamed (space removed) and properly referenced
- tj-logo-bw.webp removed from team display (kept in assets)

### Team Photo Implementation

**CSS Classes:**
- `.team-photo` - Main photo styling (280px height desktop, responsive)
- `.photo-placeholder` - Fallback for missing photos
- `.team-sections` - Container for all team sections
- `.team-toggle` - Clickable header with expand/collapse
- `.team-gallery` - Photo gallery container (hidden by default)
- `.team-grid` - Grid layout for team members

**JavaScript Functionality:**
- `toggleTeam(teamId)` - Expands/collapses team sections
- Toggle icons change from `+` to `−` 
- Accessibility attributes managed automatically
- Keyboard navigation support

**Responsive Breakpoints:**
- Desktop: 280px photo height (updated for portrait images)
- Tablet (768px): 210px photo height (updated)
- Mobile (480px): 170px photo height (updated)

## Company Structure & Mapping

### Publishing Division
| Company | Location | Code | Page Section | Photos |
|---------|----------|------|--------------|---------|
| The Journal | Seneca, SC | tj- | publishing.html | ✅ Available |
| The Ranger | Riverton, WY | tr- | publishing.html | ✅ Available |
| The Advertiser | Caro, MI | ta- | publishing.html | ✅ Available |
| The Lander Journal | Lander, WY | lj- | publishing.html | ❌ Needed |

### Radio Division  
| Company | Location | Code | Page Section | Photos |
|---------|----------|------|--------------|---------|
| WyoToday Network | Riverton, WY | wy- | radio.html | ✅ Available |
| True North Radio | Alpena, MI | tn- | radio.html | ❌ Needed |
| Caro Stations | Caro, MI | - | radio.html | ❌ Needed |

### Printing Division
| Company | Location | Code | Page Section | Photos |
|---------|----------|------|--------------|---------|
| The Journal Digital Press | Seneca, SC | - | printing.html | ❌ Needed |
| Edwards Printing | Westminster, SC | ep- | printing.html | ❌ Needed |
| Ranger Printers | Riverton, WY | rp- | printing.html | ❌ Needed |
| Heritage Press | Caro, MI | hp- | printing.html | ❌ Needed |

## Development Guidelines

### Adding New Team Photos
1. **Follow naming convention**: `[code]-[description].jpg`
2. **Optimize images**: Recommended ~200px height, web-optimized
3. **Update HTML**: Replace `.photo-placeholder` with `<img>` tag
4. **Use semantic alt text**: Describe team/role for accessibility
5. **Test responsive design**: Verify all breakpoints

### CSS Design System
- **Primary Color**: `#1a365d` (Deep blue)
- **Secondary Color**: `#2c5282` (Medium blue) 
- **Accent Color**: `#3182ce` (Light blue)
- **Font Family**: Georgia serif (classical aesthetic)
- **Border Radius**: 8px consistent
- **Shadows**: Layered depth system
- **Transitions**: 0.3s ease standard

### Accessibility Standards
- **WCAG 2.1 AA compliance** maintained
- **Keyboard navigation** for all interactive elements
- **Screen reader support** with proper ARIA labels
- **Focus management** with visible indicators
- **Skip navigation** links implemented
- **Alt text** for all images required

## Performance Considerations
- **Mobile-first responsive design**
- **Optimized for rural internet connections**
- **Local font loading** for reliability
- **Compressed CSS/JS** 
- **Image optimization** required for all assets
- **CSV caching** for faster subsequent loads

## Site Architecture & Navigation

### Current Navigation Structure
```
Home
├── Our Companies (Dropdown)
│   ├── Publishing Division
│   ├── Radio Division
│   └── Printing Division
├── About Us
├── Leadership
├── Careers
└── Contact
```

### Page Structure Implemented
- **Homepage** (`index.html`) - Corporate overview with company stats
- **Publishing** (`publishing.html`) - 4 newspapers, 2 magazines, team sections
- **Radio** (`radio.html`) - 10 stations across 3 networks, programming info
- **Printing** (`printing.html`) - 4 printing companies, services, capabilities
- **About** (`about.html`) - Company history and mission
- **Leadership** (`leadership.html`) - Executive team profiles
- **Careers** (`careers.html`) - Employment opportunities
- **Contact** (`contact.html`) - Multi-location contact information

### Geographic Markets Served
- **South Carolina**: Oconee County (Seneca, Westminster)
- **Wyoming**: Fremont County (Riverton, Lander)
- **Michigan**: Tuscola County (Caro), Northern Michigan (Alpena)

## Technical Specifications

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data**: CSV-driven dynamic content
- **Design**: Classical typography with modern responsive layout
- **Performance**: Optimized for rural internet connections (3G+)

### Browser Support & Performance Targets
- **Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile with full responsiveness
- **Load Time**: Under 3 seconds on 3G connections
- **Accessibility**: WCAG 2.1 AA compliance maintained

### Design System Details
- **Typography**: Georgia serif for classical elegance
- **Color Palette**: Professional blues with heritage accents
- **Layout**: Newspaper-inspired grid system
- **Components**: Consistent card-based design patterns
- **Icons**: Emoji-based for universal compatibility

## Content Management & Updates

### CSV Data Structure
All company information stored in structured CSV files:
- **newspapers.csv**: Property details, contact info, websites
- **radio_networks.csv**: Station listings, formats, coverage areas
- **printing_companies.csv**: Service capabilities, locations
- **leadership.csv**: Executive team information
- **corporate_office.csv**: Headquarters contact details

### Content Update Process
1. **Data Updates**: Modify CSV files for company information
2. **Team Photos**: Follow naming convention, optimize for web
3. **Testing**: Verify responsive design and functionality
4. **Deployment**: Upload files and verify CSV loading

## Future Enhancements Planned
- Content Management System integration
- Real-time news feed integration  
- Radio streaming integration
- Enhanced social media integration
- Employee portal functionality
- E-commerce capabilities for printing services

## Project Completion Status

### ✅ Completed Features
- [x] Core website structure with 8 pages
- [x] CSV data integration and dynamic content
- [x] Responsive mobile-first design
- [x] Team photo system with toggle functionality
- [x] Classical design with modern usability
- [x] WCAG accessibility compliance
- [x] Local SEO optimization structure
- [x] Cross-platform browser compatibility

### 📋 Content Collection Priorities (Future)
1. **Team Photos**: Professional photos for remaining 6 companies
2. **Leadership Photos**: Executive headshots for enhanced profiles
3. **Facility Photos**: Property and equipment imagery
4. **Historical Content**: Company founding stories and milestones
5. **Community Involvement**: Local partnerships and sponsorships
6. **Awards/Recognition**: Industry achievements and certifications

## Notes for Future Development
- Maintain classical aesthetic with modern functionality
- All team sections use consistent toggle pattern
- Company pages follow similar structure for maintainability
- Asset naming convention is critical for scalability
- CSV data structure allows easy content updates
- Mobile responsiveness is essential for rural markets

## Quick Reference Commands
```bash
# Start local development server
python3 -m http.server 8000

# Check for missing team photos
ls assets/ | grep -E "(ta-|lj-|tn-|ep-|rp-|hp-)"

# Validate HTML structure
# (Use browser dev tools or HTML validator)
```

---
*Last Updated: 2024 - Team photo system implementation completed for tj-, wy-, tr- companies*