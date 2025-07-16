// Edwards Group Holdings CSV Data Manager
// Handles CSV loading, caching, and data ready state management

class CSVDataManager {
    constructor() {
        this.data = {
            newspapers: [],
            radioNetworks: [],
            printingCompanies: [],
            leadership: [],
            corporateOffice: {}
        };
        this.loadingState = {
            isLoading: false,
            isReady: false,
            hasError: false,
            errors: []
        };
        this.readyCallbacks = [];
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Initialize and load all CSV data
    async initialize() {
        if (this.loadingState.isLoading) {
            return this.waitForReady();
        }

        this.loadingState.isLoading = true;
        this.loadingState.hasError = false;
        this.loadingState.errors = [];

        try {
            await this.loadAllData();
            this.loadingState.isReady = true;
            this.loadingState.isLoading = false;
            this.notifyReady();
        } catch (error) {
            this.loadingState.hasError = true;
            this.loadingState.isLoading = false;
            this.loadingState.errors.push(error);
            console.error('CSV Data Manager initialization failed:', error);
            this.notifyReady(); // Still notify, but with error state
        }
    }

    // Load all CSV files
    async loadAllData() {
        try {
            const [newspapers, radioNetworks, printingCompanies, leadership, corporateOffice] = await Promise.all([
                this.loadCSV('newspapers.csv'),
                this.loadCSV('radio_networks.csv'),
                this.loadCSV('printing_companies.csv'),
                this.loadCSV('leadership.csv'),
                this.loadCSV('corporate_office.csv')
            ]);

            this.data.newspapers = newspapers;
            this.data.radioNetworks = radioNetworks;
            this.data.printingCompanies = printingCompanies;
            this.data.leadership = leadership;
            this.data.corporateOffice = corporateOffice[0] || {};
        } catch (error) {
            console.error('Error loading CSV data:', error);
            throw error;
        }
    }

    // Load individual CSV file with caching
    async loadCSV(filename) {
        const cacheKey = filename;
        const cached = this.cache.get(cacheKey);
        
        // Check cache validity
        if (cached && (Date.now() - cached.timestamp < this.cacheTimeout)) {
            return cached.data;
        }

        try {
            const response = await fetch(filename + '?t=' + Date.now());
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
            }
            
            const text = await response.text();
            const data = this.parseCSV(text);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            
            // Return cached data if available, even if expired
            if (cached) {
                console.warn(`Using expired cache for ${filename}`);
                return cached.data;
            }
            
            // Return empty array as fallback
            return [];
        }
    }

    // Parse CSV text into array of objects
    parseCSV(text) {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index].trim();
                });
                data.push(row);
            }
        }

        return data;
    }

    // Parse CSV line handling quotes
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
                current += char;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current);
        return values;
    }

    // Register callback for when data is ready
    onReady(callback) {
        if (this.loadingState.isReady) {
            // Data is already ready, call immediately
            callback(this.data, this.loadingState);
        } else {
            // Add to queue
            this.readyCallbacks.push(callback);
        }
    }

    // Wait for data to be ready (Promise-based)
    waitForReady() {
        return new Promise((resolve) => {
            this.onReady((data, state) => {
                resolve({ data, state });
            });
        });
    }

    // Notify all waiting callbacks
    notifyReady() {
        this.readyCallbacks.forEach(callback => {
            try {
                callback(this.data, this.loadingState);
            } catch (error) {
                console.error('Error in ready callback:', error);
            }
        });
        this.readyCallbacks = [];
    }

    // Get specific dataset
    getDataset(name) {
        return this.data[name] || [];
    }

    // Get corporate office data
    getCorporateOffice() {
        return this.data.corporateOffice;
    }

    // Check if data is ready
    isDataReady() {
        return this.loadingState.isReady;
    }

    // Check if there are errors
    hasErrors() {
        return this.loadingState.hasError;
    }

    // Get loading state
    getLoadingState() {
        return { ...this.loadingState };
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Reload data (useful for development)
    async reload() {
        this.clearCache();
        this.loadingState.isReady = false;
        await this.initialize();
    }

    // Utility methods for filtered data
    getNewspapersByState(state) {
        return this.data.newspapers.filter(newspaper => newspaper.state === state);
    }

    getRadioNetworksByState(state) {
        return this.data.radioNetworks.filter(network => network.state === state);
    }

    getPrintingCompaniesByState(state) {
        return this.data.printingCompanies.filter(company => company.state === state);
    }

    getLeadershipByPosition(position) {
        return this.data.leadership.filter(leader => 
            leader.position.toLowerCase().includes(position.toLowerCase())
        );
    }

    // Search across all properties
    searchProperties(query) {
        const results = [];
        const searchTerm = query.toLowerCase();

        // Search newspapers
        this.data.newspapers.forEach(newspaper => {
            if (newspaper.newspaper_name.toLowerCase().includes(searchTerm) ||
                newspaper.city.toLowerCase().includes(searchTerm) ||
                newspaper.state.toLowerCase().includes(searchTerm)) {
                results.push({
                    type: 'newspaper',
                    name: newspaper.newspaper_name,
                    location: `${newspaper.city}, ${newspaper.state}`,
                    website: newspaper.website,
                    data: newspaper
                });
            }
        });

        // Search radio networks
        this.data.radioNetworks.forEach(network => {
            if (network.radio_network.toLowerCase().includes(searchTerm) ||
                network.city.toLowerCase().includes(searchTerm) ||
                network.state.toLowerCase().includes(searchTerm)) {
                results.push({
                    type: 'radio',
                    name: network.radio_network,
                    location: `${network.city}, ${network.state}`,
                    website: network.website,
                    data: network
                });
            }
        });

        // Search printing companies
        this.data.printingCompanies.forEach(company => {
            if (company.printing_company.toLowerCase().includes(searchTerm) ||
                company.city.toLowerCase().includes(searchTerm) ||
                company.state.toLowerCase().includes(searchTerm)) {
                results.push({
                    type: 'printing',
                    name: company.printing_company,
                    location: `${company.city}, ${company.state}`,
                    website: company.website,
                    data: company
                });
            }
        });

        return results;
    }

    // Show loading/error messages to user
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `csv-manager-message message-${type}`;
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
                if (messageDiv.parentNode) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    }
}

// Create global instance
window.csvManager = new CSVDataManager();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.csvManager.initialize();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVDataManager;
}