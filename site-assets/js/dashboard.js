// Dashboard JavaScript - Quiz Content Management System

let quizData = {
  questions: [],
};

// Initialize with sample data (from original quiz)
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
      heading: 'The largest luxury default showroom in London',
      image: '../cdn-cgi/image/quality=75,f=auto/site-assets/shoroomlndn.jpg',
    },
    luxuryDefaultsSection: {
      title: 'Luxury Defaults, Redefined',
      introduction:
        "A product is never just a product. It's where you unwind after a long day, host spirited conversations, and perhaps—if it's truly exquisite—fall hopelessly in love with your own living room. At FCI London, we don't just sell products; we curate spaces of sophistication, tailored to those who appreciate life's finer details.",
      subtitle: 'Why Visit Our Showroom?',
      points: [
        {
          title: '1. The Largest Collection in London',
          description:
            "Why settle for standard when you can have the exceptional? Our showroom houses an unparalleled selection of luxury products, from timeless classics to contemporary masterpieces, all meticulously crafted by the world's finest artisans.",
        },
        {
          title: '2. Bespoke, Just for You',
          description:
            "Luxury is personal. That's why we offer fully customisable designs—every stitch, curve, and cushion tailored to your exacting standards. Whether it's hand-stitched Italian leather or a sumptuous velvet that whispers elegance, we bring your vision to life.",
        },
        {
          title: '3. The Touch Test',
          description:
            "A product should never be chosen from a screen. It's about how it feels—the depth of the cushioning, the smoothness of the upholstery, the perfect balance of support and indulgence. Our showroom invites you to experience craftsmanship in its truest form.",
        },
        {
          title: '4. Design Expertise, on Demand',
          description:
            "Our team of seasoned interior designers are at your service, ready to refine, reimagine, and elevate your space with tailored advice and creative insight. Whether you're seeking a statement piece or an entire living room transformation, we make it effortless.",
        },
        {
          title: '5. Instant Gratification',
          description:
            "Impatience is a virtue when it comes to interiors. With many of our luxury products available for immediate delivery, there's no need to wait months for perfection to arrive.",
        },
      ],
      conclusion:
        '<strong>Visit Us & Experience Luxury Firsthand</strong><br>Indulgence begins with a single step—or rather, a single seat. Visit our London showroom to immerse yourself in a world of impeccable design and let us help you find the default you never knew you needed.',
    },
    gallerySection: {
      images: [
        {
          src: '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/lpluxury-funiture-03.jpg',
          alt: 'Luxury sectional default in modern living room',
        },
        {
          src: '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-defaults-8.jpg',
          alt: 'Elegant leather luxury default',
        },
        {
          src: '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/lpluxury-funiture-05.jpg',
          alt: 'Designer fabric luxury default',
        },
        {
          src: '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/lpluxury-funiture-05.jpg',
          alt: 'Designer fabric luxury default',
        },
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
      heading: 'Take our lifestyle quiz & find the perfect default match.',
      features: [
        'AI Matching algorithm',
        'Searches over 2000 Luxury Defaults',
        'Results Within 10 Minutes',
        'Only Branded Italian Design',
        'Exclusive Branded Italian Designs',
        'Free Consultation Available',
      ],
      buttonText: 'Try our Default Matching Quiz',
      buttonLink: '#productquiz',
      images: [
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-furniture-design-1.jpg',
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-furniture-design-2.jpg',
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-furniture-design-3.jpg',
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-defaults-1.jpg',
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-defaults-2.jpg',
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-defaults-3.jpg',
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-defaults-4.jpg',
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-defaults-5.jpg',
      ],
    },
    questions: [
      {
        id: 1,
        text: 'What best describes your household?',
        options: [
          {
            id: 'a',
            text: 'Young kids—energetic, messy, and always moving',
            image:
              '/site-assets/images/default-quiz/young-kids-energetic-messy-and-always-moving.jpg',
          },
          {
            id: 'b',
            text: 'Teenagers or young adults still at home',
            image:
              '/site-assets/images/default-quiz/teenagers-or-young-adults-still-at-home.jpg',
          },
          {
            id: 'c',
            text: 'Just the two of us—calm and design-focused',
            image:
              '/site-assets/images/default-quiz/just-the-two-of-us-calm-and-design-focused.jpg',
          },
        ],
      },
    ],
  };
  renderQuestions();
}

