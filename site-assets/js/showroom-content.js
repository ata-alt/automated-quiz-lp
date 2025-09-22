// Add this script to your index.html file before the closing </body> tag
// It will dynamically update all managed sections based on saved dashboard data

(function () {
  'use strict';

  // Image size configurations for each section
  const IMAGE_SIZES = {
    banner: {
      desktop: { width: 2000, height: 866 },
      mobile: { width: 500, height: 660 },
    },
    showroom: { width: 1110, height: 500 },
    gallery: { width: 952, height: 517 },
    designDisaster: { width: 433, height: 308 },
    quizPromo: { width: 800, height: 560 },
  };

  // Helper function to apply consistent image sizing
  function applyImageSizing(img, dimensions) {
    img.style.width = '100%';
    img.style.height = dimensions.height + 'px';
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'center';
    img.setAttribute('width', dimensions.width);
    img.setAttribute('height', dimensions.height);
  }

  // Function to get current product data from database
  function getCurrentProductData() {
    // TODO: Replace with database API call
    // For now returning null until database integration is complete
    // const currentProduct = 'sofa'; // This would come from database/API
    return null;
  }

  // Function to convert product quiz format to expected format
  function convertProductDataFormat(productData, productKey) {
    if (!productData || productKey === 'sofa') {
      return productData; // Return as-is for sofa or null data
    }

    // Convert product quiz format to the format expected by the existing functions
    return {
      bannerSection: {
        mainHeading:
          productData.bannerContent?.mainHeading ||
          `Match Your Personality To A Luxury ${productData.name}.`,
        subHeading: productData.bannerContent?.subHeading || 'Try Our AI Tool',
        backgroundImage: productData.bannerContent?.desktopImage || '',
        mobileImage: productData.bannerContent?.mobileImage || '',
      },
      showroomSection: {
        heading:
          productData.showroomContent?.heading ||
          `The largest luxury ${productData.name?.toLowerCase()} showroom in London`,
        image: productData.showroomContent?.image || '',
      },
      luxurySofasSection: {
        title:
          productData.luxurySofasSection?.title ||
          `Luxury ${productData.name}, Redefined`,
        introduction:
          productData.luxurySofasSection?.introduction ||
          `Experience the finest ${productData.name?.toLowerCase()} collection.`,
        subtitle:
          productData.luxurySofasSection?.subtitle || 'Why Visit Our Showroom?',
        points: productData.luxurySofasSection?.points || [],
        conclusion:
          productData.luxurySofasSection?.conclusion ||
          '<strong>Visit Us & Experience Luxury Firsthand</strong>',
      },
      gallerySection: {
        images:
          productData.galleryContent?.images?.map((img) => ({
            src: img.image || '',
            alt: img.description || `Luxury ${productData.name?.toLowerCase()}`,
          })) || [],
      },
      designDisasterSection: {
        heading:
          productData.designExpertContent?.heading?.replace('\\n', '\n') ||
          'Avoid a design disaster.\nTalk to an expert.',
        image: productData.designExpertContent?.image || '',
        buttonText: productData.designExpertContent?.buttonText || 'Book now',
        buttonLink:
          productData.designExpertContent?.buttonLink ||
          '/book-a-showroom-visit.html',
      },
      quizPromoSection: {
        heading:
          productData.quizPromoContent?.heading ||
          `Take our lifestyle quiz & find the perfect ${productData.name?.toLowerCase()} match.`,
        features: productData.quizPromoContent?.features || [],
        buttonText:
          productData.quizPromoContent?.buttonText ||
          `Try our ${productData.name} Matching Quiz`,
        buttonLink: productData.quizPromoContent?.buttonLink || '#quiz',
        images: productData.quizPromoContent?.sliderImages || [],
      },
    };
  }

  // Function to load and update banner section
  function loadBannerSection() {
    try {
      const rawData = getCurrentProductData();
      const currentProduct = 'sofa'; // TODO: Get from database/API
      const data = convertProductDataFormat(rawData, currentProduct);

      if (data && data.bannerSection) {
        // Find the banner section
        const bannerSection = document.querySelector('.banner-block');

        if (bannerSection) {
          // Update main heading
          const mainHeading = bannerSection.querySelector(
            '.banner-heading.thick-h1'
          );
          if (mainHeading) {
            mainHeading.textContent = data.bannerSection.mainHeading;
          }

          // Update sub heading
          const subHeading = bannerSection.querySelector('p.banner-heading');
          if (subHeading) {
            subHeading.textContent = data.bannerSection.subHeading;
          }

          // Update background images
          if (
            data.bannerSection.backgroundImage ||
            data.bannerSection.mobileImage
          ) {
            const picture = bannerSection.querySelector('picture');
            if (picture) {
              // Update mobile image source
              if (data.bannerSection.mobileImage) {
                const source = picture.querySelector('source');
                if (source) {
                  source.srcset = data.bannerSection.mobileImage;
                }
              }

              // Update desktop image with sizing
              if (data.bannerSection.backgroundImage) {
                const img = picture.querySelector('img.banner-img');
                if (img) {
                  img.srcset = data.bannerSection.backgroundImage;
                  img.src = data.bannerSection.backgroundImage;
                  applyImageSizing(img, IMAGE_SIZES.banner.desktop);
                }
              }
            }
          }
        }

        console.log('[Banner] Section updated from saved data');
      }
    } catch (error) {
      console.error('[Banner] Error loading section:', error);
    }
  }

  // Function to load and update showroom section
  function loadShowroomSection() {
    try {
      const rawData = getCurrentProductData();
      const currentProduct = 'sofa'; // TODO: Get from database/API
      const data = convertProductDataFormat(rawData, currentProduct);

      if (data && data.showroomSection) {
        // Update showroom heading by ID first, then fallback to text search
        const showroomTitle = document.getElementById('showroomSectionTitle');
        if (showroomTitle) {
          showroomTitle.textContent = data.showroomSection.heading;
        } else {
          // Fallback to searching by text content
          const showroomHeadings = document.querySelectorAll('h2');
          showroomHeadings.forEach((heading) => {
            if (heading.textContent.includes('largest luxury sofa showroom')) {
              heading.textContent = data.showroomSection.heading;
            }
          });
        }

        // Update showroom image by ID first, then fallback
        const showroomImage = document.getElementById('showroomSectionImage');
        if (showroomImage && data.showroomSection.image) {
          showroomImage.src = data.showroomSection.image;
          showroomImage.alt = data.showroomSection.heading;
          showroomImage.title = data.showroomSection.heading;
          applyImageSizing(showroomImage, IMAGE_SIZES.showroom);
        } else {
          // Fallback to finding images by attributes
          const showroomImages = document.querySelectorAll(
            'img[alt*="showroom"], img[src*="shoroomlndn"]'
          );
          showroomImages.forEach((img) => {
            if (data.showroomSection.image) {
              img.src = data.showroomSection.image;
              img.alt = data.showroomSection.heading;
              img.title = data.showroomSection.heading;
              applyImageSizing(img, IMAGE_SIZES.showroom);
            }
          });
        }

        console.log('[Showroom] Section updated from saved data');
      }
    } catch (error) {
      console.error('[Showroom] Error loading section:', error);
    }
  }

  // Function to load and update Luxury Sofas Content Section
  function loadLuxurySofasSection() {
    try {
      const rawData = getCurrentProductData();
      const currentProduct = 'sofa'; // TODO: Get from database/API
      const data = convertProductDataFormat(rawData, currentProduct);

      if (data && data.luxurySofasSection) {
        // Update main title
        const mainTitle = document.getElementById('showroomMainTitle');
        if (mainTitle) {
          mainTitle.textContent = data.luxurySofasSection.title;
        } else {
          // Fallback for elements without ID
          const titles = document.querySelectorAll(
            'p.thick-h1.text-center.black'
          );
          titles.forEach((title) => {
            if (title.textContent.includes('Luxury Sofas')) {
              title.textContent = data.luxurySofasSection.title;
            }
          });
        }

        // Update introduction paragraph
        const introduction = document.getElementById('showroomIntroduction');
        if (introduction) {
          introduction.textContent = data.luxurySofasSection.introduction;
        }

        // Update subtitle
        const subtitle = document.getElementById('showroomWhyVisitTitle');
        if (subtitle) {
          subtitle.textContent = data.luxurySofasSection.subtitle;
        }

        // Update points
        const pointsContainer = document.getElementById('showroomPoints');
        if (pointsContainer && data.luxurySofasSection.points) {
          pointsContainer.innerHTML = data.luxurySofasSection.points
            .map(
              (point) =>
                `<p class="block-text"><strong>${point.title}</strong><br>${point.description}</p>`
            )
            .join('');
        }

        // Update conclusion
        const conclusion = document.getElementById('showroomConclusion');
        if (conclusion) {
          conclusion.innerHTML = data.luxurySofasSection.conclusion;
        }

        // If elements don't have IDs, try alternative approach
        if (!mainTitle || !introduction) {
          const contentDiv = document.getElementById('showroomContent');
          if (contentDiv && data.luxurySofasSection.points) {
            // Build the entire content structure
            let contentHTML = `
              <p class="block-text" id="showroomIntroduction">${data.luxurySofasSection.introduction}</p>
              <p class="block-text" id="showroomWhyVisitTitle">${data.luxurySofasSection.subtitle}</p>
              <div id="showroomPoints">
            `;

            data.luxurySofasSection.points.forEach((point) => {
              contentHTML += `<p class="block-text"><strong>${point.title}</strong><br>${point.description}</p>`;
            });

            contentHTML += `
              </div>
              <p class="block-text" id="showroomConclusion">${data.luxurySofasSection.conclusion}</p>
            `;

            contentDiv.innerHTML = contentHTML;
          }
        }

        console.log('[LuxurySofas] Section updated from saved data');
      }
    } catch (error) {
      console.error('[LuxurySofas] Error loading section:', error);
    }
  }

  // Function to load and update Gallery section (3 images)
  function loadGallerySection() {
    try {
      const rawData = getCurrentProductData();
      const currentProduct = 'sofa'; // TODO: Get from database/API
      const data = convertProductDataFormat(rawData, currentProduct);

      if (data && data.gallerySection && data.gallerySection.images) {
        // Find the gallery section container
        const gallerySection = document.querySelector('section.container.big');

        if (gallerySection) {
          // Find images in the gallery section
          const galleryImages = gallerySection.querySelectorAll('img');

          // Update each image with consistent sizing
          galleryImages.forEach((img, index) => {
            if (data.gallerySection.images[index]) {
              const imageData = data.gallerySection.images[index];
              img.src = imageData.src;
              img.alt = imageData.alt;
              img.title = imageData.alt;
            }
          });

          console.log('[Gallery] Section updated from saved data');
        }
      }
    } catch (error) {
      console.error('[Gallery] Error loading section:', error);
    }
  }

  // Function to load and update Design Disaster section
  function loadDesignDisasterSection() {
    try {
      const rawData = getCurrentProductData();
      const currentProduct = 'sofa'; // TODO: Get from database/API
      const data = convertProductDataFormat(rawData, currentProduct);

      if (data && data.designDisasterSection) {
        // Find the design disaster section
        const sections = document.querySelectorAll('section');
        let designSection = null;

        sections.forEach((section) => {
          if (
            section.innerHTML.includes('Avoid a design disaster') ||
            section.innerHTML.includes('avoid-a-design-disaster')
          ) {
            designSection = section;
          }
        });

        if (designSection) {
          // Update heading (convert \n to <br>)
          const heading = designSection.querySelector('h2.thick-h1');
          if (heading) {
            heading.innerHTML = data.designDisasterSection.heading.replace(
              /\n/g,
              '<br>'
            );
          }

          // Update image with sizing
          const image = designSection.querySelector(
            'img[src*="avoid-a-design-disaster"]'
          );
          if (image && data.designDisasterSection.image) {
            image.src = data.designDisasterSection.image;
            image.alt = 'Interior designer offering fabric choices to a client';
            applyImageSizing(image, IMAGE_SIZES.designDisaster);
          }

          // Update button
          const button = designSection.querySelector('a.btn');
          if (button) {
            button.href = data.designDisasterSection.buttonLink;
            button.innerHTML = `${data.designDisasterSection.buttonText} <i class="fa-solid fa-circle-chevron-right fa-lg" style="color: #000000;"></i>`;
          }
        }

        console.log('[DesignDisaster] Section updated from saved data');
      }
    } catch (error) {
      console.error('[DesignDisaster] Error loading section:', error);
    }
  }

  // Function to load and update Quiz Promo section
  function loadQuizPromoSection() {
    try {
      const rawData = getCurrentProductData();
      const currentProduct = 'sofa'; // TODO: Get from database/API
      const data = convertProductDataFormat(rawData, currentProduct);

      if (data && data.quizPromoSection) {
        // Find the quiz promo section
        const sections = document.querySelectorAll('section');
        let promoSection = null;

        sections.forEach((section) => {
          if (
            section.innerHTML.includes('Take our lifestyle quiz') ||
            section.innerHTML.includes('AI Matching algorithm')
          ) {
            promoSection = section;
          }
        });

        if (promoSection) {
          // Update heading
          const heading = promoSection.querySelector('.thick-h1');
          if (heading) {
            heading.textContent = data.quizPromoSection.heading;
          }

          // Update features list
          const featuresList = promoSection.querySelector('ul.block-text');
          if (featuresList && data.quizPromoSection.features) {
            featuresList.innerHTML = data.quizPromoSection.features
              .map((feature) => `<li><strong>${feature}</strong></li>`)
              .join('');
          }

          // Update button
          const button = promoSection.querySelector('a.btn[href*="sofaquiz"]');
          if (button) {
            button.href = data.quizPromoSection.buttonLink;
            button.innerHTML = `${data.quizPromoSection.buttonText} <i class="fa-solid fa-circle-chevron-right fa-lg" style="color: #000000;"></i>`;
          }

          // Update slider images with consistent sizing
          const slider = promoSection.querySelector('#wardrobes-slider');
          if (
            slider &&
            data.quizPromoSection.images &&
            data.quizPromoSection.images.length > 0
          ) {
            slider.innerHTML = data.quizPromoSection.images
              .map(
                (image, index) => `
                  <li>
                    <img alt="Luxury sofa ${index + 1}" 
                         title="Luxury sofa ${index + 1}" 
                         src="${image}" 
                         loading="lazy" 
                         width="${IMAGE_SIZES.quizPromo.width}" 
                         height="${IMAGE_SIZES.quizPromo.height}"
                         style="width: 100%; height: ${
                           IMAGE_SIZES.quizPromo.height
                         }px; object-fit: cover; object-position: center;">
                  </li>
                `
              )
              .join('');
          }
        }

        console.log('[QuizPromo] Section updated from saved data');
      }
    } catch (error) {
      console.error('[QuizPromo] Error loading section:', error);
    }
  }

  // Function to add global CSS for image consistency
  function addImageConsistencyStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Ensure consistent image display across all managed sections */
      .banner-block img.banner-img {
        width: 100%;
        height: auto;
        max-height: 866px;
        object-fit: cover;
      }

      #wardrobes-slider img {
        width: 100%;
        height: 560px;
        object-fit: cover;
      }
      
      @media (max-width: 640px) {
        .banner-block img.banner-img {
          max-height: 660px;
        }
        
        section.container.big img {
          height: 300px;
        }
        
        #wardrobes-slider img {
          height: 400px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Function to load all dynamic content
  function loadDynamicContent() {
    addImageConsistencyStyles();
    loadBannerSection();
    loadShowroomSection();
    loadLuxurySofasSection(); // Load the new Luxury Sofas section
    loadGallerySection();
    loadDesignDisasterSection();
    loadQuizPromoSection();
  }

  // Load on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDynamicContent);
  } else {
    loadDynamicContent();
  }

  // Listen for storage changes (live updates from admin dashboard)
  window.addEventListener('storage', function (e) {
    if (
      e.key === 'sofaQuizData' ||
      e.key === 'productQuizzes' ||
      e.key === 'currentProduct'
    ) {
      console.log(
        '[Dynamic Content] Detected data change, reloading sections...'
      );
      loadDynamicContent();
    }
  });
})();
