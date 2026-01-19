// Edwards Group Holdings Website JavaScript

class EdwardsGroupWebsite {
    constructor() {
        this.data = {
            newspapers: [],
            radioNetworks: [],
            printingCompanies: [],
            leadership: [],
            corporateOffice: {}
        };
        this.init();
    }

    async init() {
        try {
            // Wait for CSV data to be ready
            await this.loadData();
            this.populateContent();
            this.setupEventListeners();
            this.setupLazyLoading();
            this.setupWebPSupport();
        } catch (error) {
            console.error('Error initializing website:', error);
        }
    }

    async loadData() {
        try {
            // Use CSV manager instead of direct loading
            const result = await window.csvManager.waitForReady();
            this.data = result.data;

            if (result.state.hasError) {
                console.warn('CSV data loaded with errors:', result.state.errors);
            }
        } catch (error) {
            console.error('Error loading CSV data:', error);
        }
    }

    populateContent() {
        this.populateHomepageCards();
        this.populateNewspapersList();
        this.populateNewspapersGrid();
        this.populateRadioList();
        this.populateRadioNetworksGrid();
        this.populatePrintingList();
        this.populatePrintingCompaniesGrid();
        this.populateLeadershipGrid();
        this.populateCorporateContact();
    }

    populateHomepageCards() {
        // Populate Publishing card
        const publishingList = document.querySelector('.card .market-list');
        if (publishingList && this.data.newspapers.length) {
            // Clear existing items
            while (publishingList.firstChild) {
                publishingList.removeChild(publishingList.firstChild);
            }
            // Add newspaper items
            this.data.newspapers.forEach(newspaper => {
                const li = document.createElement('li');
                li.textContent = `${newspaper.newspaper_name} (${newspaper.city}, ${newspaper.state})`;
                publishingList.appendChild(li);
            });
        }

        // Populate Radio card
        const radioLists = document.querySelectorAll('.card .market-list');
        const radioList = radioLists[1]; // Second market-list is for radio
        if (radioList && this.data.radioNetworks.length) {
            // Clear existing items
            while (radioList.firstChild) {
                radioList.removeChild(radioList.firstChild);
            }
            // Add radio network items
            this.data.radioNetworks.forEach(network => {
                const li = document.createElement('li');
                li.textContent = `${network.radio_network} (${network.city}, ${network.state})`;
                radioList.appendChild(li);
            });
        }

        // Populate Printing card
        const printingList = radioLists[2]; // Third market-list is for printing
        if (printingList && this.data.printingCompanies.length) {
            // Clear existing items
            while (printingList.firstChild) {
                printingList.removeChild(printingList.firstChild);
            }
            // Add printing company items
            this.data.printingCompanies.forEach(company => {
                const li = document.createElement('li');
                li.textContent = `${company.printing_company} (${company.city}, ${company.state})`;
                printingList.appendChild(li);
            });
        }
    }

