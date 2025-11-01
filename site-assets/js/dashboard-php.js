// Dashboard JavaScript - Quiz Content Management System with PHP Backend

let quizData = {
  questions: [],
};

// Make currentProductKey globally accessible
window.currentProductKey = 'default';
let currentProductKey = 'default';

// Initialize dashboard
async function initializeDashboard() {
  try {
    // Get current product
    currentProductKey = await apiClient.getCurrentProduct();
    window.currentProductKey = currentProductKey;

    // Update product selector
    await updateProductQuizSelector();

    // Set selector value
    const selector = document.getElementById('productQuizSelector');
    if (selector) {
      selector.value = currentProductKey;
    }

    // Update delete button visibility
    updateDeleteButtonVisibility(currentProductKey);

    // Get product data to update tab titles
    const response = await apiClient.getProducts();
    const product = response.products.find(
      (p) => p.product_key === currentProductKey
    );

    // Update tab titles with current product
    updateTabTitles(product);

    // Load content for current product
    await loadCurrentQuiz();

    showStatus('Dashboard loaded successfully', 'success');
  } catch (error) {
    console.error('Failed to initialize dashboard:', error);
    showStatus('Failed to load dashboard: ' + error.message, 'error');
  }
}

// Update product quiz selector
async function updateProductQuizSelector() {
  try {
    const selector = document.getElementById('productQuizSelector');
    const response = await apiClient.getProducts();

    // Clear existing options except the first one (if any)
    while (selector.children.length > 1) {
      selector.removeChild(selector.lastChild);
    }

    // Add default option if not present
    if (selector.children.length === 0) {
      const defaultOption = document.createElement('option');
      defaultOption.value = 'default';
      defaultOption.textContent = 'Default Quiz';
      selector.appendChild(defaultOption);
    }

    // Add options for each product quiz
    response.products.forEach((product) => {
      if (product.product_key !== 'default') {
        // Skip default as it's already added
        const option = document.createElement('option');
        option.value = product.product_key;
        option.textContent = `${product.name} Quiz`;
        selector.appendChild(option);
      }
    });
  } catch (error) {
    console.error('Failed to update product selector:', error);
    showStatus('Failed to load products', 'error');
  }
}

// Switch product quiz
async function switchProductQuiz(productKey) {
  try {
    currentProductKey = productKey;
    window.currentProductKey = productKey;

    // Update current product setting
    await apiClient.setCurrentProduct(productKey);

    // Update dashboard title
    const response = await apiClient.getProducts();
    const product = response.products.find((p) => p.product_key === productKey);

    let title = 'Default Quiz Content Management Dashboard';
    if (product && productKey !== 'default') {
      title = `${product.name} Quiz Content Management Dashboard`;
    }

    document.getElementById('dashboardTitle').textContent = title;

    // Update delete button visibility
    updateDeleteButtonVisibility(productKey);

    // Update tab titles with product name
    updateTabTitles(product);

    // Load content for this product
    await loadCurrentQuiz();

    showStatus(`Switched to ${productKey} quiz`, 'success');
  } catch (error) {
    console.error('Failed to switch product:', error);
    showStatus('Failed to switch product: ' + error.message, 'error');
  }
}

// Update delete button visibility
function updateDeleteButtonVisibility(productKey) {
  const deleteBtn = document.getElementById('deleteProductBtn');
  if (deleteBtn) {
    // Hide delete button for the default product, show for others
    if (productKey === 'default') {
      deleteBtn.style.display = 'none';
    } else {
      deleteBtn.style.display = 'inline-block';
    }
  }
}

// Update tab titles with current product name
function updateTabTitles(product) {
  let productName = 'Default';

  // Get product name, default to 'Default' if not found or is the default product
  if (product && product.product_key !== 'default') {
    productName = product.name;
  }

  // Update each tab title
  const bannerTitle = document.getElementById('bannerTabTitle');
  if (bannerTitle) {
    bannerTitle.textContent = `🎨 ${productName} Hero Banner`;
  }

  const contentTitle = document.getElementById('contentTabTitle');
  if (contentTitle) {
    contentTitle.textContent = `✨ Luxury ${productName} `;
  }

  const galleryTitle = document.getElementById('galleryTabTitle');
  if (galleryTitle) {
    galleryTitle.textContent = `🖼️ ${productName} Gallery (4 Images)`;
  }

  const promoTitle = document.getElementById('promoTabTitle');
  if (promoTitle) {
    promoTitle.textContent = `🎯 ${productName} Quiz Promo`;
  }

  const resultsTitle = document.getElementById('resultsTabTitle');
  if (resultsTitle) {
    if (productName === 'Default') {
      resultsTitle.textContent = `Quiz Results`;
    } else {
      resultsTitle.textContent = `${productName} Quiz Results`;
    }
  }
}

