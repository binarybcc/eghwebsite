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
            card.className = 'leadership-card';
            card.innerHTML = `
                <h3>${leader.first_name} ${leader.last_name}</h3>
                <p>${leader.position}</p>
            `;
            container.appendChild(card);
        });
    }

    populateCorporateContact() {
        const container = document.getElementById('corporate-contact');
        if (!container || !this.data.corporateOffice.company_name) return;

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

        // Mobile navigation toggle (if needed)
        this.setupMobileNavigation();

        // Form submissions (if any forms are added)
        this.setupFormHandlers();

        // Accessibility improvements
        this.setupAccessibilityFeatures();
    }

    setupMobileNavigation() {
        // Check if mobile navigation is needed
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Add mobile menu toggle if screen is small
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        if (mediaQuery.matches) {
            this.createMobileMenu();
        }

        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                this.createMobileMenu();
            } else {
                this.removeMobileMenu();
            }
        });
    }

    createMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu || navMenu.classList.contains('mobile-menu-active')) return;

        const toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-menu-toggle';
        toggleButton.innerHTML = '☰';
        toggleButton.setAttribute('aria-label', 'Toggle navigation menu');

        const navbar = document.querySelector('.navbar .container');
        navbar.insertBefore(toggleButton, navMenu);

        toggleButton.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-menu-active');
            toggleButton.innerHTML = navMenu.classList.contains('mobile-menu-active') ? '✕' : '☰';
        });
    }

    removeMobileMenu() {
        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (toggleButton) {
            toggleButton.remove();
        }
        
        if (navMenu) {
            navMenu.classList.remove('mobile-menu-active');
        }
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
            background: var(--primary-color);
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
        const webpSupported = (function() {
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

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EdwardsGroupWebsite;
}

// Team Section Toggle Functionality
function toggleTeam(teamId) {
    const teamGallery = document.getElementById(teamId);
    const toggleIcon = document.getElementById(teamId.replace('-team', '-toggle'));
    
    if (!teamGallery || !toggleIcon) return;
    
    if (teamGallery.classList.contains('hidden')) {
        // Show the team gallery
        teamGallery.classList.remove('hidden');
        teamGallery.classList.add('show');
        toggleIcon.textContent = '−';
        toggleIcon.setAttribute('aria-expanded', 'true');
    } else {
        // Hide the team gallery
        teamGallery.classList.remove('show');
        teamGallery.classList.add('hidden');
        toggleIcon.textContent = '+';
        toggleIcon.setAttribute('aria-expanded', 'false');
    }
}

// Initialize team toggles on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up accessibility attributes for team toggles
    const teamToggles = document.querySelectorAll('.team-toggle');
    teamToggles.forEach(toggle => {
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('tabindex', '0');
        
        // Add keyboard support
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    });
    
    // Set up initial states for all team galleries
    const teamGalleries = document.querySelectorAll('.team-gallery');
    teamGalleries.forEach(gallery => {
        gallery.classList.add('hidden');
    });
    
    // Set up initial states for all toggle icons
    const toggleIcons = document.querySelectorAll('.toggle-icon');
    toggleIcons.forEach(icon => {
        icon.textContent = '+';
        icon.setAttribute('aria-expanded', 'false');
    });
    
    // Initialize photo modal functionality
    initializePhotoModal();
});

// Photo Modal System
function initializePhotoModal() {
    // Create modal HTML structure
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="photo-modal-content">
            <img class="photo-modal-image" src="" alt="">
            <button class="photo-modal-close" aria-label="Close photo">×</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Get modal elements
    const modalImage = modal.querySelector('.photo-modal-image');
    const closeButton = modal.querySelector('.photo-modal-close');
    
    // Add click handlers to all team photos
    const teamPhotos = document.querySelectorAll('.team-photo');
    teamPhotos.forEach(photo => {
        photo.addEventListener('click', function(e) {
            e.preventDefault();
            openPhotoModal(this.src, this.alt);
        });
        
        // Add keyboard support
        photo.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhotoModal(this.src, this.alt);
            }
        });
        
        // Make photos focusable
        photo.setAttribute('tabindex', '0');
        photo.setAttribute('role', 'button');
        photo.setAttribute('aria-label', 'Click to view larger photo');
    });
    
    // Close modal handlers
    closeButton.addEventListener('click', closePhotoModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePhotoModal();
        }
    });
    
    // Keyboard handlers
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closePhotoModal();
        }
    });
    
    function openPhotoModal(src, alt) {
        modalImage.src = src;
        modalImage.alt = alt;
        modal.classList.add('show');
        document.body.classList.add('modal-open');
        
        // Focus management
        closeButton.focus();
    }
    
    function closePhotoModal() {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        modalImage.src = '';
        modalImage.alt = '';
        
        // Return focus to the photo that was clicked
        const activePhoto = document.activeElement;
        if (activePhoto && activePhoto.classList.contains('team-photo')) {
            activePhoto.focus();
        }
    }
}

// Team Section Toggle Functionality
function toggleTeam(teamId) {
    const teamGallery = document.getElementById(teamId);
    const toggleIcon = document.querySelector(`[onclick="toggleTeam('${teamId}')"] .toggle-icon`);
    
    if (teamGallery.classList.contains('show')) {
        teamGallery.classList.remove('show');
        if (toggleIcon) toggleIcon.textContent = '+';
        teamGallery.setAttribute('aria-expanded', 'false');
    } else {
        teamGallery.classList.add('show');
        if (toggleIcon) toggleIcon.textContent = '−';
        teamGallery.setAttribute('aria-expanded', 'true');
    }
}