# Edwards Group Holdings Corporate Website

A professional corporate website for Edwards Group Holdings, a multi-state media company with operations across South Carolina, Wyoming, and Michigan.

## Overview

Edwards Group Holdings operates:
- **4 Newspapers** across 3 states
- **10 Radio Stations** in 3 networks
- **4 Printing Companies** supporting local businesses
- **Corporate headquarters** in Seneca, SC

## Website Features

### Design
- Classical design with modern functionality
- Responsive mobile-first layout
- Professional typography using Georgia serif fonts
- Classical color scheme with blues and heritage colors
- Accessible design meeting WCAG compliance standards

### Pages Included
1. **Homepage** (`index.html`) - Corporate overview and company highlights
2. **Publishing Division** (`publishing.html`) - Newspaper operations and services
3. **Radio Division** (`radio.html`) - Radio networks and station information
4. **Printing Division** (`printing.html`) - Commercial printing services
5. **About Us** (`about.html`) - Company history and mission
6. **Leadership** (`leadership.html`) - Executive team profiles
7. **Careers** (`careers.html`) - Employment opportunities and benefits
8. **Contact** (`contact.html`) - Contact information and inquiry form

### Dynamic Content
- CSV data integration for company information
- Responsive navigation with dropdown menus
- Interactive contact forms
- Smooth scrolling navigation
- Mobile-responsive design

## Technical Implementation

### Technologies Used
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - CSV data processing and interactive features
- **CSV Data Files** - Dynamic content management

### Key Files
- `index.html` - Main homepage
- `styles.css` - Complete stylesheet with responsive design
- `script.js` - JavaScript functionality and CSV processing
- `*.csv` - Data files for newspapers, radio, printing, leadership, and corporate info

### Data Sources
The website dynamically loads content from CSV files:
- `newspapers.csv` - Newspaper properties
- `radio_networks.csv` - Radio station information
- `printing_companies.csv` - Printing service locations
- `leadership.csv` - Executive team members
- `corporate_office.csv` - Corporate headquarters information

## Setup Instructions

### Local Development
1. Clone or download the project files
2. Ensure all files are in the same directory
3. Start a local web server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```
4. Open your browser to `http://localhost:8000`

### Deployment
1. Upload all files to your web server
2. Ensure the CSV files are accessible from the same domain
3. Configure your web server to serve static files
4. Test all functionality including CSV data loading

## Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Performance Features
- Optimized for fast loading on rural internet connections
- Compressed CSS and efficient JavaScript
- Responsive images and optimized assets
- Local font loading for reliability

## SEO Optimization
- Semantic HTML structure
- Meta descriptions for all pages
- Proper heading hierarchy
- Alt text for images
- Local search optimization for each market

## Accessibility Features
- WCAG 2.1 AA compliance
- Screen reader compatible
- Keyboard navigation support
- Focus management
- Skip navigation links
- High contrast design

## Content Management

### Updating Company Information
Edit the CSV files to update:
- **Leadership team** - `leadership.csv`
- **Newspaper details** - `newspapers.csv`
- **Radio stations** - `radio_networks.csv`
- **Printing companies** - `printing_companies.csv`
- **Corporate office** - `corporate_office.csv`

### Adding New Content
1. Update relevant CSV files with new information
2. Test locally to ensure proper loading
3. Deploy updated files to production

## Business Units

### Publishing Division
- The Journal (Seneca, SC)
- The Ranger (Riverton, WY)
- The Lander Journal (Lander, WY)
- The Advertiser (Caro, MI)

### Radio Division
- **WyoToday Network** (Wyoming) - 5 stations
- **True North Radio Network** (Michigan) - 3 stations
- **Caro Stations** (Michigan) - 2 stations

### Printing Division
- The Journal Digital Press (SC)
- Edwards Printing (SC)
- Heritage Press (MI)
- Ranger Printers (WY)

## Contact Information

**Corporate Headquarters:**
Edwards Group Holdings
125 Eagles Nest Dr
Seneca, SC 29678
Phone: 864-882-3272

## Project Structure
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
├── corporate_office.csv     # Corporate office data
├── leadership.csv           # Leadership team data
├── newspapers.csv           # Newspaper properties
├── radio_networks.csv       # Radio station data
├── printing_companies.csv   # Printing company data
└── README.md               # This file
```

## Development Notes

### Design Principles
- Classical flair with modern functionality
- Community-focused messaging
- Professional trustworthiness
- Local market identity within corporate brand

### Target Audience
- Community stakeholders
- Local advertisers
- Potential employees
- Business partners
- Investors

### Performance Targets
- Load time under 3 seconds on 3G connections
- Fully responsive across all devices
- Optimized for local search in each geographic market

## Future Enhancements
- Content Management System integration
- Real-time news feed integration
- Radio streaming integration
- Enhanced social media integration
- Employee portal functionality
- E-commerce capabilities for printing services

## License
© 2024 Edwards Group Holdings. All rights reserved.

## Support
For technical support or website updates, contact the IT Director through the corporate office or use the contact form on the website.