// Load current quiz data
async function loadCurrentQuiz() {
  try {
    const response = await apiClient.getContent(currentProductKey);
    const content = response.content;

    // Check if this is a newly created product
    // Note: Previously used localStorage, now relies on database state

    // Check if this is a new product with default template content
    // New products should show empty fields in dashboard even if they have template content in DB
    const hasTemplateContent =
      content &&
      content.banner &&
      content.banner.mainHeading?.includes(
        'Match Your Personality To A Luxury'
      );

    const isNewProduct = currentProductKey !== 'default' && hasTemplateContent;

    // Get product info for placeholders
    const productResponse = await apiClient.getProducts();
    const currentProduct = productResponse.products.find(
      (p) => p.product_key === currentProductKey
    );
    const productName = currentProduct ? currentProduct.name : 'Product';

    // Convert API format to dashboard format
    if (isNewProduct) {
      // New product - use completely empty values
      quizData = {
        bannerSection: {
          mainHeading: '',
          subHeading: '',
          backgroundImage: '',
          mobileImage: '',
        },
        showroomSection: {
          heading: '',
          image: '',
        },
        luxurySofasSection: {
          title: '',
          introduction: '',
          subtitle: '',
          points: [],
          conclusion: '',
        },
        gallerySection: {
          images: [
            { src: '', alt: '', title: '', subtitle: '', link: '' },
            { src: '', alt: '', title: '', subtitle: '', link: '' },
            { src: '', alt: '', title: '', subtitle: '', link: '' },
            { src: '', alt: '', title: '', subtitle: '', link: '' },
          ],
        },
        designDisasterSection: {
          heading: '',
          image: '',
          buttonText: '',
          buttonLink: '',
        },
        quizPromoSection: {
          heading: '',
          features: [],
          buttonText: '',
          buttonLink: '',
          images: [],
        },
        questions: [],
        isNewProduct: true,
        productName: productName,
      };
    } else {
      // Existing product - use saved content or defaults
      quizData = {
        bannerSection: content.banner || {
          mainHeading: `Match Your Personality To A Luxury ${productName}.`,
          subHeading: 'Try Our AI Tool',
          backgroundImage: '',
          mobileImage: '',
        },
        showroomSection: content.showroom || {
          heading: `The largest luxury ${productName.toLowerCase()} showroom in London`,
          image: '',
        },
        luxurySofasSection: content.luxury_content || {
          title: `Luxury ${productName}, Redefined`,
          introduction: `Experience the finest ${productName.toLowerCase()} collection.`,
          subtitle: 'Why Visit Our Showroom?',
          points: [],
          conclusion: '<strong>Visit Us & Experience Luxury Firsthand</strong>',
        },
        gallerySection: content.gallery || { images: [] },
        designDisasterSection: content.design_expert || {
          heading: 'Avoid a design disaster.\nTalk to an expert.',
          image: '',
          buttonText: 'Book now',
          buttonLink: '/book-a-showroom-visit.html',
        },
        quizPromoSection: content.quiz_promo || {
          heading: `Take our lifestyle quiz & find the perfect ${productName.toLowerCase()} match.`,
          features: [],
          buttonText: `Try our ${productName} Matching Quiz`,
          buttonLink: '#quiz',
          images: [],
        },
        questions: content.questions || [],
        isNewProduct: false,
        productName: productName,
      };
    }

    renderQuestions();

    // Ensure gallery section is rendered with 4 image slots
    if (!quizData.gallerySection.images) {
      quizData.gallerySection.images = [];
    }

    // Ensure we always have exactly 4 image slots with all fields
    while (quizData.gallerySection.images.length < 4) {
      quizData.gallerySection.images.push({
        src: '',
        alt: '',
        title: '',
        subtitle: '',
        link: '',
      });
    }
    renderGalleryItems();

    showStatus('Quiz data loaded successfully', 'success');
  } catch (error) {
    console.error('Failed to load quiz data:', error);
    showStatus('Failed to load quiz data: ' + error.message, 'error');
    // Fall back to empty data for new product
    initializeEmptyData();
  }
}

// Save quiz data
async function saveQuiz() {
  try {
    // Prepare sections data
    const sections = {
      banner: quizData.bannerSection,
      showroom: quizData.showroomSection,
      luxury_content: quizData.luxurySofasSection,
      gallery: quizData.gallerySection,
      design_expert: quizData.designDisasterSection,
      quiz_promo: quizData.quizPromoSection,
    };

    // Save to database
    await apiClient.saveContent(
      currentProductKey,
      sections,
      quizData.questions
    );

    showStatus('Quiz saved successfully!', 'success');
    generateQuizCode();
  } catch (error) {
    console.error('Failed to save quiz:', error);
    showStatus('Failed to save quiz: ' + error.message, 'error');
  }
}

// Create new product quiz
async function createNewProductQuiz() {
  try {
    const productName = document.getElementById('productName').value.trim();
    const productDescription = document
      .getElementById('productDescription')
      .value.trim();

    if (!productName) {
      alert('Please enter a product name');
      return;
    }

    // Create unique key for the product
    const productKey = productName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const productData = {
      product_key: productKey,
      name: productName,
      description: productDescription,
    };

    await apiClient.createProduct(productData);
    await updateProductQuizSelector();

    closeNewProductModal();
    showStatus(
      `${productName} quiz created successfully! Reloading dashboard...`,
      'success'
    );

    // Set the new product as current and reload the page
    await apiClient.setCurrentProduct(productKey);

    // Add a small delay to ensure the status message is visible
    setTimeout(() => {
      // Reload the entire dashboard page to reset all fields
      window.location.reload();
    }, 1500);
  } catch (error) {
    console.error('Failed to create product:', error);
    alert('Failed to create product: ' + error.message);
  }
}

// Initialize with sample data (fallback for default)
function initializeSampleData() {
  quizData = {
    bannerSection: {
      mainHeading: 'Match Your Personality To A Luxury Product.',
      subHeading: 'Try Our AI Tool',
      backgroundImage:
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/gallotti-and-radice-banner-1.jpg',
      mobileImage:
        '../cdn-cgi/image/quality=60,f=auto/site-assets/images/luxury/luxury-banner-1-mobile.jpg',
    },
    showroomSection: {
      heading: 'The largest luxury product showroom in London',
      image: '../cdn-cgi/image/quality=75,f=auto/site-assets/shoroomlndn.jpg',
    },
    luxurySofasSection: {
      title: 'Luxury Products, Redefined',
      introduction:
        "A product is never just a product. It's where you unwind after a long day, host spirited conversations, and perhaps—if it's truly exquisite—fall hopelessly in love with your own living space. At FCI London, we don't just sell products; we curate spaces of sophistication, tailored to those who appreciate life's finer details.",
      subtitle: 'Why Visit Our Showroom?',
      points: [],
      conclusion:
        '<strong>Visit Us & Experience Luxury Firsthand</strong><br>Indulgence begins with a single step. Visit our London showroom to immerse yourself in a world of impeccable design and let us help you find the product you never knew you needed.',
    },
    gallerySection: {
      images: [
        { src: '', alt: 'Gallery Image 1', title: '', subtitle: '', link: '' },
        { src: '', alt: 'Gallery Image 2', title: '', subtitle: '', link: '' },
        { src: '', alt: 'Gallery Image 3', title: '', subtitle: '', link: '' },
        { src: '', alt: 'Gallery Image 4', title: '', subtitle: '', link: '' },
      ],
    },
    designDisasterSection: {
      heading: 'Avoid a design disaster.\nTalk to an expert.',
      image:
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/avoid-a-design-disaster.jpg',
      buttonText: 'Book now',
      buttonLink: '/book-a-showroom-visit.html',
    },
    quizPromoSection: {
      heading: 'Take our lifestyle quiz & find the perfect product match.',
      features: [],
      buttonText: 'Try our Product Matching Quiz',
      buttonLink: '#productquiz',
      images: [],
    },
    questions: [],
    isNewProduct: false,
  };
  renderQuestions();
}