    populateNewspapersList() {
        const container = document.getElementById('newspapers-list');
        if (!container || !this.data.newspapers.length) return;

        const ul = document.createElement('ul');
        this.data.newspapers.forEach(newspaper => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${newspaper.newspaper_name}</strong><br>
                ${newspaper.city}, ${newspaper.state}
                ${newspaper.website ? `<br><a href="https://${newspaper.website}" target="_blank">${newspaper.website}</a>` : ''}
            `;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    populateNewspapersGrid() {
        const container = document.getElementById('newspapers-grid');
        if (!container || !this.data.newspapers.length) return;

        // Clear loading indicator
        container.innerHTML = '';

        // Helper function to generate screenshot path from newspaper name
        const getScreenshotPath = (newspaperName) => {
            const map = {
                'The Journal': 'tj-thumb.webp',
                'The Advertiser': 'ta-thumb.webp',
                'The Ranger': 'tr-thumb.webp',
                'The Lander Journal': 'lj-thumb.webp',
                'Wind River News': 'wrn-thumb.svg'
            };
            return map[newspaperName] || 'placeholder-thumb.svg';
        };

        // Helper function to generate media properties anchor
        const getMediaPropertiesAnchor = (newspaperName) => {
            return newspaperName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        };

        this.data.newspapers.forEach(newspaper => {
            const card = document.createElement('div');
            card.className = 'card';

            const screenshotPath = getScreenshotPath(newspaper.newspaper_name);
            const mediaAnchor = getMediaPropertiesAnchor(newspaper.newspaper_name);

            card.innerHTML = `
                <h3>${newspaper.newspaper_name}</h3>

                ${newspaper.website ? `
                <!-- Website Preview -->
                <a href="https://${newspaper.website}" target="_blank" rel="noopener" class="property-preview">
                    <img src="assets/screenshots/publishing/${screenshotPath}"
                         alt="${newspaper.newspaper_name} Homepage"
                         class="screenshot-thumb"
                         loading="lazy">
                    <div class="preview-overlay">
                        <span class="preview-text">Visit Site →</span>
                    </div>
                </a>
                ` : `
                <!-- No Website Preview -->
                <div class="property-preview">
                    <img src="assets/screenshots/publishing/${screenshotPath}"
                         alt="${newspaper.newspaper_name}"
                         class="screenshot-thumb"
                         loading="lazy">
                </div>
                `}

                <div class="mb-4">
                    <p class="text-sm font-bold">${newspaper.city}, ${newspaper.state}</p>
                    ${newspaper.county ? `<p class="text-sm text-muted">${newspaper.county} County</p>` : ''}
                    ${newspaper.street_address ? `<p class="text-sm text-muted">${newspaper.street_address}</p>` : ''}
                    ${newspaper.phone ? `<p class="text-sm mt-2">Phone: ${newspaper.phone}</p>` : ''}
                </div>

                <div class="mb-4">
                    <h4 class="text-sm font-bold mb-2">Coverage</h4>
                    <p class="text-sm text-muted">Local news, sports, and community events for ${newspaper.city} and surrounding areas.</p>
                </div>

                <div class="property-meta">
                    ${newspaper.website ? `<span class="property-badge">${newspaper.website}</span>` : '<span class="property-badge">Print Edition</span>'}
                    <a href="media-properties.html#${mediaAnchor}" class="text-accent text-sm" style="font-weight: 600;">View Details →</a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    populateRadioList() {
        const container = document.getElementById('radio-list');
        if (!container || !this.data.radioNetworks.length) return;

        const ul = document.createElement('ul');
        this.data.radioNetworks.forEach(network => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${network.radio_network}</strong><br>
                ${network.city}, ${network.state} - ${network.stations_operated} stations
                ${network.website ? `<br><a href="https://${network.website}" target="_blank">${network.website}</a>` : ''}
            `;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    populateRadioNetworksGrid() {
        const container = document.getElementById('radio-networks-grid');
        if (!container || !this.data.radioNetworks.length) return;

        // Clear loading indicator
        container.innerHTML = '';

        // Helper function to generate screenshot path from network name
        const getScreenshotPath = (networkName) => {
            const map = {
                'Wyotoday': 'wy-thumb.webp',
                'True North Radio Network': 'tn-thumb.webp',
                'Caro': 'ta-widl-thumb.webp'
            };
            return map[networkName] || 'placeholder-thumb.svg';
        };

        // Helper function to generate media properties anchor
        const getMediaPropertiesAnchor = (networkName) => {
            const map = {
                'Wyotoday': 'wyotoday-network',
                'True North Radio Network': 'true-north-radio',
                'Caro': 'widl-radio'
            };
            return map[networkName] || networkName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        };

        this.data.radioNetworks.forEach(network => {
            const card = document.createElement('div');
            card.className = 'card';

            const screenshotPath = getScreenshotPath(network.radio_network);
            const mediaAnchor = getMediaPropertiesAnchor(network.radio_network);

            // Build stations list
            let stationsList = '';
            for (let i = 1; i <= 5; i++) {
                const station = network[`station_${i}`];
                if (station && station.trim()) {
                    stationsList += `<li>${station}</li>`;
                }
            }

            // Clean up website URL (remove https:// if present)
            let websiteDisplay = network.website ? network.website.replace(/^https?:\/\//, '') : '';

            card.innerHTML = `
                <h3>${network.radio_network}</h3>

                ${network.website ? `
                <!-- Website Preview -->
                <a href="https://${websiteDisplay}" target="_blank" rel="noopener" class="property-preview">
                    <img src="assets/screenshots/radio/${screenshotPath}"
                         alt="${network.radio_network} Homepage"
                         class="screenshot-thumb"
                         loading="lazy">
                    <div class="preview-overlay">
                        <span class="preview-text">Visit Site →</span>
                    </div>
                </a>
                ` : `
                <!-- No Website Preview -->
                <div class="property-preview">
                    <img src="assets/screenshots/radio/${screenshotPath}"
                         alt="${network.radio_network}"
                         class="screenshot-thumb"
                         loading="lazy">
                </div>
                `}

                <div class="mb-4">
                    <p class="text-sm font-bold">${network.city}, ${network.state}</p>
                    ${network.county ? `<p class="text-sm text-muted">${network.county} County</p>` : ''}
                    ${network.phone ? `<p class="text-sm mt-2">Phone: ${network.phone}</p>` : ''}
                </div>

                <div class="mb-4">
                    <h4 class="text-sm font-bold mb-2">Stations (${network.stations_operated})</h4>
                    <ul class="market-list text-sm">
                        ${stationsList}
                    </ul>
                </div>

                <div class="property-meta">
                    ${network.website ? `<span class="property-badge">${websiteDisplay}</span>` : '<span class="property-badge">Radio Network</span>'}
                    <a href="media-properties.html#${mediaAnchor}" class="text-accent text-sm" style="font-weight: 600;">View Details →</a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    populatePrintingList() {
        const container = document.getElementById('printing-list');
        if (!container || !this.data.printingCompanies.length) return;

        const ul = document.createElement('ul');
        this.data.printingCompanies.forEach(company => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${company.printing_company}</strong><br>
                ${company.city}, ${company.state}
                ${company.website ? `<br><a href="https://${company.website}" target="_blank">${company.website}</a>` : ''}
            `;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    populatePrintingCompaniesGrid() {
        const container = document.getElementById('printing-companies-grid');
        if (!container || !this.data.printingCompanies.length) return;

        // Clear loading indicator
        container.innerHTML = '';

        // Helper function to generate screenshot path from company name
        const getScreenshotPath = (companyName) => {
            const map = {
                'The Journal Digital Press': 'tj-dp-thumb.webp',
                'Edwards Printing': 'ep-thumb.webp',
                'Heritage Press': 'hp-thumb.webp',
                'Ranger Printers': 'rp-thumb.webp'
            };
            return map[companyName] || 'placeholder-thumb.svg';
        };

        // Helper function to generate media properties anchor
        const getMediaPropertiesAnchor = (companyName) => {
            const map = {
                'The Journal Digital Press': 'journal-digital-press',
                'Edwards Printing': 'edwards-printing',
                'Heritage Press': 'heritage-press',
                'Ranger Printers': 'ranger-printers'
            };
            return map[companyName] || companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        };

        // Helper function to generate description
        const getDescription = (companyName, city) => {
            const map = {
                'The Journal Digital Press': 'High-quality digital printing services',
                'Edwards Printing': 'Commercial printing solutions',
                'Heritage Press': 'Serving the printing needs of the Thumb region',
                'Ranger Printers': `Quality printing services for Fremont County`
            };
            return map[companyName] || `Professional printing services for ${city} and surrounding areas`;
        };

        this.data.printingCompanies.forEach(company => {
            const card = document.createElement('div');
            card.className = 'card';

            const screenshotPath = getScreenshotPath(company.printing_company);
            const mediaAnchor = getMediaPropertiesAnchor(company.printing_company);
            const description = getDescription(company.printing_company, company.city);

            card.innerHTML = `
                <h3>${company.printing_company}</h3>

                ${company.website ? `
                <!-- Website Preview -->
                <a href="https://${company.website}" target="_blank" rel="noopener" class="property-preview">
                    <img src="assets/screenshots/printing/${screenshotPath}"
                         alt="${company.printing_company} Homepage"
                         class="screenshot-thumb"
                         loading="lazy">
                    <div class="preview-overlay">
                        <span class="preview-text">Visit Site →</span>
                    </div>
                </a>
                ` : `
                <!-- No Website Preview -->
                <div class="property-preview">
                    <img src="assets/screenshots/printing/${screenshotPath}"
                         alt="${company.printing_company}"
                         class="screenshot-thumb"
                         loading="lazy">
                </div>
                `}

                <div class="mb-4">
                    <p class="text-sm font-bold">${company.city}, ${company.state}</p>
                    <p class="text-sm text-muted">${description}</p>
                    ${company.phone ? `<p class="text-sm mt-2">Phone: ${company.phone}</p>` : ''}
                </div>

                <div class="property-meta">
                    ${company.website ? `<span class="property-badge">${company.website}</span>` : `<span class="property-badge">${company.county} County</span>`}
                    <a href="media-properties.html#${mediaAnchor}" class="text-accent text-sm" style="font-weight: 600;">View Details →</a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    populateLeadershipGrid() {
        const container = document.getElementById('leadership-grid');
        if (!container || !this.data.leadership.length) return;

        // Skip if on leadership.html page (has its own detailed implementation)
        if (window.location.pathname.includes('leadership.html')) return;

        this.data.leadership.forEach(leader => {
            const card = document.createElement('div');
            card.className = 'card leadership-card';
            card.style.padding = 'var(--space-6)';
            card.innerHTML = `
                <h3 style="font-size: var(--text-lg); margin-bottom: var(--space-2)">${leader.first_name} ${leader.last_name}</h3>
                <p class="text-muted" style="margin-bottom: 0">${leader.position}</p>
            `;
            container.appendChild(card);
        });
    }

    populateCorporateContact() {
        const container = document.getElementById('corporate-contact');
        if (!container || !this.data.corporateOffice.company_name) return;

        // Skip if page has its own corporate contact implementation
        const pagesWithOwnImplementation = ['leadership.html', 'about.html', 'contact.html'];
        if (pagesWithOwnImplementation.some(page => window.location.pathname.includes(page))) {
            return;
        }

        container.innerHTML = `
            <p><strong>${this.data.corporateOffice.company_name}</strong></p>
            <p>${this.data.corporateOffice.street_address}</p>
            <p>${this.data.corporateOffice.city}, ${this.data.corporateOffice.state} ${this.data.corporateOffice.zip}</p>
            <p><strong>Phone:</strong> ${this.data.corporateOffice.phone}</p>
            ${this.data.corporateOffice.website ? `<p><strong>Website:</strong> <a href="https://${this.data.corporateOffice.website}" target="_blank">${this.data.corporateOffice.website}</a></p>` : ''}
        `;
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile navigation toggle
        this.setupMobileNavigation();

        // Form submissions
        this.setupFormHandlers();

        // Accessibility improvements
        this.setupAccessibilityFeatures();

        // WOW Features
        this.setupWowFeatures();
    }

    setupWowFeatures() {
        // 1. Parallax Hero Effect
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                // Only apply if hero is in view
                if (scrolled < window.innerHeight) {
                    heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
                }
            });
        }

        // 2. Card Tilt Effect (Desktop only)
        if (window.matchMedia('(min-width: 1024px)').matches) {
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'none';
                });

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -2; // Max rotation deg
                    const rotateY = ((x - centerX) / centerX) * 2;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.transform = 'translateY(0)'; // Reset
                    setTimeout(() => {
                        card.style.transition = ''; // Clear inline transition to revert to CSS
                    }, 300);
                });
            });
        }

        // 3. Mobile Swipe Navigation
        this.setupSwipeNavigation();
    }

    setupSwipeNavigation() {
        // DISABLED: Swipe navigation was hijacking normal page scrolling
        // Users should use the hamburger menu button instead (standard mobile UX)
        // Keeping this method empty to avoid breaking the call in setupWowFeatures()
    }

    toggleMenu(navMenu, toggleButton, show) {
        if (show) {
            navMenu.classList.add('active');
            toggleButton.setAttribute('aria-expanded', 'true');
            toggleButton.innerHTML = '✕';
        } else {
            navMenu.classList.remove('active');
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.innerHTML = '☰';
        }
    }

    setupMobileNavigation() {
        const toggleButton = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!toggleButton || !navMenu) return;

        toggleButton.addEventListener('click', () => {
            const isExpanded = navMenu.classList.contains('active');
            this.toggleMenu(navMenu, toggleButton, !isExpanded);
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.toggleMenu(navMenu, toggleButton, false);
            });
        });
    }

    setupFormHandlers() {
        // Handle any contact forms or newsletter signups
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    }

    handleFormSubmission(form) {
        // Basic form validation and submission handling
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Here you would typically send the data to a server
        console.log('Form submission:', data);

        // Show success message
        this.showMessage('Thank you for your message. We will get back to you soon!', 'success');
        form.reset();
    }

    setupAccessibilityFeatures() {
        // Add skip navigation link
        this.addSkipNavigation();

        // Ensure proper focus management
        this.setupFocusManagement();

        // Add keyboard navigation for dropdowns
        this.setupKeyboardNavigation();
    }

    addSkipNavigation() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-navigation';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-accent);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupFocusManagement() {
        // Ensure focus is visible and properly managed
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.setAttribute('data-focus-visible', 'true');
            });

            element.addEventListener('blur', () => {
                element.removeAttribute('data-focus-visible');
            });
        });
    }

    setupKeyboardNavigation() {
        // Add keyboard support for dropdown menus
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('a');
            const menu = dropdown.querySelector('.dropdown-menu');

            if (toggle && menu) {
                toggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
                    }
                });
            }
        });
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(messageDiv);

        // Animate in
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 5000);
    }

    // Utility methods for data access - delegate to CSV manager
    getNewspapersByState(state) {
        return window.csvManager.getNewspapersByState(state);
    }

    getRadioNetworksByState(state) {
        return window.csvManager.getRadioNetworksByState(state);
    }

    getPrintingCompaniesByState(state) {
        return window.csvManager.getPrintingCompaniesByState(state);
    }

    getLeadershipByPosition(position) {
        return window.csvManager.getLeadershipByPosition(position);
    }

    // Search functionality
    searchProperties(query) {
        return window.csvManager.searchProperties(query);
    }

    setupLazyLoading() {
        // Lazy loading for team photos and other images
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        lazyImageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                lazyImageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // WebP support detection and implementation
    setupWebPSupport() {
        // Check if browser supports WebP
        const webpSupported = (function () {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
        })();

        if (webpSupported) {
            // Replace image sources with WebP versions when available
            const images = document.querySelectorAll('img[data-webp]');
            images.forEach(img => {
                img.src = img.dataset.webp;
            });
        }
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.edwardsGroup = new EdwardsGroupWebsite();
});

