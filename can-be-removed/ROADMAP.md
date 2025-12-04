# Edwards Group Holdings Website - Development Roadmap

**Version:** 2.0
**Last Updated:** 2025-01-12
**Current Branch:** 2.0

---

## 🚨 Critical Priority (Immediate Action Required)

### 1. Email System Configuration
**Status:** Broken - Contact form emails not sending
**Effort:** 1-2 hours
**Branch:** 2.0

**Problem:**
- Contact form uses PHP `mail()` function which requires server-side MTA (Mail Transfer Agent)
- Current hosting doesn't have MTA configured
- All contact form submissions fail silently

**Solution:**
- Configure SMTP email system (email_functions.php is ready, just needs credentials)
- Three options:
  1. **Gmail with App Password** (Recommended for simplicity)
     - Free, reliable, 500 emails/day limit
     - Requires 2FA enabled + App Password generation
  2. **SendGrid** (Recommended for scale)
     - Free tier: 100 emails/day
     - Professional email infrastructure
  3. **Hosting Provider SMTP**
     - Check with current host for SMTP credentials

**Implementation Steps:**
1. Choose SMTP provider and obtain credentials
2. Create `.env.production` entry for SMTP config:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_EMAIL=noreply@edwards-group.com
   ```
3. Update `simple_email.php` to use `email_functions.php` SMTP system
4. Test contact form submissions
5. Monitor email delivery logs

**Files to Modify:**
- `simple_email.php` (switch from mail() to SMTP functions)
- `.env.production` (add SMTP credentials)
- `email_config.php` (if needed for centralized config)

---

## 🔥 High Priority (Next Sprint)

### 2. Differentiated Email Routing
**Status:** Infrastructure exists but all routes point to one email
**Effort:** 1 hour
**Depends On:** Email System Configuration (#1)

**Current State:**
- All subjects/locations route to: `jcorbin@upstatetoday.com`
- Routing infrastructure exists in `simple_email.php` lines 108-132

**Goals:**
- Route emails based on inquiry type:
  - **Advertising/News** → Editorial teams
  - **Printing** → Printing division contacts
  - **Radio** → Radio network managers
  - **Careers** → HR department
  - **Technical** → IT support
- Location-based secondary routing (SC, WY, MI offices)

**Implementation:**
1. Collect email addresses for each department/location
2. Update `getDestinationEmail()` function in `simple_email.php`
3. Test routing logic with each subject/location combination
4. Document email routing matrix in DEPLOYMENT.md

---

### 3. Team Photos Collection
**Status:** Content needed for 6 companies
**Effort:** Varies (depends on photo availability)
**Priority:** High (enhances credibility and local connection)

**Photos Needed:**
- ❌ **The Lander Journal (lj-)** - No photos available
- ❌ **True North Radio Network (tn-)** - No photos available
- ❌ **Caro Radio Stations** - No photos available
- ❌ **Edwards Printing (ep-)** - No photos available
- ❌ **Ranger Printers (rp-)** - No photos available
- ❌ **Heritage Press (hp-)** - No photos available

**Photos Available (Reference):**
- ✅ **The Journal (tj-)** - 15 team photos
- ✅ **WyoToday Network (wy-)** - 8 team photos
- ✅ **The Ranger (tr-)** - 4 team photos
- ✅ **The Advertiser (ta-)** - 17 individual portraits

**Technical Requirements:**
- Follow naming convention: `[code]-[description].webp`
- Optimize for web: ~800px wide, WebP format
- Create responsive variants: 300px, 500px (portraits) or 400px, 600px (groups)
- Strip EXIF data for privacy
- Use `generate-responsive-images.sh` script for automation

**Note:** Team photo display sections were removed in v1.8.1 modernization branch. Need to decide if/how to reintegrate with new photos.

---

### 4. Leadership Team Photos
**Status:** Content needed
**Effort:** 2-3 hours (photography + processing)
**Priority:** High (completes leadership.html page)

**Current State:**
- Leadership profiles exist in `leadership.csv`
- No executive headshots currently displayed
- Page loads from CSV but lacks visual engagement

**Requirements:**
- Professional headshots of all executives
- Consistent style/background
- 500px × 500px optimized WebP format
- Naming: `Cote-[FirstLast].webp`

**Implementation:**
1. Coordinate professional photography session
2. Process and optimize images
3. Update `leadership.html` to display photos
4. Create photo grid layout matching company aesthetic

---

## 📊 Medium Priority (Next Quarter)

### 5. Content Management System (CMS) Integration
**Status:** Planning phase
**Effort:** 20-40 hours
**Priority:** Medium (improves content update workflow)

**Current Limitations:**
- All content updates require CSV editing
- No user-friendly interface for non-technical staff
- Risk of CSV syntax errors breaking site

**Potential Solutions:**
- **Option 1: Headless CMS** (Strapi, Contentful)
  - Pro: Professional, scalable, API-driven
  - Con: Requires backend hosting, more complex
- **Option 2: Google Sheets Integration**
  - Pro: Familiar interface, real-time updates
  - Con: API rate limits, requires authentication
- **Option 3: Simple Admin Panel**
  - Pro: Custom-built, fully controlled
  - Con: Development time, maintenance burden

**Recommendation:** Start with Google Sheets integration for CSV files (low effort, high impact)

---

### 6. Real-Time News Feed Integration
**Status:** Planning phase
**Effort:** 10-15 hours
**Priority:** Medium (enhances homepage engagement)

**Goals:**
- Display latest headlines from The Journal, The Ranger, The Advertiser
- Auto-update without manual intervention
- Mobile-responsive news ticker or card layout

**Technical Approach:**
- RSS feed parsing from newspaper websites
- Cache results (15-minute refresh)
- Fallback content if feeds unavailable
- Link directly to newspaper articles

**Considerations:**
- Newspaper websites must have RSS/API access
- Cross-origin resource sharing (CORS) configuration
- Performance impact (async loading recommended)

---

### 7. Radio Streaming Integration
**Status:** Planning phase
**Effort:** 8-12 hours
**Priority:** Medium (adds interactive functionality)

**Goals:**
- Live streaming players for WyoToday and True North networks
- Station selection interface
- Now playing information display

**Technical Requirements:**
- Streaming URLs from radio infrastructure
- HTML5 audio player with fallback
- Mobile-friendly controls
- Low data usage for rural audiences

**Challenges:**
- Licensing and streaming rights verification
- Server bandwidth considerations
- Browser autoplay restrictions

---

### 8. E-Commerce for Printing Services
**Status:** Planning phase
**Effort:** 40-60 hours
**Priority:** Medium (revenue opportunity)

**Goals:**
- Online quote requests for printing jobs
- File upload system for print-ready artwork
- Order tracking and status updates
- Payment integration (Stripe/PayPal)

**Features:**
- Print product catalog (business cards, flyers, books, etc.)
- Custom quote calculator based on specifications
- Secure file transfer (large PDF support)
- Email notifications for order lifecycle

**Considerations:**
- PCI compliance for payment processing
- Large file upload limits (100MB+)
- Print specifications validation
- Customer account system

---

## 🔧 Technical Improvements (Ongoing)

### 9. Performance Optimization
**Status:** Good baseline, room for improvement
**Effort:** 4-6 hours
**Priority:** Low-Medium

**Current State:**
- Responsive images implemented (srcset/sizes)
- Lazy loading for below-fold content
- No CDN integration
- No service worker for offline support

**Optimization Opportunities:**
- **Critical CSS Inline** - Eliminate render-blocking CSS
- **Image CDN** - Cloudflare or Cloudinary integration
- **Service Worker** - Cache static assets for repeat visits
- **Resource Hints** - dns-prefetch, preconnect for external resources
- **Font Optimization** - Use font-display: swap, subset fonts
- **Minification** - Compress CSS/JS in production

**Target Metrics:**
- Load time: Under 2 seconds on 3G
- First Contentful Paint: Under 1.5 seconds
- Lighthouse score: 90+ across all categories

---

### 10. Enhanced Security Measures
**Status:** Strong baseline, enhancements available
**Effort:** 3-4 hours
**Priority:** Medium

**Current Security:**
- ✅ Content Security Policy (CSP) implemented
- ✅ Input validation and sanitization
- ✅ Rate limiting on contact form
- ✅ CSRF protection via referer check
- ✅ Spam pattern detection
- ✅ XSS prevention

**Additional Measures:**
- **Security Headers Audit** - Implement full OWASP recommendations
- **Subresource Integrity** - SRI hashes for external scripts
- **Security.txt** - Vulnerability disclosure policy
- **HTTPS Enforcement** - Ensure all assets use HTTPS
- **Regular Dependency Updates** - Monitor for vulnerabilities
- **Automated Security Scanning** - OWASP ZAP or similar

---

### 11. Accessibility Enhancements
**Status:** WCAG 2.1 AA compliant, can improve further
**Effort:** 2-3 hours
**Priority:** Low-Medium

**Current Accessibility:**
- ✅ Semantic HTML structure
- ✅ Alt text for images
- ✅ Keyboard navigation
- ✅ ARIA labels where needed
- ✅ Color contrast compliance

**Enhancements:**
- **Skip Links** - Improve skip navigation visibility
- **Focus Management** - Enhanced focus indicators
- **Screen Reader Testing** - Test with NVDA/JAWS
- **Reduced Motion** - Respect prefers-reduced-motion
- **High Contrast Mode** - Support Windows high contrast
- **ARIA Live Regions** - Better dynamic content announcements

**Target:** WCAG 2.1 AAA compliance where feasible

---

## 📱 Mobile & UX Improvements

### 12. Progressive Web App (PWA)
**Status:** Not implemented
**Effort:** 6-8 hours
**Priority:** Low-Medium

**Features:**
- Installable on mobile home screens
- Offline fallback page
- App-like navigation experience
- Push notifications (optional)

**Benefits:**
- Improved mobile engagement
- Better performance on repeat visits
- Works in areas with poor connectivity (rural markets)

---

### 13. Enhanced Social Media Integration
**Status:** Basic sharing links exist
**Effort:** 3-4 hours
**Priority:** Low

**Current State:**
- Contact page has social media links
- No Open Graph tags
- No Twitter Card metadata
- No social share buttons

**Enhancements:**
- **Open Graph Tags** - Rich previews when shared on Facebook/LinkedIn
- **Twitter Cards** - Enhanced Twitter sharing
- **Social Share Buttons** - Easy sharing of company pages
- **Social Feed Widgets** - Display recent posts from company accounts

---

## 📈 Analytics & Monitoring

### 14. Analytics Implementation
**Status:** Not implemented
**Effort:** 2-3 hours
**Priority:** Medium

**Recommendations:**
- **Google Analytics 4** - Standard web analytics
- **Plausible/Fathom** - Privacy-focused alternative
- **Hotjar/Microsoft Clarity** - User behavior insights

**Key Metrics to Track:**
- Page views and bounce rates
- Contact form submissions
- Navigation patterns
- Geographic distribution of visitors
- Device/browser breakdown
- Career page engagement

---

### 15. Error Monitoring & Logging
**Status:** Basic logging exists
**Effort:** 4-5 hours
**Priority:** Low-Medium

**Current State:**
- Email sending logged to temp files
- No centralized error tracking
- No real-time alerting

**Enhancements:**
- **Error Tracking Service** - Sentry, Rollbar, or similar
- **Uptime Monitoring** - UptimeRobot or Pingdom
- **Log Aggregation** - Centralize logs from all pages
- **Alerting** - Email/SMS for critical errors

---

## 🎨 Design & Content

### 16. Visual Refresh
**Status:** Classical design established, minor updates possible
**Effort:** 8-12 hours
**Priority:** Low

**Potential Updates:**
- Modernize while maintaining classical aesthetic
- Enhanced hero sections with background imagery
- Animation/transitions for user engagement
- Updated color palette (maintain brand identity)
- Custom icons to replace emoji-based system

---

### 17. Historical Content & Storytelling
**Status:** Content collection needed
**Effort:** Varies (depends on content availability)
**Priority:** Low

**Content Opportunities:**
- Company founding stories
- Historical newspaper front pages
- Community involvement highlights
- Awards and recognition
- Timeline of growth and acquisitions
- Employee spotlight features

---

## 🤝 Community & Engagement

### 18. Employee Portal
**Status:** Not planned
**Effort:** 30-50 hours
**Priority:** Low (future consideration)

**Potential Features:**
- Internal news and announcements
- HR resources and policies
- Time-off requests
- Company directory
- Document sharing

---

### 19. Community Partnerships Page
**Status:** Not implemented
**Effort:** 4-6 hours
**Priority:** Low

**Content:**
- Local sponsorships
- Educational partnerships
- Charitable initiatives
- Community event coverage

---

## 🔄 Maintenance & Operations

### 20. Automated Deployment Pipeline
**Status:** Manual deployment via deploy.sh
**Effort:** 6-8 hours
**Priority:** Low

**Current Process:**
- Manual script execution: `./deploy.sh --yes`
- No automated testing before deployment
- No rollback mechanism

**CI/CD Enhancements:**
- GitHub Actions workflow
- Automated testing on pull requests
- Staging environment for testing
- One-click rollback capability
- Deployment notifications

---

### 21. Backup & Disaster Recovery
**Status:** Manual backups via deploy.sh
**Effort:** 3-4 hours
**Priority:** Medium

**Current State:**
- Backups created during deployment (optional)
- Stored locally only
- No automated schedule

**Improvements:**
- Automated daily backups
- Off-site backup storage (S3, Backblaze)
- Database backup if CMS implemented
- Documented recovery procedures
- Regular recovery testing

---

## 📅 Implementation Timeline

### Q1 2025 (Immediate)
- [ ] Email SMTP Configuration (#1) - **Week 1**
- [ ] Differentiated Email Routing (#2) - **Week 1**
- [ ] Leadership Team Photos (#4) - **Week 2-3**
- [ ] Analytics Implementation (#14) - **Week 4**

### Q2 2025 (Short Term)
- [ ] Team Photos Collection (#3) - **Ongoing**
- [ ] Performance Optimization (#9) - **Month 1**
- [ ] Enhanced Security Measures (#10) - **Month 1**
- [ ] CMS Integration Planning (#5) - **Month 2**
- [ ] Error Monitoring (#15) - **Month 2**
- [ ] Backup & Disaster Recovery (#21) - **Month 3**

### Q3 2025 (Medium Term)
- [ ] Real-Time News Feed (#6) - **Month 1**
- [ ] CMS Implementation (#5) - **Month 1-2**
- [ ] Radio Streaming Integration (#7) - **Month 2**
- [ ] Accessibility Enhancements (#11) - **Month 3**
- [ ] PWA Implementation (#12) - **Month 3**

### Q4 2025 (Long Term)
- [ ] E-Commerce for Printing (#8) - **Month 1-3**
- [ ] Enhanced Social Media (#13) - **Month 3**
- [ ] Visual Refresh (#16) - **Month 3-4**

### 2026+ (Future)
- [ ] Employee Portal (#18)
- [ ] Community Partnerships Page (#19)
- [ ] Automated CI/CD Pipeline (#20)
- [ ] Historical Content Collection (#17)

---

## 🎯 Success Metrics

### Traffic & Engagement
- 50% increase in monthly unique visitors
- 30% reduction in bounce rate
- 3x increase in contact form submissions
- 25% increase in career page applications

### Performance
- Lighthouse score: 90+ across all categories
- Page load time: Under 2 seconds on 3G
- 99.9% uptime (excluding maintenance)

### Business Impact
- 5x increase in online printing quote requests
- Measurable ROI from CMS time savings
- Improved brand perception scores
- Enhanced local SEO rankings

---

## 📝 Notes

**Priority Definitions:**
- **Critical** - Broken functionality, immediate fix required
- **High** - Important for user experience or business goals
- **Medium** - Valuable improvements, schedule when resources available
- **Low** - Nice-to-have enhancements, no urgency

**Effort Estimates:**
- Based on single developer with full-stack capabilities
- Includes planning, implementation, testing, and documentation
- Does not include content creation time (photos, copy, etc.)

**Branch Strategy:**
- `master` - Production-ready code
- `2.0` - Next major release development
- Feature branches for individual tasks

**Review Cycle:**
- Review roadmap monthly
- Adjust priorities based on business needs
- Archive completed items
- Add new discoveries

---

**Last Updated:** 2025-01-12
**Next Review:** 2025-02-01