// Initialize with empty data (for new products)
function initializeEmptyData() {
  quizData = {
    bannerSection: {
      mainHeading: '',
      subHeading: '',
      backgroundImage: '',
      mobileImage: '',
    },
    showroomSection: {
      heading: '',
      image: '',
    },
    luxurySofasSection: {
      title: '',
      introduction: '',
      subtitle: '',
      points: [],
      conclusion: '',
    },
    gallerySection: {
      images: [
        { src: '', alt: '', title: '', subtitle: '', link: '' },
        { src: '', alt: '', title: '', subtitle: '', link: '' },
        { src: '', alt: '', title: '', subtitle: '', link: '' },
        { src: '', alt: '', title: '', subtitle: '', link: '' },
      ],
    },
    designDisasterSection: {
      heading: '',
      image: '',
      buttonText: '',
      buttonLink: '',
    },
    quizPromoSection: {
      heading: '',
      features: [],
      buttonText: '',
      buttonLink: '',
      images: [],
    },
    questions: [],
    isNewProduct: true,
    productName: 'Product',
  };
  renderQuestions();
}

// Keep all the existing UI functions (they remain the same)
// Luxury Sofas Section Functions
function updateLuxurySofasContent(field, value) {
  if (!quizData.luxurySofasSection) {
    quizData.luxurySofasSection = {};
  }
  quizData.luxurySofasSection[field] = value;
  showStatus(`Luxury Content ${field} updated`, 'success');
}

function renderLuxurySofasPoints() {
  const container = document.getElementById('luxurySofasPoints');
  if (
    !container ||
    !quizData.luxurySofasSection ||
    !quizData.luxurySofasSection.points
  )
    return;

  container.innerHTML = quizData.luxurySofasSection.points
    .map(
      (point, index) => `
        <div class="luxury-point-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 10px; background: #f9f9f9;">
            <div class="luxury-point-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <div class="luxury-point-content" style="flex: 1; margin-right: 10px;">
                    <input type="text"
                           value="${point.title}"
                           onchange="updateLuxurySofasPoint(${index}, 'title', this.value)"
                           class="luxury-point-title"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; font-weight: bold;"
                           placeholder="Point title...">
                    <textarea
                           onchange="updateLuxurySofasPoint(${index}, 'description', this.value)"
                           class="luxury-point-description"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;"
                           placeholder="Point description...">${point.description}</textarea>
                </div>
                <button class="btn btn-danger luxury-point-delete" onclick="removeLuxurySofasPoint(${index})" style="padding: 5px 10px; flex-shrink: 0;">×</button>
            </div>
        </div>
    `
    )
    .join('');
}

function addLuxurySofasPoint() {
  if (!quizData.luxurySofasSection) {
    quizData.luxurySofasSection = { points: [] };
  }
  if (!quizData.luxurySofasSection.points) {
    quizData.luxurySofasSection.points = [];
  }
  const newNumber = quizData.luxurySofasSection.points.length + 1;
  quizData.luxurySofasSection.points.push({
    title: `${newNumber}. New Point`,
    description: 'Enter point description here...',
  });
  renderLuxurySofasPoints();
  showStatus('Point added', 'success');
}

function updateLuxurySofasPoint(index, field, value) {
  quizData.luxurySofasSection.points[index][field] = value;
  showStatus('Point updated', 'success');
}

function removeLuxurySofasPoint(index) {
  quizData.luxurySofasSection.points.splice(index, 1);
  // Renumber remaining points
  quizData.luxurySofasSection.points.forEach((point, i) => {
    const match = point.title.match(/^\d+\.\s(.+)/);
    if (match) {
      point.title = `${i + 1}. ${match[1]}`;
    }
  });
  renderLuxurySofasPoints();
  showStatus('Point removed', 'success');
}

// Banner Section Functions
function updateBannerText(field, value) {
  quizData.bannerSection[field] = value;
  showStatus(`Banner ${field} updated`, 'success');
}

async function handleBannerImageUpload(type, input) {
  const file = input.files[0];
  if (file) {
    try {
      showStatus(`Uploading ${type} banner image...`, 'info');
      const response = await apiClient.uploadImage(file);

      if (response.status === 'success') {
        const imageUrl = response.data.url;

        if (type === 'desktop') {
          quizData.bannerSection.backgroundImage = imageUrl;
          const imageArea = document.getElementById('banner-desktop-image');
          imageArea.style.backgroundImage = `url('${imageUrl}')`;
          imageArea.style.backgroundSize = 'cover';
          imageArea.innerHTML =
            '<div class="upload-text">📷 Change Desktop Banner</div>';
        } else if (type === 'mobile') {
          quizData.bannerSection.mobileImage = imageUrl;
          const imageArea = document.getElementById('banner-mobile-image');
          imageArea.style.backgroundImage = `url('${imageUrl}')`;
          imageArea.style.backgroundSize = 'cover';
          imageArea.innerHTML =
            '<div class="upload-text">📱 Change Mobile Banner</div>';
        }
        showStatus(`Banner ${type} image uploaded successfully`, 'success');
      } else {
        showStatus(
          `Failed to upload ${type} banner image: ` + response.message,
          'error'
        );
      }
    } catch (error) {
      console.error('Banner image upload error:', error);
      showStatus(
        `Error uploading ${type} banner image: ` + error.message,
        'error'
      );
    }
  }
}

