// Dashboard JavaScript - Quiz Content Management System with PHP Backend

let quizData = {
  questions: [],
};

let currentProductKey = 'sofa';

// Initialize dashboard
async function initializeDashboard() {
  try {
    // Get current product
    currentProductKey = await apiClient.getCurrentProduct();

    // Update product selector
    await updateProductQuizSelector();

    // Set selector value
    const selector = document.getElementById('productQuizSelector');
    if (selector) {
      selector.value = currentProductKey;
    }

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

    // Add sofa option if not present
    if (selector.children.length === 0) {
      const sofaOption = document.createElement('option');
      sofaOption.value = 'sofa';
      sofaOption.textContent = '🛋️ Sofa Quiz';
      selector.appendChild(sofaOption);
    }

    // Add options for each product quiz
    response.products.forEach((product) => {
      if (product.product_key !== 'sofa') {
        // Skip sofa as it's already added
        const option = document.createElement('option');
        option.value = product.product_key;
        option.textContent = `${product.emoji} ${product.name} Quiz`;
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

    // Update current product setting
    await apiClient.setCurrentProduct(productKey);

    // Update dashboard title
    const response = await apiClient.getProducts();
    const product = response.products.find((p) => p.product_key === productKey);

    let title = '🛋️ Sofa Quiz Content Management Dashboard';
    if (product && productKey !== 'sofa') {
      title = `${product.emoji} ${product.name} Quiz Content Management Dashboard`;
    }

    document.getElementById('dashboardTitle').textContent = title;

    // Load content for this product
    await loadCurrentQuiz();

    showStatus(`Switched to ${productKey} quiz`, 'success');
  } catch (error) {
    console.error('Failed to switch product:', error);
    showStatus('Failed to switch product: ' + error.message, 'error');
  }
}

// Load current quiz data
async function loadCurrentQuiz() {
  try {
    const response = await apiClient.getContent(currentProductKey);
    const content = response.content;

    // Convert API format to dashboard format
    quizData = {
      bannerSection: content.banner || {
        mainHeading: 'Match Your Personality To A Luxury Product.',
        subHeading: 'Try Our AI Tool',
        backgroundImage: '',
        mobileImage: '',
      },
      showroomSection: content.showroom || {
        heading: 'The largest luxury showroom in London',
        image: '',
      },
      luxurySofasSection: content.luxury_content || {
        title: 'Luxury Products, Redefined',
        introduction: 'Experience the finest collection.',
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
        heading: 'Take our lifestyle quiz.',
        features: [],
        buttonText: 'Try our Quiz',
        buttonLink: '#quiz',
        images: [],
      },
      questions: content.questions || [],
    };

    renderQuestions();

    // Ensure gallery section is rendered
    if (!quizData.gallerySection.images || quizData.gallerySection.images.length === 0) {
      quizData.gallerySection.images = [
        { src: '', alt: '' },
        { src: '', alt: '' },
        { src: '', alt: '' }
      ];
    }
    renderGalleryItems();

    showStatus('Quiz data loaded successfully', 'success');
  } catch (error) {
    console.error('Failed to load quiz data:', error);
    showStatus('Failed to load quiz data: ' + error.message, 'error');
    // Fall back to empty data
    initializeSampleData();
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
    const productEmoji = document.getElementById('productEmoji').value.trim();
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
      emoji: productEmoji || '📦',
      description: productDescription,
    };

    await apiClient.createProduct(productData);
    await updateProductQuizSelector();
    await switchProductQuiz(productKey);

    closeNewProductModal();
    showStatus(`${productName} quiz created successfully!`, 'success');
  } catch (error) {
    console.error('Failed to create product:', error);
    alert('Failed to create product: ' + error.message);
  }
}

// Initialize with sample data (fallback)
function initializeSampleData() {
  quizData = {
    bannerSection: {
      mainHeading: 'Match Your Personality To A Luxury Sofa.',
      subHeading: 'Try Our AI Tool',
      backgroundImage:
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/gallotti-and-radice-banner-1.jpg',
      mobileImage:
        '../cdn-cgi/image/quality=60,f=auto/site-assets/images/luxury/luxury-banner-1-mobile.jpg',
    },
    showroomSection: {
      heading: 'The largest luxury sofa showroom in London',
      image: '../cdn-cgi/image/quality=75,f=auto/site-assets/shoroomlndn.jpg',
    },
    luxurySofasSection: {
      title: 'Luxury Sofas, Redefined',
      introduction:
        "A sofa is never just a sofa. It's where you unwind after a long day, host spirited conversations, and perhaps—if it's truly exquisite—fall hopelessly in love with your own living room. At FCI London, we don't just sell sofas; we curate spaces of sophistication, tailored to those who appreciate life's finer details.",
      subtitle: 'Why Visit Our Showroom?',
      points: [],
      conclusion:
        '<strong>Visit Us & Experience Luxury Firsthand</strong><br>Indulgence begins with a single step—or rather, a single seat. Visit our London showroom to immerse yourself in a world of impeccable design and let us help you find the sofa you never knew you needed.',
    },
    gallerySection: {
      images: [
        { src: '', alt: 'Gallery Image 1' },
        { src: '', alt: 'Gallery Image 2' },
        { src: '', alt: 'Gallery Image 3' }
      ]
    },
    designDisasterSection: {
      heading: 'Avoid a design disaster.\nTalk to an expert.',
      image:
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/avoid-a-design-disaster.jpg',
      buttonText: 'Book now',
      buttonLink: '/book-a-showroom-visit.html',
    },
    quizPromoSection: {
      heading: 'Take our lifestyle quiz & find the perfect sofa match.',
      features: [],
      buttonText: 'Try our Sofa Matching Quiz',
      buttonLink: '#sofaquiz',
      images: [],
    },
    questions: [],
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
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 10px; background: #f9f9f9;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1; margin-right: 10px;">
                    <input type="text"
                           value="${point.title}"
                           onchange="updateLuxurySofasPoint(${index}, 'title', this.value)"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; font-weight: bold;"
                           placeholder="Point title...">
                    <textarea
                           onchange="updateLuxurySofasPoint(${index}, 'description', this.value)"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;"
                           placeholder="Point description...">${point.description}</textarea>
                </div>
                <button class="btn btn-danger" onclick="removeLuxurySofasPoint(${index})" style="padding: 5px 10px;">×</button>
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

function handleBannerImageUpload(type, input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      if (type === 'desktop') {
        quizData.bannerSection.backgroundImage = imageData;
        const imageArea = document.getElementById('banner-desktop-image');
        imageArea.style.backgroundImage = `url('${imageData}')`;
        imageArea.style.backgroundSize = 'cover';
        imageArea.innerHTML =
          '<div class="upload-text">📷 Change Desktop Banner</div>';
      } else if (type === 'mobile') {
        quizData.bannerSection.mobileImage = imageData;
        const imageArea = document.getElementById('banner-mobile-image');
        imageArea.style.backgroundImage = `url('${imageData}')`;
        imageArea.style.backgroundSize = 'cover';
        imageArea.innerHTML =
          '<div class="upload-text">📱 Change Mobile Banner</div>';
      }
      showStatus(`Banner ${type} image uploaded`, 'success');
    };
    reader.readAsDataURL(file);
  }
}

function updateShowroomHeading(text) {
  quizData.showroomSection.heading = text;
  showStatus('Showroom heading updated', 'success');
}

function handleShowroomImageUpload(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      quizData.showroomSection.image = imageData;
      const imageArea = document.getElementById('showroom-image');
      imageArea.style.backgroundImage = `url('${imageData}')`;
      imageArea.innerHTML =
        '<div class="upload-text">📷 Click to change showroom image</div>';
      showStatus('Showroom image uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
  }
}

// Design Disaster Section Functions
function updateDesignDisasterText(field, value) {
  quizData.designDisasterSection[field] = value;
  showStatus(`Design section ${field} updated`, 'success');
}

function handleDesignDisasterImageUpload(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      quizData.designDisasterSection.image = imageData;
      const imageArea = document.getElementById('design-disaster-image');
      imageArea.style.backgroundImage = `url('${imageData}')`;
      imageArea.style.backgroundSize = 'cover';
      imageArea.innerHTML = '<div class="upload-text">📷 Change Image</div>';
      showStatus('Design section image uploaded', 'success');
    };
    reader.readAsDataURL(file);
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
    .map(
      (image, index) => `
        <div style="position: relative;">
            <div class="image-upload-area ${image ? 'has-image' : ''}"
                 id="quizpromo-image-${index}"
                 style="height: 100px; ${
                   image ? `background-image: url('${image}')` : ''
                 }"
                 onclick="document.getElementById('quizpromo-file-${index}').click()">
                <div class="upload-text" style="font-size: 10px;">
                    ${image ? '📷' : '📤'}
                </div>
            </div>
            <input type="file" id="quizpromo-file-${index}"
                   style="display: none;" accept="image/*"
                   onchange="handleQuizPromoImageUpload(${index}, this)">
            <button class="btn btn-danger"
                    onclick="removeQuizPromoImage(${index})"
                    style="position: absolute; top: 5px; right: 5px; padding: 2px 6px; font-size: 12px;">×</button>
        </div>
    `
    )
    .join('');
}

function addQuizPromoImage() {
  quizData.quizPromoSection.images.push('');
  renderQuizPromoImages();
  showStatus('Image slot added', 'success');
}

function handleQuizPromoImageUpload(index, input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      quizData.quizPromoSection.images[index] = imageData;
      renderQuizPromoImages();
      showStatus('Image uploaded', 'success');
    };
    reader.readAsDataURL(file);
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
      { src: '', alt: '' },
      { src: '', alt: '' },
      { src: '', alt: '' },
    ];
  }

  quizData.gallerySection.images.forEach((item, index) => {
    const container = document.getElementById(`gallery-item-${index}`);
    if (!container) return;

    container.innerHTML = `
            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 8px; background: white;">
                <h4 style="color: #9c27b0; margin: 0 0 10px 0;">Image ${
                  index + 1
                }</h4>
                <div class="image-upload-area ${item.src ? 'has-image' : ''}"
                     id="gallery-image-${index}"
                     style="height: 150px; margin-bottom: 10px; ${
                       item.src ? `background-image: url('${item.src}')` : ''
                     }"
                     onclick="document.getElementById('gallery-file-${index}').click()">
                    <div class="upload-text">
                        ${item.src ? '📷 Change image' : '📤 Upload image'}
                    </div>
                </div>
                <input type="file" id="gallery-file-${index}"
                       style="display: none;" accept="image/*"
                       onchange="handleGalleryImageUpload(${index}, this)">
                <input type="text" placeholder="Image description/alt text"
                       value="${item.alt || ''}"
                       onchange="updateGalleryAlt(${index}, this.value)"
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
        `;
  });
}

