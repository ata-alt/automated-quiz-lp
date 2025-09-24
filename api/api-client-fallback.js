// API Client for PHP backend (database required)
class ApiClient {
    constructor() {
        this.baseUrl = '../api/';
        this.checkPHPSupport();
    }

    async checkPHPSupport() {
        try {
            const response = await fetch(this.baseUrl + 'test.php');
            const data = await response.json();
            if (data.status === 'success') {
                console.log('PHP backend is working');
            }
        } catch (error) {
            console.error('PHP backend not available. Database is required for this application.');
            throw new Error('Database connection required. Please ensure your PHP backend is running.');
        }
    }

    async request(endpoint, options = {}) {
        const url = this.baseUrl + endpoint;

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Product endpoints
    async getProducts() {
        return this.request('products.php');
    }

    async createProduct(productData) {
        return this.request('products.php', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    async updateProduct(productData) {
        return this.request('products.php', {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    async deleteProduct(productKey) {
        return this.request(`products.php?product_key=${productKey}`, {
            method: 'DELETE'
        });
    }

    // Content endpoints
    async getContent(productKey = 'sofa') {
        return this.request(`content.php?product_key=${productKey}`, {
            url: `content.php?product_key=${productKey}`
        });
    }

    async saveContent(productKey, sections, questions) {
        return this.request('content.php', {
            method: 'POST',
            body: JSON.stringify({
                product_key: productKey,
                sections: sections,
                questions: questions
            })
        });
    }

    async saveSectionOnly(productKey, sectionName, sectionData) {
        // First get the current data
        const currentData = await this.getContent(productKey);

        // Update only the specified section
        const updatedSections = {
            banner: currentData.content.banner || {},
            showroom: currentData.content.showroom || {},
            luxury_content: currentData.content.luxury_content || {},
            gallery: currentData.content.gallery || {},
            design_expert: currentData.content.design_expert || {},
            quiz_promo: currentData.content.quiz_promo || {}
        };

        // Update the specific section
        updatedSections[sectionName] = sectionData;

        // Save with the updated section
        return this.request('content.php', {
            method: 'POST',
            body: JSON.stringify({
                product_key: productKey,
                sections: updatedSections,
                questions: currentData.content.questions || []
            })
        });
    }

    async saveQuestionsOnly(productKey, questions) {
        // First get the current data
        const currentData = await this.getContent(productKey);

        // Keep all sections unchanged
        const sections = {
            banner: currentData.content.banner || {},
            showroom: currentData.content.showroom || {},
            luxury_content: currentData.content.luxury_content || {},
            gallery: currentData.content.gallery || {},
            design_expert: currentData.content.design_expert || {},
            quiz_promo: currentData.content.quiz_promo || {}
        };

        // Save with the updated questions
        return this.request('content.php', {
            method: 'POST',
            body: JSON.stringify({
                product_key: productKey,
                sections: sections,
                questions: questions
            })
        });
    }

    // Settings endpoints
    async getSetting(key) {
        return this.request(`settings.php?key=${key}`, {
            url: `settings.php?key=${key}`
        });
    }

    async getAllSettings() {
        return this.request('settings.php');
    }

    async updateSetting(key, value) {
        return this.request('settings.php', {
            method: 'POST',
            body: JSON.stringify({ key, value })
        });
    }

    async getCurrentProduct() {
        try {
            const response = await this.getSetting('current_product');
            return response.value || 'sofa';
        } catch (error) {
            return 'sofa';
        }
    }

    async setCurrentProduct(productKey) {
        return this.updateSetting('current_product', productKey);
    }
}

// Create global instance
window.apiClient = new ApiClient();