function updateShowroomHeading(text) {
  quizData.showroomSection.heading = text;
  showStatus('Showroom heading updated', 'success');
}

async function handleShowroomImageUpload(input) {
  const file = input.files[0];
  if (file) {
    try {
      showStatus('Uploading showroom image...', 'info');
      const response = await apiClient.uploadImage(file);

      if (response.status === 'success') {
        const imageUrl = response.data.url;
        quizData.showroomSection.image = imageUrl;
        const imageArea = document.getElementById('showroom-image');
        imageArea.style.backgroundImage = `url('${imageUrl}')`;
        imageArea.innerHTML =
          '<div class="upload-text">📷 Click to change showroom image</div>';
        showStatus('Showroom image uploaded successfully', 'success');
      } else {
        showStatus(
          'Failed to upload showroom image: ' + response.message,
          'error'
        );
      }
    } catch (error) {
      console.error('Showroom image upload error:', error);
      showStatus('Error uploading showroom image: ' + error.message, 'error');
    }
  }
}

// Design Disaster Section Functions
function updateDesignDisasterText(field, value) {
  quizData.designDisasterSection[field] = value;
  showStatus(`Design section ${field} updated`, 'success');
}

async function handleDesignDisasterImageUpload(input) {
  const file = input.files[0];
  if (file) {
    try {
      showStatus('Uploading design section image...', 'info');
      const response = await apiClient.uploadImage(file);

      if (response.status === 'success') {
        const imageUrl = response.data.url;
        quizData.designDisasterSection.image = imageUrl;
        const imageArea = document.getElementById('design-disaster-image');
        imageArea.style.backgroundImage = `url('${imageUrl}')`;
        imageArea.style.backgroundSize = 'cover';
        imageArea.innerHTML = '<div class="upload-text">📷 Change Image</div>';
        showStatus('Design section image uploaded successfully', 'success');
      } else {
        showStatus(
          'Failed to upload design section image: ' + response.message,
          'error'
        );
      }
    } catch (error) {
      console.error('Design section image upload error:', error);
      showStatus(
        'Error uploading design section image: ' + error.message,
        'error'
      );
    }
  }
}

// Quiz Promo Section Functions
function updateQuizPromoHeading(text) {
  quizData.quizPromoSection.heading = text;
  showStatus('Quiz promo heading updated', 'success');
}

function updateQuizPromoButton(field, value) {
  if (field === 'text') {
    quizData.quizPromoSection.buttonText = value;
  } else if (field === 'link') {
    quizData.quizPromoSection.buttonLink = value;
  }
  showStatus('Button settings updated', 'success');
}

function renderQuizPromoFeatures() {
  const container = document.getElementById('quizPromoFeatures');
  if (!container) return;

  container.innerHTML = quizData.quizPromoSection.features
    .map(
      (feature, index) => `
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <input type="text"
                   value="${feature}"
                   onchange="updateQuizPromoFeature(${index}, this.value)"
                   style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-right: 8px;">
            <button class="btn btn-danger" onclick="removeQuizPromoFeature(${index})" style="padding: 5px 10px;">×</button>
        </div>
    `
    )
    .join('');
}

function addQuizPromoFeature() {
  quizData.quizPromoSection.features.push('New Feature');
  renderQuizPromoFeatures();
  showStatus('Feature added', 'success');
}

function updateQuizPromoFeature(index, value) {
  quizData.quizPromoSection.features[index] = value;
  showStatus('Feature updated', 'success');
}

function removeQuizPromoFeature(index) {
  quizData.quizPromoSection.features.splice(index, 1);
  renderQuizPromoFeatures();
  showStatus('Feature removed', 'success');
}

function renderQuizPromoImages() {
  const container = document.getElementById('quizPromoImages');
  if (!container) return;

  container.innerHTML = quizData.quizPromoSection.images
    .map((image, index) => {
      // For new products, ensure images are completely blank
      const hasImage = image && !quizData.isNewProduct;
      const backgroundStyle = hasImage
        ? `background-image: url('${image}')`
        : '';
      const uploadIcon = hasImage ? '📷' : '📤';

      return `
        <div class="promo-image-slot" style="position: relative;">
            <div class="image-upload-area promo-upload-area ${hasImage ? 'has-image' : ''}"
                 id="quizpromo-image-${index}"
                 style="height: 100px; ${backgroundStyle}"
                 onclick="document.getElementById('quizpromo-file-${index}').click()">
                <div class="upload-text promo-upload-text" style="font-size: 10px;">
                    ${uploadIcon}
                </div>
            </div>
            <input type="file" id="quizpromo-file-${index}"
                   style="display: none;" accept="image/*"
                   onchange="handleQuizPromoImageUpload(${index}, this)">
            <button class="btn btn-danger promo-image-delete"
                    onclick="removeQuizPromoImage(${index})"
                    style="position: absolute; top: 5px; right: 5px; padding: 2px 6px; font-size: 12px;">×</button>
        </div>
        `;
    })
    .join('');
}

function addQuizPromoImage() {
  quizData.quizPromoSection.images.push('');
  renderQuizPromoImages();
  showStatus('Image slot added', 'success');
}

async function handleQuizPromoImageUpload(index, input) {
  const file = input.files[0];
  if (file) {
    try {
      showStatus(`Uploading promo image ${index + 1}...`, 'info');
      const response = await apiClient.uploadImage(file);

      if (response.status === 'success') {
        const imageUrl = response.data.url;
        quizData.quizPromoSection.images[index] = imageUrl;
        renderQuizPromoImages();
        showStatus('Promo image uploaded successfully', 'success');
      } else {
        showStatus(
          'Failed to upload promo image: ' + response.message,
          'error'
        );
      }
    } catch (error) {
      console.error('Quiz promo image upload error:', error);
      showStatus('Error uploading promo image: ' + error.message, 'error');
    }
  }
}

function removeQuizPromoImage(index) {
  quizData.quizPromoSection.images.splice(index, 1);
  renderQuizPromoImages();
  showStatus('Image removed', 'success');
}