function handleGalleryImageUpload(index, input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      quizData.gallerySection.images[index].src = imageData;
      renderGalleryItems();
      showStatus('Gallery image uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
  }
}

function updateGalleryAlt(index, value) {
  quizData.gallerySection.images[index].alt = value;
  showStatus('Image description updated', 'success');
}

// Question management functions
function renderQuestions() {
  // Update banner section UI
  const bannerMainHeading = document.getElementById('bannerMainHeading');
  if (bannerMainHeading && quizData.bannerSection) {
    bannerMainHeading.value =
      quizData.bannerSection.mainHeading ||
      'Match Your Personality To A Luxury Product.';
    document.getElementById('bannerSubHeading').value =
      quizData.bannerSection.subHeading || 'Try Our AI Tool';

    if (quizData.bannerSection.backgroundImage) {
      const desktopImage = document.getElementById('banner-desktop-image');
      desktopImage.style.backgroundImage = `url('${quizData.bannerSection.backgroundImage}')`;
      desktopImage.style.backgroundSize = 'cover';
      desktopImage.innerHTML =
        '<div class="upload-text">📷 Change Desktop Banner</div>';
    }

    if (quizData.bannerSection.mobileImage) {
      const mobileImage = document.getElementById('banner-mobile-image');
      mobileImage.style.backgroundImage = `url('${quizData.bannerSection.mobileImage}')`;
      mobileImage.style.backgroundSize = 'cover';
      mobileImage.innerHTML =
        '<div class="upload-text">📱 Change Mobile Banner</div>';
    }
  }

  // Update showroom section UI
  const showroomHeading = document.getElementById('showroomHeading');
  if (showroomHeading && quizData.showroomSection) {
    showroomHeading.value =
      quizData.showroomSection.heading ||
      'The largest luxury showroom in London';

    const showroomImage = document.getElementById('showroom-image');
    if (showroomImage && quizData.showroomSection.image) {
      showroomImage.style.backgroundImage = `url('${quizData.showroomSection.image}')`;
      showroomImage.innerHTML =
        '<div class="upload-text">📷 Click to change showroom image</div>';
    }
  }

  // Update Luxury Content section UI
  if (quizData.luxurySofasSection) {
    const luxurySofasTitle = document.getElementById('luxurySofasTitle');
    if (luxurySofasTitle) {
      luxurySofasTitle.value =
        quizData.luxurySofasSection.title || 'Luxury Products, Redefined';
    }

    const luxurySofasIntro = document.getElementById('luxurySofasIntro');
    if (luxurySofasIntro) {
      luxurySofasIntro.value = quizData.luxurySofasSection.introduction || '';
    }

    const luxurySofasSubtitle = document.getElementById('luxurySofasSubtitle');
    if (luxurySofasSubtitle) {
      luxurySofasSubtitle.value =
        quizData.luxurySofasSection.subtitle || 'Why Visit Our Showroom?';
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
    designDisasterHeading.value =
      quizData.designDisasterSection.heading ||
      'Avoid a design disaster.\nTalk to an expert.';
    document.getElementById('designDisasterButtonText').value =
      quizData.designDisasterSection.buttonText || 'Book now';
    document.getElementById('designDisasterButtonLink').value =
      quizData.designDisasterSection.buttonLink ||
      '/book-a-showroom-visit.html';

    if (quizData.designDisasterSection.image) {
      const designImage = document.getElementById('design-disaster-image');
      designImage.style.backgroundImage = `url('${quizData.designDisasterSection.image}')`;
      designImage.style.backgroundSize = 'cover';
      designImage.innerHTML = '<div class="upload-text">📷 Change Image</div>';
    }
  }

  // Update Quiz Promo section UI
  const quizPromoHeading = document.getElementById('quizPromoHeading');
  if (quizPromoHeading && quizData.quizPromoSection) {
    quizPromoHeading.value =
      quizData.quizPromoSection.heading || 'Take our lifestyle quiz.';
    document.getElementById('quizPromoButtonText').value =
      quizData.quizPromoSection.buttonText || 'Try our Quiz';
    document.getElementById('quizPromoButtonLink').value =
      quizData.quizPromoSection.buttonLink || '#quiz';
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
                <button class="btn btn-danger" onclick="removeQuestion(${qIndex})">Remove</button>
            </div>
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

function updateOptionText(qIndex, oIndex, text) {
  quizData.questions[qIndex].options[oIndex].text = text;
  showStatus('Option text updated', 'success');
}

function handleImageUpload(qIndex, oIndex, input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      quizData.questions[qIndex].options[oIndex].image = imageData;
      const imageArea = document.getElementById(`image-${qIndex}-${oIndex}`);
      imageArea.style.backgroundImage = `url('${imageData}')`;
      imageArea.classList.add('has-image');
      imageArea.innerHTML =
        '<div class="upload-text">📷 Click to change image</div>';
      showStatus('Image uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
  }
}

function addNewQuestion() {
  const newId = quizData.questions.length + 1;
  quizData.questions.push({
    id: newId,
    text: `New Question ${newId}`,
    options: [
      { id: 'a', text: 'Option A', image: '' },
      { id: 'b', text: 'Option B', image: '' },
      { id: 'c', text: 'Option C', image: '' },
      { id: 'd', text: 'Option D', image: '' },
    ],
  });
  renderQuestions();
  showStatus('New question added', 'success');
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

// Modal functions
function openNewProductQuizModal() {
  document.getElementById('newProductModal').style.display = 'block';
  // Clear previous values
  document.getElementById('productName').value = '';
  document.getElementById('productEmoji').value = '';
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
  const previewSection = document.getElementById('previewSection');
  const previewContent = document.getElementById('previewContent');

  previewSection.style.display = 'block';

  // Preview rendering with all sections
  let html =
    '<div style="background: white; padding: 20px; border-radius: 8px;">';

  // Add showroom section preview
  html += `
        <div style="margin-bottom: 40px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">${
              quizData.showroomSection.heading
            }</h2>
            ${
              quizData.showroomSection.image
                ? `<img src="${quizData.showroomSection.image}" style="width: 100%; max-width: 800px; height: auto; border-radius: 8px; display: block; margin: 0 auto;">`
                : '<div style="height: 300px; background: #e0e0e0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">No Showroom Image</div>'
            }
        </div>
    `;

  // Add Luxury Content section preview
  if (quizData.luxurySofasSection) {
    html += `
            <div style="margin-bottom: 40px; padding: 20px; background: #f0e6ff; border-radius: 8px;">
                <h2 style="color: #6b46c1; text-align: center; margin-bottom: 20px;">${quizData.luxurySofasSection.title}</h2>
                <p style="margin-bottom: 20px;">${quizData.luxurySofasSection.introduction}</p>
                <h3 style="color: #6b46c1; margin-bottom: 15px;">${quizData.luxurySofasSection.subtitle}</h3>
        `;

    if (quizData.luxurySofasSection.points) {
      quizData.luxurySofasSection.points.forEach((point) => {
        html += `
                    <div style="margin-bottom: 15px;">
                        <strong>${point.title}</strong><br>
                        ${point.description}
                    </div>
                `;
      });
    }

    html += `
                <div style="margin-top: 20px;">${quizData.luxurySofasSection.conclusion}</div>
            </div>
        `;
  }

  html += `
        <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">
        <h3 style="color: #2196F3; margin-bottom: 30px;">Quiz Questions:</h3>
    `;

  quizData.questions.forEach((q, qIndex) => {
    html += `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 20px;">${q.text}</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
        `;

    q.options.forEach((opt) => {
      html += `
                <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; text-align: center;">
                    ${
                      opt.image
                        ? `<img src="${opt.image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">`
                        : '<div style="height: 100px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 5px; margin-bottom: 10px;">No Image</div>'
                    }
                    <div style="font-size: 14px;">${opt.text}</div>
                </div>
            `;
    });

    html += '</div></div>';
  });

  html += '</div>';
  previewContent.innerHTML = html;

  // Scroll to preview
  previewSection.scrollIntoView({ behavior: 'smooth' });
}

function generateQuizCode() {
  console.log('Generated quiz JavaScript code:');
}

function showStatus(message, type) {
  const statusEl = document.getElementById('statusMessage');
  statusEl.textContent = message;
  statusEl.className = `status-message status-${type}`;
  statusEl.style.display = 'block';

  setTimeout(() => {
    statusEl.style.display = 'none';
  }, 3000);
}

// Initialize on load
window.onload = function () {
  initializeDashboard();

  // Initialize gallery section if it doesn't exist
  setTimeout(() => {
    if (!quizData.gallerySection || !quizData.gallerySection.images) {
      quizData.gallerySection = {
        images: [
          { src: '', alt: '' },
          { src: '', alt: '' },
          { src: '', alt: '' }
        ]
      };
      renderGalleryItems();
    }
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
