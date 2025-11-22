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
        this.populateNewspapersList();
        this.populateNewspapersGrid();
        this.populateRadioList();
        this.populatePrintingList();
        this.populateLeadershipGrid();
        this.populateCorporateContact();
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

        this.data.newspapers.forEach(newspaper => {
            const card = document.createElement('div');
            card.className = 'newspaper-card';
            card.innerHTML = `
                <h3>${newspaper.newspaper_name}</h3>
                <div class="newspaper-details">
                    <p><strong>Location:</strong> ${newspaper.city}, ${newspaper.state}</p>
                    <p><strong>County:</strong> ${newspaper.county} County</p>
                    ${newspaper.street_address ? `<p><strong>Address:</strong> ${newspaper.street_address}</p>` : ''}
                    <p><strong>Phone:</strong> ${newspaper.phone}</p>
                    ${newspaper.website ? `<p><strong>Website:</strong> <a href="https://${newspaper.website}" target="_blank">${newspaper.website}</a></p>` : ''}
                </div>
                <div class="newspaper-actions">
                    ${newspaper.website ? `<a href="https://${newspaper.website}" target="_blank" class="btn-primary">Visit Website</a>` : ''}
                    <a href="contact.html" class="btn-secondary">Contact</a>
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
        let touchStartX = 0;
        let touchEndX = 0;
        const navMenu = document.querySelector('.nav-menu');
        const toggleButton = document.querySelector('.mobile-toggle');

        if (!navMenu || !toggleButton) return;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX, navMenu, toggleButton);
        }, { passive: true });
    }

    handleSwipe(startX, endX, navMenu, toggleButton) {
        const threshold = 100; // Min distance for swipe
        const swipeDistance = endX - startX;

        // Swipe Left to Close
        if (navMenu.classList.contains('active') && swipeDistance > threshold) { // Swiping right actually closes it if it's on the right? No, menu is on right.
            // If menu is right: -100% (hidden) -> 0 (visible).
            // To close (0 -> -100%), we swipe RIGHT (positive distance)? 
            // Wait, menu slides in from RIGHT. So it's at right: 0.
            // To close, we want to push it back to right. So swipe RIGHT (towards edge).
            this.toggleMenu(navMenu, toggleButton, false);
        }

        // Swipe Left to Open (from edge)
        // Only if starting near right edge
        if (!navMenu.classList.contains('active') && startX > window.innerWidth - 50 && swipeDistance < -threshold) {
            this.toggleMenu(navMenu, toggleButton, true);
        }
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