// Gallery Section Functions
function renderGalleryItems() {
  if (!quizData.gallerySection.images) {
    quizData.gallerySection.images = [
      { src: '', alt: '', title: '', subtitle: '', link: '' },
      { src: '', alt: '', title: '', subtitle: '', link: '' },
      { src: '', alt: '', title: '', subtitle: '', link: '' },
      { src: '', alt: '', title: '', subtitle: '', link: '' },
    ];
  }

  quizData.gallerySection.images.forEach((item, index) => {
    const container = document.getElementById(`gallery-item-${index}`);
    if (!container) return;

    // For new products, ensure images are completely blank
    const hasImage = item.src && !quizData.isNewProduct;
    const backgroundStyle = hasImage
      ? `background-image: url('${item.src}')`
      : '';
    const uploadText = hasImage ? '📷 Change image' : '📤 Upload image';

    container.innerHTML = `
            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 8px; background: white;">
                <h4 style="color: #9c27b0; margin: 0 0 10px 0;">Image ${
                  index + 1
                }</h4>
                <div class="image-upload-area ${hasImage ? 'has-image' : ''}"
                     id="gallery-image-${index}"
                     style="height: 150px; margin-bottom: 10px; ${backgroundStyle}"
                     onclick="document.getElementById('gallery-file-${index}').click()">
                    <div class="upload-text">
                        ${uploadText}
                    </div>
                </div>
                <input type="file" id="gallery-file-${index}"
                       style="display: none;" accept="image/*"
                       onchange="handleGalleryImageUpload(${index}, this)">
                <input type="text" placeholder="Image description/alt text"
                       value="${quizData.isNewProduct ? '' : item.alt || ''}"
                       onchange="updateGalleryAlt(${index}, this.value)"
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
        `;

    // Also populate the title, subtitle, and link inputs
    const titleInput = document.getElementById(`gallery-title-${index}`);
    const subtitleInput = document.getElementById(`gallery-subtitle-${index}`);
    const linkInput = document.getElementById(`gallery-link-${index}`);

    if (titleInput) titleInput.value = item.title || '';
    if (subtitleInput) subtitleInput.value = item.subtitle || '';
    if (linkInput) linkInput.value = item.link || '';
  });
}

async function handleGalleryImageUpload(index, input) {
  const file = input.files[0];
  if (file) {
    try {
      showStatus(`Uploading gallery image ${index + 1}...`, 'info');
      const response = await apiClient.uploadImage(file);

      if (response.status === 'success') {
        const imageUrl = response.data.url;
        quizData.gallerySection.images[index].src = imageUrl;
        renderGalleryItems();
        showStatus('Gallery image uploaded successfully', 'success');
      } else {
        showStatus(
          'Failed to upload gallery image: ' + response.message,
          'error'
        );
      }
    } catch (error) {
      console.error('Gallery image upload error:', error);
      showStatus('Error uploading gallery image: ' + error.message, 'error');
    }
  }
}

function updateGalleryAlt(index, value) {
  quizData.gallerySection.images[index].alt = value;
  showStatus('Image description updated', 'success');
}

// Gallery Text Update Functions
function updateGalleryText(index, field, value) {
  if (!quizData.gallerySection) {
    quizData.gallerySection = {
      images: [
        { src: '', alt: '', title: '', subtitle: '', link: '' },
        { src: '', alt: '', title: '', subtitle: '', link: '' },
        { src: '', alt: '', title: '', subtitle: '', link: '' },
        { src: '', alt: '', title: '', subtitle: '', link: '' },
      ],
    };
  }

  if (!quizData.gallerySection.images[index]) {
    quizData.gallerySection.images[index] = {
      src: '',
      alt: '',
      title: '',
      subtitle: '',
      link: '',
    };
  }

  quizData.gallerySection.images[index][field] = value;
  showStatus(`Gallery item ${index + 1} ${field} updated`, 'success');
}