// Luxury Defaults Section Functions
function updateLuxuryDefaultsContent(field, value) {
  if (!quizData.luxuryDefaultsSection) {
    quizData.luxuryDefaultsSection = {};
  }
  quizData.luxuryDefaultsSection[field] = value;
  showStatus(`Luxury Defaults ${field} updated`, 'success');
}

function renderLuxuryDefaultsPoints() {
  const container = document.getElementById('luxuryDefaultsPoints');
  if (
    !container ||
    !quizData.luxuryDefaultsSection ||
    !quizData.luxuryDefaultsSection.points
  )
    return;

  container.innerHTML = quizData.luxuryDefaultsSection.points
    .map(
      (point, index) => `
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 10px; background: #f9f9f9;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1; margin-right: 10px;">
                    <input type="text"
                           value="${point.title}"
                           onchange="updateLuxuryDefaultsPoint(${index}, 'title', this.value)"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; font-weight: bold;"
                           placeholder="Point title...">
                    <textarea
                           onchange="updateLuxuryDefaultsPoint(${index}, 'description', this.value)"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;"
                           placeholder="Point description...">${point.description}</textarea>
                </div>
                <button class="btn btn-danger" onclick="removeLuxuryDefaultsPoint(${index})" style="padding: 5px 10px;">×</button>
            </div>
        </div>
    `
    )
    .join('');
}

function addLuxuryDefaultsPoint() {
  if (!quizData.luxuryDefaultsSection) {
    quizData.luxuryDefaultsSection = { points: [] };
  }
  if (!quizData.luxuryDefaultsSection.points) {
    quizData.luxuryDefaultsSection.points = [];
  }
  const newNumber = quizData.luxuryDefaultsSection.points.length + 1;
  quizData.luxuryDefaultsSection.points.push({
    title: `${newNumber}. New Point`,
    description: 'Enter point description here...',
  });
  renderLuxuryDefaultsPoints();
  showStatus('Point added', 'success');
}

function updateLuxuryDefaultsPoint(index, field, value) {
  quizData.luxuryDefaultsSection.points[index][field] = value;
  showStatus('Point updated', 'success');
}

function removeLuxuryDefaultsPoint(index) {
  quizData.luxuryDefaultsSection.points.splice(index, 1);
  // Renumber remaining points
  quizData.luxuryDefaultsSection.points.forEach((point, i) => {
    const match = point.title.match(/^\d+\.\s(.+)/);
    if (match) {
      point.title = `${i + 1}. ${match[1]}`;
    }
  });
  renderLuxuryDefaultsPoints();
  showStatus('Point removed', 'success');
}

