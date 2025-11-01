// API Client for Quiz Management
class ApiClient {
  constructor() {
    // Use absolute path to work with CMS
    this.baseUrl = '../api/';
  }

  async request(endpoint, options = {}) {
    const url = this.baseUrl + endpoint;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
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
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productData) {
    return this.request('products.php', {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productKey) {
    return this.request(`products.php?product_key=${productKey}`, {
      method: 'DELETE',
    });
  }

  // Content endpoints
  async getContent(productKey) {
    return this.request(`content.php?product_key=${productKey}`);
  }

  async saveContent(productKey, sections, questions) {
    return this.request('content.php', {
      method: 'POST',
      body: JSON.stringify({
        product_key: productKey,
        sections: sections,
        questions: questions,
      }),
    });
  }

  // Settings endpoints
  async getSetting(key) {
    return this.request(`settings.php?key=${key}`);
  }

  async getAllSettings() {
    return this.request('settings.php');
  }

  async updateSetting(key, value) {
    return this.request('settings.php', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    });
  }

  async getCurrentProduct() {
    // Check if we're in preview mode with a specific product
    const urlParams = new URLSearchParams(window.location.search);
    const previewProduct = urlParams.get('product');
    if (previewProduct) {
      console.log('[API] Using preview product:', previewProduct);
      return previewProduct;
    }

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