// Question management functions
function renderQuestions() {
  // Update banner section UI
  const bannerMainHeading = document.getElementById('bannerMainHeading');
  if (bannerMainHeading && quizData.bannerSection) {
    // For new products, ensure completely blank fields
    bannerMainHeading.value = quizData.bannerSection.mainHeading || '';

    const bannerSubHeading = document.getElementById('bannerSubHeading');
    if (bannerSubHeading) {
      bannerSubHeading.value = quizData.bannerSection.subHeading || '';
    }

    // Only display images if they actually exist and it's not a new product
    if (quizData.bannerSection.backgroundImage && !quizData.isNewProduct) {
      const desktopImage = document.getElementById('banner-desktop-image');
      if (desktopImage) {
        desktopImage.style.backgroundImage = `url('${quizData.bannerSection.backgroundImage}')`;
        desktopImage.style.backgroundSize = 'cover';
        desktopImage.innerHTML =
          '<div class="upload-text">📷 Change Desktop Banner</div>';
      }
    } else {
      // Ensure upload area is clean for new products
      const desktopImage = document.getElementById('banner-desktop-image');
      if (desktopImage) {
        desktopImage.style.backgroundImage = '';
        desktopImage.innerHTML =
          '<div class="upload-text">📤 Upload Desktop Banner</div>';
      }
    }

    if (quizData.bannerSection.mobileImage && !quizData.isNewProduct) {
      const mobileImage = document.getElementById('banner-mobile-image');
      if (mobileImage) {
        mobileImage.style.backgroundImage = `url('${quizData.bannerSection.mobileImage}')`;
        mobileImage.style.backgroundSize = 'cover';
        mobileImage.innerHTML =
          '<div class="upload-text">📱 Change Mobile Banner</div>';
      }
    } else {
      // Ensure upload area is clean for new products
      const mobileImage = document.getElementById('banner-mobile-image');
      if (mobileImage) {
        mobileImage.style.backgroundImage = '';
        mobileImage.innerHTML =
          '<div class="upload-text">📱 Upload Mobile Banner</div>';
      }
    }
  }

  // Update showroom section UI
  const showroomHeading = document.getElementById('showroomHeading');
  if (showroomHeading && quizData.showroomSection) {
    // For new products, ensure completely blank fields
    showroomHeading.value = quizData.showroomSection.heading || '';

    const showroomImage = document.getElementById('showroom-image');
    if (showroomImage) {
      if (quizData.showroomSection.image && !quizData.isNewProduct) {
        showroomImage.style.backgroundImage = `url('${quizData.showroomSection.image}')`;
        showroomImage.innerHTML =
          '<div class="upload-text">📷 Click to change showroom image</div>';
      } else {
        // Ensure upload area is clean for new products
        showroomImage.style.backgroundImage = '';
        showroomImage.innerHTML =
          '<div class="upload-text">📤 Click to upload showroom image</div>';
      }
    }
  }

  // Update Luxury Content section UI
  if (quizData.luxurySofasSection) {
    const luxurySofasTitle = document.getElementById('luxurySofasTitle');
    if (luxurySofasTitle) {
      // For new products, ensure completely blank fields
      luxurySofasTitle.value = quizData.luxurySofasSection.title || '';
    }

    const luxurySofasIntro = document.getElementById('luxurySofasIntro');
    if (luxurySofasIntro) {
      luxurySofasIntro.value = quizData.luxurySofasSection.introduction || '';
    }

    const luxurySofasSubtitle = document.getElementById('luxurySofasSubtitle');
    if (luxurySofasSubtitle) {
      luxurySofasSubtitle.value = quizData.luxurySofasSection.subtitle || '';
    }

    const luxurySofasConclusion = document.getElementById(
      'luxurySofasConclusion'
    );
    if (luxurySofasConclusion) {
      luxurySofasConclusion.value =
        quizData.luxurySofasSection.conclusion || '';
    }

    renderLuxurySofasPoints();
  }

  // Render gallery section
  if (quizData.gallerySection) {
    renderGalleryItems();
  }

  // Update Design Disaster section UI
  const designDisasterHeading = document.getElementById(
    'designDisasterHeading'
  );
  if (designDisasterHeading && quizData.designDisasterSection) {
    // For new products, ensure completely blank fields
    designDisasterHeading.value = quizData.designDisasterSection.heading || '';

    const designDisasterButtonText = document.getElementById(
      'designDisasterButtonText'
    );
    if (designDisasterButtonText) {
      designDisasterButtonText.value =
        quizData.designDisasterSection.buttonText || '';
    }

    const designDisasterButtonLink = document.getElementById(
      'designDisasterButtonLink'
    );
    if (designDisasterButtonLink) {
      designDisasterButtonLink.value =
        quizData.designDisasterSection.buttonLink || '';
    }

    const designImage = document.getElementById('design-disaster-image');
    if (designImage) {
      if (quizData.designDisasterSection.image && !quizData.isNewProduct) {
        designImage.style.backgroundImage = `url('${quizData.designDisasterSection.image}')`;
        designImage.style.backgroundSize = 'cover';
        designImage.innerHTML =
          '<div class="upload-text">📷 Change Image</div>';
      } else {
        // Ensure upload area is clean for new products
        designImage.style.backgroundImage = '';
        designImage.innerHTML =
          '<div class="upload-text">📤 Upload Image</div>';
      }
    }
  }

  // Update Quiz Promo section UI
  const quizPromoHeading = document.getElementById('quizPromoHeading');
  if (quizPromoHeading && quizData.quizPromoSection) {
    // For new products, ensure completely blank fields
    quizPromoHeading.value = quizData.quizPromoSection.heading || '';

    const quizPromoButtonText = document.getElementById('quizPromoButtonText');
    if (quizPromoButtonText) {
      quizPromoButtonText.value = quizData.quizPromoSection.buttonText || '';
    }

    const quizPromoButtonLink = document.getElementById('quizPromoButtonLink');
    if (quizPromoButtonLink) {
      quizPromoButtonLink.value = quizData.quizPromoSection.buttonLink || '';
    }

    renderQuizPromoFeatures();
    renderQuizPromoImages();
  }

  // Render questions
  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';

  quizData.questions.forEach((question, qIndex) => {
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    questionCard.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${question.id}</span>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-success" onclick="saveQuestion(${qIndex})" style="padding: 5px 15px;">💾 Save</button>
                    <button class="btn btn-danger" onclick="removeQuestion(${qIndex})">Remove</button>
                </div>
            </div>
            <input type="text" class="question-input" value="${question.title || ''}"
                   onchange="updateQuestionTitle(${qIndex}, this.value)"
                   placeholder="Enter question title (optional)..."
                   style="margin-bottom: 10px; font-weight: 600; font-size: 16px;">
            <input type="text" class="question-input" value="${question.text}"
                   onchange="updateQuestionText(${qIndex}, this.value)"
                   placeholder="Enter question text...">
            <div class="options-grid" id="options-${qIndex}">
                ${renderOptions(question.options, qIndex)}
            </div>
            <button class="btn btn-primary" onclick="addOption(${qIndex})" style="margin-top: 15px;">+ Add Option</button>
        `;
    container.appendChild(questionCard);
  });
}

function renderOptions(options, qIndex) {
  return options
    .map(
      (option, oIndex) => `
        <div class="option-card">
            <div class="option-header">
                <span class="option-label">Option ${option.id.toUpperCase()}</span>
                <button class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;"
                        onclick="removeOption(${qIndex}, ${oIndex})">×</button>
            </div>
            <div class="image-upload-area ${option.image ? 'has-image' : ''}"
                 id="image-${qIndex}-${oIndex}"
                 style="${
                   option.image
                     ? `background-image: url('${option.image}')`
                     : ''
                 }"
                 onclick="document.getElementById('file-${qIndex}-${oIndex}').click()">
                <div class="upload-text">
                    ${
                      option.image
                        ? '📷 Click to change image'
                        : '📤 Click to upload image'
                    }
                </div>
            </div>
            <input type="file" id="file-${qIndex}-${oIndex}"
                   style="display: none;" accept="image/*"
                   onchange="handleImageUpload(${qIndex}, ${oIndex}, this)">
            <input type="text" class="option-text-input"
                   value="${option.text}"
                   onchange="updateOptionText(${qIndex}, ${oIndex}, this.value)"
                   placeholder="Enter option text...">
        </div>
    `
    )
    .join('');
}

function updateQuestionText(qIndex, text) {
  quizData.questions[qIndex].text = text;
  showStatus('Question text updated', 'success');
}

function updateQuestionTitle(qIndex, title) {
  quizData.questions[qIndex].title = title;
  showStatus('Question title updated', 'success');
}

function updateOptionText(qIndex, oIndex, text) {
  quizData.questions[qIndex].options[oIndex].text = text;
  showStatus('Option text updated', 'success');
}

async function handleImageUpload(qIndex, oIndex, input) {
  const file = input.files[0];
  if (file) {
    try {
      showStatus(
        `Uploading question ${qIndex + 1} option ${oIndex + 1} image...`,
        'info'
      );
      const response = await apiClient.uploadImage(file);

      if (response.status === 'success') {
        const imageUrl = response.data.url;
        quizData.questions[qIndex].options[oIndex].image = imageUrl;
        const imageArea = document.getElementById(`image-${qIndex}-${oIndex}`);
        imageArea.style.backgroundImage = `url('${imageUrl}')`;
        imageArea.classList.add('has-image');
        imageArea.innerHTML =
          '<div class="upload-text">📷 Click to change image</div>';
        showStatus('Question image uploaded successfully', 'success');
      } else {
        showStatus(
          'Failed to upload question image: ' + response.message,
          'error'
        );
      }
    } catch (error) {
      console.error('Question image upload error:', error);
      showStatus('Error uploading question image: ' + error.message, 'error');
    }
  }
}

function addNewQuestion() {
  const newId = quizData.questions.length + 1;
  quizData.questions.push({
    id: newId,
    title: '',
    text: `New Question ${newId}`,
    options: [
      { id: 'a', text: 'Option A', image: '' },
      { id: 'b', text: 'Option B', image: '' },
      { id: 'c', text: 'Option C', image: '' },
    ],
  });
  renderQuestions();
  showStatus('New question added', 'success');

  // Scroll to the newly added question
  setTimeout(() => {
    const questionCards = document.querySelectorAll(
      '#questionsContainer .question-card'
    );
    if (questionCards.length > 0) {
      const lastQuestion = questionCards[questionCards.length - 1];
      lastQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}

function removeQuestion(qIndex) {
  if (confirm('Are you sure you want to remove this question?')) {
    quizData.questions.splice(qIndex, 1);
    // Renumber remaining questions
    quizData.questions.forEach((q, i) => {
      q.id = i + 1;
    });
    renderQuestions();
    showStatus('Question removed', 'success');
  }
}

function addOption(qIndex) {
  const options = quizData.questions[qIndex].options;
  const nextId = String.fromCharCode(97 + options.length); // Generate next letter (a, b, c, ...)
  options.push({
    id: nextId,
    text: `Option ${nextId.toUpperCase()}`,
    image: '',
  });
  renderQuestions();
  showStatus('New option added', 'success');
}

function removeOption(qIndex, oIndex) {
  if (confirm('Are you sure you want to remove this option?')) {
    quizData.questions[qIndex].options.splice(oIndex, 1);
    // Re-letter remaining options
    quizData.questions[qIndex].options.forEach((opt, i) => {
      opt.id = String.fromCharCode(97 + i);
    });
    renderQuestions();
    showStatus('Option removed', 'success');
  }
}

// Product deletion functions
async function confirmDeleteProduct() {
  try {
    if (currentProductKey === 'default') {
      showStatus('Cannot delete the default product', 'error');
      return;
    }

    // Get current product details
    const response = await apiClient.getProducts();
    const product = response.products.find(
      (p) => p.product_key === currentProductKey
    );

    if (!product) {
      showStatus('Product not found', 'error');
      return;
    }

    const productName = `${product.name}`;

    // Show confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to delete "${productName}" quiz?\n\n` +
        `This will permanently delete:\n` +
        `• All quiz questions and content\n` +
        `• All images and settings\n` +
        `• This action cannot be undone\n\n` +
        `Type YES to confirm deletion.`
    );

    if (confirmed) {
      const userInput = prompt(
        `To confirm deletion of "${productName}" quiz, please type: YES`
      );

      if (userInput === 'YES') {
        await deleteProduct(currentProductKey);
      } else if (userInput !== null) {
        showStatus('Deletion cancelled - incorrect confirmation text', 'error');
      }
    }
  } catch (error) {
    console.error('Failed to confirm product deletion:', error);
    showStatus('Failed to confirm product deletion: ' + error.message, 'error');
  }
}