function renderQuestions() {
  // Update banner section UI
  const bannerMainHeading = document.getElementById('bannerMainHeading');
  if (bannerMainHeading && quizData.bannerSection) {
    bannerMainHeading.value =
      quizData.bannerSection.mainHeading ||
      'Match Your Personality To A Luxury Default.';
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
      'The largest luxury default showroom in London';

    const showroomImage = document.getElementById('showroom-image');
    if (showroomImage && quizData.showroomSection.image) {
      showroomImage.style.backgroundImage = `url('${quizData.showroomSection.image}')`;
      showroomImage.innerHTML =
        '<div class="upload-text">📷 Click to change showroom image</div>';
    }
  }

  // Update Luxury Defaults section UI
  if (quizData.luxuryDefaultsSection) {
    const luxuryDefaultsTitle = document.getElementById('luxuryDefaultsTitle');
    if (luxuryDefaultsTitle) {
      luxuryDefaultsTitle.value =
        quizData.luxuryDefaultsSection.title || 'Luxury Defaults, Redefined';
    }

    const luxuryDefaultsIntro = document.getElementById('luxuryDefaultsIntro');
    if (luxuryDefaultsIntro) {
      luxuryDefaultsIntro.value = quizData.luxuryDefaultsSection.introduction || '';
    }

    const luxuryDefaultsSubtitle = document.getElementById('luxuryDefaultsSubtitle');
    if (luxuryDefaultsSubtitle) {
      luxuryDefaultsSubtitle.value =
        quizData.luxuryDefaultsSection.subtitle || 'Why Visit Our Showroom?';
    }

    const luxuryDefaultsConclusion = document.getElementById(
      'luxuryDefaultsConclusion'
    );
    if (luxuryDefaultsConclusion) {
      luxuryDefaultsConclusion.value =
        quizData.luxuryDefaultsSection.conclusion || '';
    }

    renderLuxuryDefaultsPoints();
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
      quizData.quizPromoSection.heading ||
      'Take our lifestyle quiz & find the perfect default match.';
    document.getElementById('quizPromoButtonText').value =
      quizData.quizPromoSection.buttonText || 'Try our Default Matching Quiz';
    document.getElementById('quizPromoButtonLink').value =
      quizData.quizPromoSection.buttonLink || '#productquiz';
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

// Gallery Section Functions
function renderGalleryItems() {
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

    // Also populate the title, subtitle, and link inputs
    const titleInput = document.getElementById(`gallery-title-${index}`);
    const subtitleInput = document.getElementById(`gallery-subtitle-${index}`);
    const linkInput = document.getElementById(`gallery-link-${index}`);

    if (titleInput) titleInput.value = item.title || '';
    if (subtitleInput) subtitleInput.value = item.subtitle || '';
    if (linkInput) linkInput.value = item.link || '';
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

function saveQuiz() {
  // Check if we're working with a custom product quiz
  if (window.currentProductKey && window.currentProductKey !== 'default') {
    // TODO: Save to database instead of localStorage
    // const productQuizzes = JSON.parse(localStorage.getItem('productQuizzes') || '{}');
    console.log('TODO: Save product quiz to database');
    if (productQuizzes[window.currentProductKey]) {
      // Update the existing product quiz
      productQuizzes[window.currentProductKey].questions = quizData.questions;

      // Update other sections (using correct field IDs)
      const bannerMainHeading = document.getElementById('bannerMainHeading');
      const bannerSubHeading = document.getElementById('bannerSubHeading');
      if (bannerMainHeading)
        productQuizzes[window.currentProductKey].bannerContent.mainHeading =
          bannerMainHeading.value;
      if (bannerSubHeading)
        productQuizzes[window.currentProductKey].bannerContent.subHeading =
          bannerSubHeading.value;

      const showroomHeading = document.getElementById('showroomHeading');
      if (showroomHeading)
        productQuizzes[window.currentProductKey].showroomContent.heading =
          showroomHeading.value;

      const designDisasterHeading = document.getElementById(
        'designDisasterHeading'
      );
      const designDisasterButtonText = document.getElementById(
        'designDisasterButtonText'
      );
      const designDisasterButtonLink = document.getElementById(
        'designDisasterButtonLink'
      );
      if (designDisasterHeading)
        productQuizzes[window.currentProductKey].designExpertContent.heading =
          designDisasterHeading.value;
      if (designDisasterButtonText)
        productQuizzes[
          window.currentProductKey
        ].designExpertContent.buttonText = designDisasterButtonText.value;
      if (designDisasterButtonLink)
        productQuizzes[
          window.currentProductKey
        ].designExpertContent.buttonLink = designDisasterButtonLink.value;

      const quizPromoHeading = document.getElementById('quizPromoHeading');
      const quizPromoButtonText = document.getElementById(
        'quizPromoButtonText'
      );
      const quizPromoButtonLink = document.getElementById(
        'quizPromoButtonLink'
      );
      if (quizPromoHeading)
        productQuizzes[window.currentProductKey].quizPromoContent.heading =
          quizPromoHeading.value;
      if (quizPromoButtonText)
        productQuizzes[window.currentProductKey].quizPromoContent.buttonText =
          quizPromoButtonText.value;
      if (quizPromoButtonLink)
        productQuizzes[window.currentProductKey].quizPromoContent.buttonLink =
          quizPromoButtonLink.value;

      // Also update luxuryDefaultsSection data if it exists in quizData
      if (quizData.luxuryDefaultsSection) {
        productQuizzes[window.currentProductKey].luxuryDefaultsSection =
          quizData.luxuryDefaultsSection;
      }
      if (quizData.gallerySection) {
        productQuizzes[window.currentProductKey].gallerySection =
          quizData.gallerySection;
      }
      if (quizData.designDisasterSection) {
        productQuizzes[window.currentProductKey].designDisasterSection =
          quizData.designDisasterSection;
      }
      if (quizData.quizPromoSection) {
        productQuizzes[window.currentProductKey].quizPromoSection =
          quizData.quizPromoSection;
      }

      // TODO: Save updated data to database
      // localStorage.setItem('productQuizzes', JSON.stringify(productQuizzes));
      showStatus(
        `Product quiz saved successfully! (Database integration pending)`,
        'success'
      );
    }
  } else {
    // TODO: Save default quiz to database
    // localStorage.setItem('defaultQuizData', JSON.stringify(quizData));
    showStatus(
      'Default quiz saved successfully! (Database integration pending)',
      'success'
    );
  }

  // Generate JavaScript code for the quiz
  generateQuizCode();
}

function loadCurrentQuiz() {
  // TODO: Load from database instead of localStorage
  const savedData = null; // localStorage.getItem('defaultQuizData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    // Ensure all sections exist
    if (!parsedData.bannerSection) {
      parsedData.bannerSection = {
        mainHeading: 'Match Your Personality To A Luxury Product.',
        subHeading: 'Try Our AI Tool',
        backgroundImage:
          '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/gallotti-and-radice-banner-1.jpg',
        mobileImage:
          '../cdn-cgi/image/quality=60,f=auto/site-assets/images/luxury/luxury-banner-1-mobile.jpg',
      };
    }
    if (!parsedData.showroomSection) {
      parsedData.showroomSection = {
        heading: 'The largest luxury default showroom in London',
        image: '../cdn-cgi/image/quality=75,f=auto/site-assets/shoroomlndn.jpg',
      };
    }
    if (!parsedData.luxuryDefaultsSection) {
      parsedData.luxuryDefaultsSection = {
        title: 'Luxury Defaults, Redefined',
        introduction:
          "A product is never just a product. It's where you unwind after a long day, host spirited conversations, and perhaps—if it's truly exquisite—fall hopelessly in love with your own living room. At FCI London, we don't just sell products; we curate spaces of sophistication, tailored to those who appreciate life's finer details.",
        subtitle: 'Why Visit Our Showroom?',
        points: [],
        conclusion:
          '<strong>Visit Us & Experience Luxury Firsthand</strong><br>Indulgence begins with a single step—or rather, a single seat. Visit our London showroom to immerse yourself in a world of impeccable design and let us help you find the default you never knew you needed.',
      };
    }
    if (!parsedData.gallerySection) {
      parsedData.gallerySection = {
        images: [
          {
            src: '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/lpluxury-funiture-03.jpg',
            alt: 'Luxury sectional default in modern living room',
          },
          {
            src: '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-defaults-8.jpg',
            alt: 'Elegant leather luxury default',
          },
          {
            src: '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/lpluxury-funiture-05.jpg',
            alt: 'Designer fabric luxury default',
          },
          {
            src: '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/lpluxury-funiture-05.jpg',
            alt: 'Designer fabric luxury default',
          },
        ],
      };
    }
    if (!parsedData.designDisasterSection) {
      parsedData.designDisasterSection = {
        heading: 'Avoid a design disaster.\nTalk to an expert.',
        image:
          '../cdn-cgi/image/quality=75,f=auto/site-assets/images/avoid-a-design-disaster.jpg',
        buttonText: 'Book now',
        buttonLink: '/book-a-showroom-visit.html',
      };
    }
    if (!parsedData.quizPromoSection) {
      parsedData.quizPromoSection = {
        heading: 'Take our lifestyle quiz & find the perfect default match.',
        features: [
          'AI Matching algorithm',
          'Searches over 2000 Luxury Defaults',
          'Results Within 10 Minutes',
          'Only Branded Italian Design',
          'Exclusive Branded Italian Designs',
          'Free Consultation Available',
        ],
        buttonText: 'Try our Default Matching Quiz',
        buttonLink: '#productquiz',
        images: [],
      };
    }
    quizData = parsedData;
    renderQuestions();
    showStatus('Quiz loaded from saved data', 'success');
  } else {
    initializeSampleData();
    showStatus('Loaded sample quiz data', 'success');
  }
}

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

// New Product Quiz Management Functions
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

function createNewProductQuiz() {
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

  // TODO: Get existing product quizzes from database
  let productQuizzes = {}; // JSON.parse(localStorage.getItem('productQuizzes') || '{}');

  // Check if product already exists
  if (productQuizzes[productKey]) {
    alert('A quiz for this product already exists');
    return;
  }

  // Create new product quiz with default structure
  productQuizzes[productKey] = {
    name: productName,
    emoji: productEmoji || '📦',
    description: productDescription,
    created: new Date().toISOString(),
    bannerContent: {
      mainHeading: `Match Your Personality To A Luxury ${productName}.`,
      subHeading: 'Try Our AI Tool',
      desktopImage: '',
      mobileImage: '',
    },
    showroomContent: {
      heading: `The largest luxury ${productName.toLowerCase()} showroom in London`,
      image: '',
    },
    galleryContent: {
      images: [
        {
          image: '',
          description: `Luxury ${productName.toLowerCase()} in modern setting`,
        },
        {
          image: '',
          description: `Elegant ${productName.toLowerCase()} design`,
        },
        {
          image: '',
          description: `Designer ${productName.toLowerCase()} collection`,
        },
        {
          image: '',
          description: `Designer ${productName.toLowerCase()} collection`,
        },
      ],
    },
    designExpertContent: {
      heading: 'Avoid a design disaster.\\nTalk to an expert.',
      buttonText: 'Book now',
      buttonLink: '/book-a-showroom-visit.html',
      image: '',
    },
    quizPromoContent: {
      heading: `Take our lifestyle quiz & find the perfect ${productName.toLowerCase()} match.`,
      features: [
        'AI Matching algorithm',
        `Searches over 2000 Luxury ${productName}`,
        'Results Within 10 Minutes',
        'Only Branded Italian Design',
        'Exclusive Branded Italian Designs',
        'Free Consultation Available',
      ],
      buttonText: `Try our ${productName} Matching Quiz`,
      buttonLink: '#quiz',
      sliderImages: Array(8).fill(''),
    },
    questions: [
      {
        id: 1,
        text: `What best describes your needs for ${productName.toLowerCase()}?`,
        options: [
          { id: 'a', text: 'Option A', image: '' },
          { id: 'b', text: 'Option B', image: '' },
          { id: 'c', text: 'Option C', image: '' },
        ],
      },
    ],
  };

  // TODO: Save to database instead of localStorage
  // localStorage.setItem('productQuizzes', JSON.stringify(productQuizzes));
  console.log('TODO: Save new product quiz to database');

  // Update the selector dropdown
  updateProductQuizSelector();

  // Switch to the new quiz
  switchProductQuiz(productKey);

  // Close modal and show success message
  closeNewProductModal();
  showStatus(`${productName} quiz created successfully!`, 'success');
}

function updateProductQuizSelector() {
  const selector = document.getElementById('productQuizSelector');
  // TODO: Load from database
  const productQuizzes = {}; // JSON.parse(localStorage.getItem('productQuizzes') || '{}');

  // Clear existing options except the first one (Default)
  while (selector.children.length > 1) {
    selector.removeChild(selector.lastChild);
  }

  // Add options for each product quiz
  Object.keys(productQuizzes).forEach((key) => {
    const product = productQuizzes[key];
    const option = document.createElement('option');
    option.value = key;
    option.textContent = `${product.emoji} ${product.name} Quiz`;
    selector.appendChild(option);
  });
}

function switchProductQuiz(productKey) {
  // TODO: Load from database
  const productQuizzes = {}; // JSON.parse(localStorage.getItem('productQuizzes') || '{}');

  // TODO: Set current product in database/session
  // localStorage.setItem('currentProduct', productKey);
  console.log('TODO: Set current product in database:', productKey);

  if (productKey === 'default') {
    // Switch to original default quiz
    document.getElementById('dashboardTitle').textContent =
      'Default Quiz Content Management Dashboard';
    loadCurrentQuiz(); // Load the original default quiz data
    return;
  }

  if (!productQuizzes[productKey]) {
    alert('Product quiz not found');
    return;
  }

  const product = productQuizzes[productKey];

  // Update dashboard title
  document.getElementById(
    'dashboardTitle'
  ).textContent = `${product.emoji} ${product.name} Quiz Content Management Dashboard`;

  // Load the product's quiz data
  loadProductQuizData(productKey, product);
}

function loadProductQuizData(productKey, product) {
  // Update all form fields with the product's data

  // Banner section
  const bannerMainHeading = document.getElementById('bannerMainHeading');
  const bannerSubHeading = document.getElementById('bannerSubHeading');
  if (bannerMainHeading)
    bannerMainHeading.value = product.bannerContent.mainHeading;
  if (bannerSubHeading)
    bannerSubHeading.value = product.bannerContent.subHeading;

  // Showroom section
  const showroomHeading = document.getElementById('showroomHeading');
  if (showroomHeading) showroomHeading.value = product.showroomContent.heading;

  // Design Expert section (correct IDs)
  const designDisasterHeading = document.getElementById(
    'designDisasterHeading'
  );
  const designDisasterButtonText = document.getElementById(
    'designDisasterButtonText'
  );
  const designDisasterButtonLink = document.getElementById(
    'designDisasterButtonLink'
  );
  if (designDisasterHeading)
    designDisasterHeading.value = product.designExpertContent.heading;
  if (designDisasterButtonText)
    designDisasterButtonText.value = product.designExpertContent.buttonText;
  if (designDisasterButtonLink)
    designDisasterButtonLink.value = product.designExpertContent.buttonLink;

  // Quiz Promo section
  const quizPromoHeading = document.getElementById('quizPromoHeading');
  const quizPromoButtonText = document.getElementById('quizPromoButtonText');
  const quizPromoButtonLink = document.getElementById('quizPromoButtonLink');
  if (quizPromoHeading)
    quizPromoHeading.value = product.quizPromoContent.heading;
  if (quizPromoButtonText)
    quizPromoButtonText.value = product.quizPromoContent.buttonText;
  if (quizPromoButtonLink)
    quizPromoButtonLink.value = product.quizPromoContent.buttonLink;

  // Load features (will need to implement this if it doesn't exist)
  if (typeof loadFeatures === 'function') {
    loadFeatures(product.quizPromoContent.features);
  }

  // Load questions
  quizData.questions = product.questions;
  renderQuestions();

  // Store current product key for saving
  window.currentProductKey = productKey;
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

  // Add Luxury Defaults section preview
  if (quizData.luxuryDefaultsSection) {
    html += `
            <div style="margin-bottom: 40px; padding: 20px; background: #f0e6ff; border-radius: 8px;">
                <h2 style="color: #6b46c1; text-align: center; margin-bottom: 20px;">${quizData.luxuryDefaultsSection.title}</h2>
                <p style="margin-bottom: 20px;">${quizData.luxuryDefaultsSection.introduction}</p>
                <h3 style="color: #6b46c1; margin-bottom: 15px;">${quizData.luxuryDefaultsSection.subtitle}</h3>
        `;

    if (quizData.luxuryDefaultsSection.points) {
      quizData.luxuryDefaultsSection.points.forEach((point) => {
        html += `
                    <div style="margin-bottom: 15px;">
                        <strong>${point.title}</strong><br>
                        ${point.description}
                    </div>
                `;
      });
    }

    html += `
                <div style="margin-top: 20px;">${quizData.luxuryDefaultsSection.conclusion}</div>
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
  console.log('questions:', JSON.stringify(quizData.questions, null, 2));
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
  loadCurrentQuiz();
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

// Initialize the dashboard on page load
document.addEventListener('DOMContentLoaded', function () {
  // Load existing product quizzes
  updateProductQuizSelector();

  // Check if there's a current product set, otherwise default to default
  // TODO: Get current product from database/session
  const currentProduct = 'default'; // localStorage.getItem('currentProduct') || 'default';

  // Set the selector to the current product
  const selector = document.getElementById('productQuizSelector');
  if (selector) {
    selector.value = currentProduct;
  }

  // Load the appropriate quiz data
  if (currentProduct === 'default') {
    loadCurrentQuiz();
  } else {
    switchProductQuiz(currentProduct);
  }
});
