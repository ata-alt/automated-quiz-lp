// API Client with fallback to localStorage when PHP isn't available
class ApiClient {
    constructor() {
        this.baseUrl = '../api/';
        this.useFallback = false;
        this.checkPHPSupport();
    }

    async checkPHPSupport() {
        try {
            const response = await fetch(this.baseUrl + 'test.php');
            const data = await response.json();
            if (data.status === 'success') {
                console.log('PHP backend is working');
                this.useFallback = false;
            }
        } catch (error) {
            console.warn('PHP backend not available, using localStorage fallback');
            this.useFallback = true;
        }
    }

    async request(endpoint, options = {}) {
        if (this.useFallback) {
            return this.handleFallback(endpoint, options);
        }

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
                // If PHP fails, fall back to localStorage
                console.warn('PHP request failed, falling back to localStorage');
                this.useFallback = true;
                return this.handleFallback(endpoint, options);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed, using fallback:', error);
            this.useFallback = true;
            return this.handleFallback(endpoint, options);
        }
    }

    // Fallback methods using localStorage
    handleFallback(endpoint, options) {
        const method = options.method || 'GET';

        if (endpoint.includes('products.php')) {
            return this.handleProductsFallback(method, options);
        } else if (endpoint.includes('content.php')) {
            return this.handleContentFallback(method, options);
        } else if (endpoint.includes('settings.php')) {
            return this.handleSettingsFallback(method, options);
        }

        return Promise.resolve({ error: 'Endpoint not supported in fallback mode' });
    }

    handleProductsFallback(method, options) {
        const productQuizzes = JSON.parse(localStorage.getItem('productQuizzes') || '{}');

        switch (method) {
            case 'GET':
                const products = Object.keys(productQuizzes).map(key => ({
                    product_key: key,
                    name: productQuizzes[key].name,
                    emoji: productQuizzes[key].emoji,
                    description: productQuizzes[key].description
                }));

                // Add default sofa product if not present
                if (!products.find(p => p.product_key === 'sofa')) {
                    products.unshift({
                        product_key: 'sofa',
                        name: 'Sofa',
                        emoji: '🛋️',
                        description: 'Luxury sofa matching quiz'
                    });
                }

                return Promise.resolve({ products });

            case 'POST':
                const data = JSON.parse(options.body);
                productQuizzes[data.product_key] = {
                    name: data.name,
                    emoji: data.emoji || '📦',
                    description: data.description || '',
                    created: new Date().toISOString(),
                    bannerContent: {
                        mainHeading: `Match Your Personality To A Luxury ${data.name}.`,
                        subHeading: 'Try Our AI Tool',
                        desktopImage: '',
                        mobileImage: ''
                    },
                    showroomContent: {
                        heading: `The largest luxury ${data.name.toLowerCase()} showroom in London`,
                        image: ''
                    },
                    luxurySofasSection: {
                        title: `Luxury ${data.name}, Redefined`,
                        introduction: `Experience the finest ${data.name.toLowerCase()} collection.`,
                        subtitle: 'Why Visit Our Showroom?',
                        points: [],
                        conclusion: '<strong>Visit Us & Experience Luxury Firsthand</strong>'
                    },
                    gallerySection: { images: [] },
                    designDisasterSection: {
                        heading: 'Avoid a design disaster.\nTalk to an expert.',
                        image: '',
                        buttonText: 'Book now',
                        buttonLink: '/book-a-showroom-visit.html'
                    },
                    quizPromoSection: {
                        heading: `Take our lifestyle quiz & find the perfect ${data.name.toLowerCase()} match.`,
                        features: [],
                        buttonText: `Try our ${data.name} Matching Quiz`,
                        buttonLink: '#quiz',
                        images: []
                    },
                    questions: []
                };
                localStorage.setItem('productQuizzes', JSON.stringify(productQuizzes));
                return Promise.resolve({ message: 'Product created successfully', product_key: data.product_key });

            default:
                return Promise.resolve({ error: 'Method not supported' });
        }
    }

    handleContentFallback(method, options) {
        const url = new URL(window.location.href);
        const productKey = url.searchParams.get('product_key') ||
                          new URLSearchParams(options.url?.split('?')[1] || '').get('product_key') || 'sofa';

        switch (method) {
            case 'GET':
                if (productKey === 'sofa') {
                    const sofaData = JSON.parse(localStorage.getItem('sofaQuizData') || '{}');
                    return Promise.resolve({
                        content: {
                            banner: sofaData.bannerSection,
                            showroom: sofaData.showroomSection,
                            luxury_content: sofaData.luxurySofasSection,
                            gallery: sofaData.gallerySection,
                            design_expert: sofaData.designDisasterSection,
                            quiz_promo: sofaData.quizPromoSection,
                            questions: sofaData.questions || []
                        }
                    });
                } else {
                    const productQuizzes = JSON.parse(localStorage.getItem('productQuizzes') || '{}');
                    const product = productQuizzes[productKey];
                    if (product) {
                        return Promise.resolve({
                            content: {
                                banner: product.bannerContent,
                                showroom: product.showroomContent,
                                luxury_content: product.luxurySofasSection,
                                gallery: product.gallerySection,
                                design_expert: product.designDisasterSection,
                                quiz_promo: product.quizPromoSection,
                                questions: product.questions || []
                            }
                        });
                    }
                }
                return Promise.resolve({ content: {} });

            case 'POST':
                const saveData = JSON.parse(options.body);
                if (saveData.product_key === 'sofa') {
                    const quizData = {
                        bannerSection: saveData.sections.banner,
                        showroomSection: saveData.sections.showroom,
                        luxurySofasSection: saveData.sections.luxury_content,
                        gallerySection: saveData.sections.gallery,
                        designDisasterSection: saveData.sections.design_expert,
                        quizPromoSection: saveData.sections.quiz_promo,
                        questions: saveData.questions
                    };
                    localStorage.setItem('sofaQuizData', JSON.stringify(quizData));
                } else {
                    const productQuizzes = JSON.parse(localStorage.getItem('productQuizzes') || '{}');
                    if (productQuizzes[saveData.product_key]) {
                        productQuizzes[saveData.product_key].bannerContent = saveData.sections.banner;
                        productQuizzes[saveData.product_key].showroomContent = saveData.sections.showroom;
                        productQuizzes[saveData.product_key].luxurySofasSection = saveData.sections.luxury_content;
                        productQuizzes[saveData.product_key].gallerySection = saveData.sections.gallery;
                        productQuizzes[saveData.product_key].designDisasterSection = saveData.sections.design_expert;
                        productQuizzes[saveData.product_key].quizPromoSection = saveData.sections.quiz_promo;
                        productQuizzes[saveData.product_key].questions = saveData.questions;
                        localStorage.setItem('productQuizzes', JSON.stringify(productQuizzes));
                    }
                }
                return Promise.resolve({ message: 'Content saved successfully' });

            default:
                return Promise.resolve({ error: 'Method not supported' });
        }
    }

    handleSettingsFallback(method, options) {
        const url = new URL(window.location.href);
        const key = url.searchParams.get('key') ||
                   new URLSearchParams(options.url?.split('?')[1] || '').get('key');

        switch (method) {
            case 'GET':
                if (key === 'current_product') {
                    const currentProduct = localStorage.getItem('currentProduct') || 'sofa';
                    return Promise.resolve({ value: currentProduct });
                }
                return Promise.resolve({ settings: {} });

            case 'POST':
                const data = JSON.parse(options.body);
                if (data.key === 'current_product') {
                    localStorage.setItem('currentProduct', data.value);
                }
                return Promise.resolve({ message: 'Setting updated successfully' });

            default:
                return Promise.resolve({ error: 'Method not supported' });
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