async function deleteProduct(productKey) {
  try {
    // Show loading message
    showStatus('Deleting product...', 'info');

    // Call the API to delete the product
    await apiClient.deleteProduct(productKey);

    // Update the product selector
    await updateProductQuizSelector();

    // Switch to the default product
    const selector = document.getElementById('productQuizSelector');
    if (selector) {
      selector.value = 'default';
      await switchProductQuiz('default');
    }

    showStatus('Product deleted successfully', 'success');
  } catch (error) {
    console.error('Failed to delete product:', error);
    showStatus('Failed to delete product: ' + error.message, 'error');
  }
}

// Modal functions
function openNewProductQuizModal() {
  document.getElementById('newProductModal').style.display = 'block';
  // Clear previous values
  document.getElementById('productName').value = '';
  document.getElementById('productDescription').value = '';
}

function closeNewProductModal() {
  document.getElementById('newProductModal').style.display = 'none';
}

// Export/Import functions
function exportJSON() {
  const modal = document.getElementById('jsonModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  modalTitle.textContent = 'Export Quiz Data (JSON)';
  modalBody.innerHTML = `
        <p>Copy this JSON data to save or share your quiz configuration:</p>
        <div class="json-output">${JSON.stringify(quizData, null, 2)}</div>
        <button class="btn btn-primary" onclick="copyToClipboard()">📋 Copy to Clipboard</button>
    `;

  modal.style.display = 'block';
}

function importJSON() {
  const modal = document.getElementById('jsonModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  modalTitle.textContent = 'Import Quiz Data (JSON)';
  modalBody.innerHTML = `
        <p>Paste your quiz JSON data below:</p>
        <textarea id="jsonInput" style="width: 100%; height: 300px; font-family: monospace;"></textarea>
        <button class="btn btn-success" onclick="processImport()">Import Data</button>
    `;

  modal.style.display = 'block';
}

function processImport() {
  const jsonInput = document.getElementById('jsonInput').value;
  try {
    quizData = JSON.parse(jsonInput);
    renderQuestions();
    closeModal();
    showStatus('Quiz data imported successfully', 'success');
  } catch (error) {
    alert('Invalid JSON format. Please check your data.');
    showStatus('Import failed: Invalid JSON', 'error');
  }
}

function copyToClipboard() {
  const jsonText = JSON.stringify(quizData, null, 2);
  navigator.clipboard.writeText(jsonText).then(() => {
    showStatus('Copied to clipboard!', 'success');
  });
}

function closeModal() {
  document.getElementById('jsonModal').style.display = 'none';
}

function previewQuiz() {
  // Save current data first to ensure preview shows latest changes
  saveQuiz()
    .then(() => {
      // Construct the correct URL for index.php with specific product parameter
      const currentUrl = window.location.href;
      console.log('Current URL:', currentUrl);

      // Split the URL to get the base path
      const urlParts = currentUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      console.log('Current file:', fileName);

      // Replace the filename with index.php and include product-specific parameters
      const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
      const previewUrl = `${baseUrl}/index.php?preview=1&product=${encodeURIComponent(
        currentProductKey
      )}&t=${Date.now()}`;

      console.log('Base URL:', baseUrl);
      console.log('Opening preview URL:', previewUrl);

      // Open in new tab with specific product context
      window.open(previewUrl, '_blank');

      showStatus(
        `Opening ${currentProductKey} preview in new tab...`,
        'success'
      );
    })
    .catch((error) => {
      console.error('Failed to save before preview:', error);
      showStatus('Failed to save data before preview', 'error');
    });
}

function generateQuizCode() {
  console.log('Generated quiz JavaScript code:');
}

function showStatus(message, type) {
  const statusEl = document.getElementById('statusMessage');

  // Add icon based on status type
  let icon;
  switch (type) {
    case 'success':
      icon = '✓';
      break;
    case 'error':
      icon = '✗';
      break;
    case 'info':
      icon = 'ℹ';
      break;
    default:
      icon = '●';
      break;
  }
  statusEl.innerHTML = `<strong>${icon}</strong> ${message}`;

  statusEl.className = `status-message status-${type}`;
  statusEl.style.display = 'block';

  // Clear any existing timeout
  if (window.statusTimeout) {
    clearTimeout(window.statusTimeout);
  }

  // Hide after 4 seconds (slightly longer for better visibility)
  window.statusTimeout = setTimeout(() => {
    statusEl.style.display = 'none';
  }, 4000);
}

// Individual section save functions
async function saveBannerSection() {
  try {
    await apiClient.saveSectionOnly(
      currentProductKey,
      'banner',
      quizData.bannerSection
    );

    showStatus('Banner section saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving banner section:', error);
    showStatus('Failed to save banner section', 'error');
  }
}

async function saveShowroomSection() {
  try {
    await apiClient.saveSectionOnly(
      currentProductKey,
      'showroom',
      quizData.showroomSection
    );

    showStatus('Showroom section saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving showroom section:', error);
    showStatus('Failed to save showroom section', 'error');
  }
}

async function saveLuxurySofasSection() {
  try {
    await apiClient.saveSectionOnly(
      currentProductKey,
      'luxury_content',
      quizData.luxurySofasSection
    );

    showStatus('Luxury content section saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving luxury content section:', error);
    showStatus('Failed to save luxury content section', 'error');
  }
}

async function saveGallerySection() {
  try {
    await apiClient.saveSectionOnly(
      currentProductKey,
      'gallery',
      quizData.gallerySection
    );

    showStatus('Gallery section saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving gallery section:', error);
    showStatus('Failed to save gallery section', 'error');
  }
}

async function saveDesignCTASection() {
  try {
    await apiClient.saveSectionOnly(
      currentProductKey,
      'design_expert',
      quizData.designDisasterSection
    );

    showStatus('Design Expert CTA section saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving Design Expert CTA section:', error);
    showStatus('Failed to save Design Expert CTA section', 'error');
  }
}

async function saveQuizPromoSection() {
  try {
    await apiClient.saveSectionOnly(
      currentProductKey,
      'quiz_promo',
      quizData.quizPromoSection
    );

    showStatus('Quiz Promo section saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving Quiz Promo section:', error);
    showStatus('Failed to save Quiz Promo section', 'error');
  }
}

// Save individual question
async function saveQuestion(questionIndex) {
  try {
    await apiClient.saveQuestionsOnly(currentProductKey, quizData.questions);

    showStatus(`Question ${questionIndex + 1} saved successfully!`, 'success');
  } catch (error) {
    console.error('Error saving question:', error);
    showStatus(`Failed to save Question ${questionIndex + 1}`, 'error');
  }
}

// Initialize on load
window.onload = function () {
  initializeDashboard();

  // Initialize gallery section with 4 image slots
  setTimeout(() => {
    if (!quizData.gallerySection) {
      quizData.gallerySection = { images: [] };
    }
    if (!quizData.gallerySection.images) {
      quizData.gallerySection.images = [];
    }

    // Ensure we always have exactly 4 image slots with all fields
    while (quizData.gallerySection.images.length < 4) {
      quizData.gallerySection.images.push({
        src: '',
        alt: '',
        title: '',
        subtitle: '',
        link: '',
      });
    }
    renderGalleryItems();
  }, 500);
};

// Close modal when clicking outside
window.onclick = function (event) {
  const jsonModal = document.getElementById('jsonModal');
  const newProductModal = document.getElementById('newProductModal');

  if (event.target == jsonModal) {
    jsonModal.style.display = 'none';
  }
  if (event.target == newProductModal) {
    newProductModal.style.display = 'none';
  }
};
