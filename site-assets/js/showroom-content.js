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

  // Function to generate placeholder image URL
  function getPlaceholderImage(width, height, text = 'No Image') {
    return `https://placehold.co/${width}x${height}/e5e5e5/666666?text=${encodeURIComponent(
      text
    )}`;
  }

  // Function to check if image source is valid and not empty
  function isValidImageSource(src) {
    return src && src.trim() !== '' && !src.includes('placeholder');
  }

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
  async function getCurrentProductData() {
    try {
      // Get current product from API
      const currentProduct = await window.apiClient.getCurrentProduct();
      if (!currentProduct || currentProduct === 'sofa') {
        return null; // Use default content for sofa
      }

      // Get product content data
      const productData = await window.apiClient.getContent(currentProduct);
      return { productData, productKey: currentProduct };
    } catch (error) {
      console.warn('[Content] Could not get current product data:', error);
      return null;
    }
  }

  // Function to convert product quiz format to expected format
  function convertProductDataFormat(productData, productKey) {
    if (!productData || productKey === 'sofa') {
      return productData; // Return as-is for sofa or null data
    }

    // Check if data is in the new API format (direct content sections)
    if (productData.banner || productData.showroom || productData.quiz_promo) {
      return {
        bannerSection: {
          mainHeading:
            productData.banner?.mainHeading ||
            `Match Your Personality To A Luxury ${productKey}.`,
          subHeading: productData.banner?.subHeading || 'Try Our AI Tool',
          backgroundImage: productData.banner?.backgroundImage || '',
          mobileImage: productData.banner?.mobileImage || '',
        },
        showroomSection: {
          heading:
            productData.showroom?.heading ||
            `The largest luxury ${productKey?.toLowerCase()} showroom in London`,
          image: productData.showroom?.image || '',
        },
        luxurySofasSection: {
          title:
            productData.luxury_content?.title ||
            `Luxury ${productKey}, Redefined`,
          introduction:
            productData.luxury_content?.introduction ||
            `Experience the finest ${productKey?.toLowerCase()} collection.`,
          subtitle:
            productData.luxury_content?.subtitle || 'Why Visit Our Showroom?',
          points: productData.luxury_content?.points || [],
          conclusion:
            productData.luxury_content?.conclusion ||
            '<strong>Visit Us & Experience Luxury Firsthand</strong>',
        },
        gallerySection: {
          images:
            productData.gallery?.images?.map((img) => ({
              src: img.src || img.image || '',
              alt:
                img.alt ||
                img.description ||
                `Luxury ${productKey?.toLowerCase()}`,
            })) || [],
        },
        designDisasterSection: {
          heading:
            productData.design_expert?.heading?.replace('\\n', '\n') ||
            'Avoid a design disaster.\nTalk to an expert.',
          image: productData.design_expert?.image || '',
          buttonText: productData.design_expert?.buttonText || 'Book now',
          buttonLink:
            productData.design_expert?.buttonLink ||
            '/book-a-showroom-visit.html',
        },
        quizPromoSection: {
          heading:
            productData.quiz_promo?.heading ||
            `Take our lifestyle quiz & find the perfect ${
              productKey?.toLowerCase() || 'sofa'
            } match.`,
          features: productData.quiz_promo?.features || [],
          buttonText:
            productData.quiz_promo?.buttonText ||
            `Try our ${productKey || 'Sofa'} Matching Quiz`,
          buttonLink: productData.quiz_promo?.buttonLink || '#quiz',
          images:
            productData.quiz_promo?.images ||
            productData.quiz_promo?.sliderImages ||
            [],
        },
      };
    }

    // Fallback to old format (productData format)
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
          `Take our lifestyle quiz & find the perfect ${
            productData.name?.toLowerCase() || 'sofa'
          } match.`,
        features: productData.quizPromoContent?.features || [],
        buttonText:
          productData.quizPromoContent?.buttonText ||
          `Try our ${productData.name || 'Sofa'} Matching Quiz`,
        buttonLink: productData.quizPromoContent?.buttonLink || '#quiz',
        images: productData.quizPromoContent?.sliderImages || [],
      },
    };
  }

  // Function to load and update banner section
  async function loadBannerSection() {
    try {
      const result = await getCurrentProductData();
      const rawData = result?.productData;
      const currentProduct = result?.productKey || 'sofa';
      const data = convertProductDataFormat(rawData, currentProduct);

      // Always update banner images, use placeholders if no data
      const bannerSection = document.querySelector('.banner-block');
      if (bannerSection) {
        // Update main heading if data exists
        if (data && data.bannerSection) {
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
        }

        // Always update background images with placeholder fallback
        const picture = bannerSection.querySelector('picture');
        if (picture) {
          // Update mobile image source
          const source = picture.querySelector('source');
          if (source) {
            const mobileImage =
              data &&
              data.bannerSection &&
              isValidImageSource(data.bannerSection.mobileImage)
                ? data.bannerSection.mobileImage
                : getPlaceholderImage(
                    IMAGE_SIZES.banner.mobile.width,
                    IMAGE_SIZES.banner.mobile.height,
                    'Mobile Banner'
                  );
            source.srcset = mobileImage;
          }

          // Update desktop image with sizing
          const img = picture.querySelector('img.banner-img');
          if (img) {
            const desktopImage =
              data &&
              data.bannerSection &&
              isValidImageSource(data.bannerSection.backgroundImage)
                ? data.bannerSection.backgroundImage
                : getPlaceholderImage(
                    IMAGE_SIZES.banner.desktop.width,
                    IMAGE_SIZES.banner.desktop.height,
                    'Hero Banner'
                  );
            img.srcset = desktopImage;
            img.src = desktopImage;
            applyImageSizing(img, IMAGE_SIZES.banner.desktop);
          }
        }
      }

      console.log('[Banner] Section updated from saved data');
    } catch (error) {
      console.error('[Banner] Error loading section:', error);
    }
  }

  // Function to load and update showroom section
  async function loadShowroomSection() {
    try {
      const result = await getCurrentProductData();
      const rawData = result?.productData;
      const currentProduct = result?.productKey || 'sofa';
      const data = convertProductDataFormat(rawData, currentProduct);

      // Update showroom heading if data exists
      if (data && data.showroomSection) {
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
      }

      // Always update showroom image with placeholder fallback
      const showroomImage = document.getElementById('showroomSectionImage');
      if (showroomImage) {
        const imageSource =
          data &&
          data.showroomSection &&
          isValidImageSource(data.showroomSection.image)
            ? data.showroomSection.image
            : getPlaceholderImage(
                IMAGE_SIZES.showroom.width,
                IMAGE_SIZES.showroom.height,
                'Showroom'
              );
        const altText =
          data && data.showroomSection && data.showroomSection.heading
            ? data.showroomSection.heading
            : 'Luxury Showroom';
        showroomImage.src = imageSource;
        showroomImage.alt = altText;
        showroomImage.title = altText;
        applyImageSizing(showroomImage, IMAGE_SIZES.showroom);
      } else {
        // Fallback to finding images by attributes
        const showroomImages = document.querySelectorAll(
          'img[alt*="showroom"], img[src*="shoroomlndn"]'
        );
        showroomImages.forEach((img) => {
          const imageSource =
            data &&
            data.showroomSection &&
            isValidImageSource(data.showroomSection.image)
              ? data.showroomSection.image
              : getPlaceholderImage(
                  IMAGE_SIZES.showroom.width,
                  IMAGE_SIZES.showroom.height,
                  'Showroom'
                );
          const altText =
            data && data.showroomSection && data.showroomSection.heading
              ? data.showroomSection.heading
              : 'Luxury Showroom';
          img.src = imageSource;
          img.alt = altText;
          img.title = altText;
          applyImageSizing(img, IMAGE_SIZES.showroom);
        });
      }

      console.log('[Showroom] Section updated from saved data');
    } catch (error) {
      console.error('[Showroom] Error loading section:', error);
    }
  }

  // Function to load and update Luxury Sofas Content Section
  async function loadLuxurySofasSection() {
    try {
      const result = await getCurrentProductData();
      const rawData = result?.productData;
      const currentProduct = result?.productKey || 'sofa';
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
  async function loadGallerySection() {
    try {
      const data = await getCurrentProductData();

      if (data && data.gallery && data.gallery.images) {
        // Find the gallery section container
        const gallerySection = document.querySelector('section.container.big');

        if (gallerySection) {
          // Find images in the gallery section
          const galleryImages = gallerySection.querySelectorAll('img');

          // Update each image with consistent sizing
          galleryImages.forEach((img, index) => {
            if (data.gallery.images[index]) {
              const imageData = data.gallery.images[index];
              img.src = imageData.src;
              img.alt = imageData.alt;
              img.title = imageData.alt;
            }
          });

          // Update gallery titles and subtitles
          data.gallery.images.forEach((imageData, index) => {
            // Update title element
            const titleElement = document.getElementById(`gallery-title-${index}`);
            if (titleElement && imageData.title) {
              titleElement.textContent = imageData.title;
            }

            // Update subtitle element
            const subtitleElement = document.getElementById(`gallery-subtitle-${index}`);
            if (subtitleElement && imageData.subtitle) {
              subtitleElement.textContent = imageData.subtitle;
            }

            // Update link element
            const linkElement = document.getElementById(`gallery-link-${index}-btn`);
            if (linkElement && imageData.link) {
              linkElement.href = imageData.link;
            }
          });
        }
      }
    } catch (error) {
      console.error('[Gallery] Error loading section:', error);
    }
  }

  // Function to load and update Design Disaster section
  async function loadDesignExpertSection() {
    try {
      const data = await getCurrentProductData();

      if (!data?.design_expert) return;

      // Find the design expert section
      const designSection = [...document.querySelectorAll('section')].find(
        (section) =>
          section.innerHTML.includes('Avoid a design disaster') ||
          section.innerHTML.includes('avoid-a-design-disaster')
      );

      if (!designSection) return;

      const { heading, image, buttonLink, buttonText } = data.design_expert;

      // Update heading (convert \n to <br>)
      const headingEl = designSection.querySelector('h2.thick-h1');
      if (headingEl && heading) {
        headingEl.innerHTML = heading.replace(/\n/g, '<br>');
      }

      // Update image with sizing (use placeholder if missing)
      const imageEl = designSection.querySelector(
        'img[src*="avoid-a-design-disaster"]'
      );
      if (imageEl) {
        const { width, height } = IMAGE_SIZES.designDisaster;
        const src =
          image || getPlaceholderImage(width, height, 'Design Expert');
        imageEl.src = src;
        imageEl.alt = 'Interior designer offering fabric choices to a client';
        applyImageSizing(imageEl, IMAGE_SIZES.designDisaster);
      }

      // Update button
      const button = designSection.querySelector('a.btn');
      if (button) {
        if (buttonLink) button.href = buttonLink;
        if (buttonText) {
          button.innerHTML = `${buttonText} <i class="fa-solid fa-circle-chevron-right fa-lg" style="color: #000000;"></i>`;
        }
      }

      console.log('[DesignExpert] Section updated from data source');
    } catch (error) {
      console.error('[DesignExpert] Error loading section:', error);
    }
  }

  // Function to load and update Quiz Promo section
  async function loadQuizPromoSection() {
    try {
      const data = await getCurrentProductData();

      if (data && data.quiz_promo) {
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
            heading.textContent = data.quiz_promo.heading;
          }

          // Update features list
          const featuresList = promoSection.querySelector('ul.block-text');
          if (featuresList && data.quiz_promo.features) {
            featuresList.innerHTML = data.quiz_promo.features
              .map((feature) => `<li><strong>${feature}</strong></li>`)
              .join('');
          }

          // Update button
          const button = promoSection.querySelector('a.btn[href*="sofaquiz"]');
          if (button) {
            button.href = data.quiz_promo.buttonLink;
            button.innerHTML = `${data.quiz_promo.buttonText} <i class="fa-solid fa-circle-chevron-right fa-lg" style="color: #000000;"></i>`;
          }

          // Update slider images with consistent sizing
          const slider = promoSection.querySelector('#wardrobes-slider');
          if (
            slider &&
            data.quiz_promo.images &&
            data.quiz_promo.images.length > 0
          ) {
            slider.innerHTML = data.quiz_promo.images
              .map(
                (image, index) => `
                  <li>
                    <img alt="Luxury product ${index + 1}"
                         title="Luxury product ${index + 1}"
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

        console.log('[QuizPromo] Section updated from data source');
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

  // Function to set default placeholders for all images
  function setDefaultPlaceholders() {
    try {
      // Set banner placeholders
      const bannerImg = document.querySelector('img.banner-img');
      if (bannerImg && !isValidImageSource(bannerImg.src)) {
        bannerImg.src = getPlaceholderImage(
          IMAGE_SIZES.banner.desktop.width,
          IMAGE_SIZES.banner.desktop.height,
          'Hero Banner'
        );
      }

      // Set showroom placeholder
      const showroomImg = document.getElementById('showroomSectionImage');
      if (showroomImg && !isValidImageSource(showroomImg.src)) {
        showroomImg.src = getPlaceholderImage(
          IMAGE_SIZES.showroom.width,
          IMAGE_SIZES.showroom.height,
          'Showroom'
        );
      }

      // Set gallery placeholders for the three specific images in gallery section
      const gallerySection = document.querySelector('section.container.big');
      if (gallerySection) {
        const galleryImages = gallerySection.querySelectorAll('img');
        galleryImages.forEach((img, index) => {
          if (!isValidImageSource(img.src)) {
            img.src = getPlaceholderImage(
              IMAGE_SIZES.gallery.width,
              IMAGE_SIZES.gallery.height,
              `Gallery ${index + 1}`
            );
            img.alt = `Gallery Image ${index + 1}`;
            img.title = `Gallery Image ${index + 1}`;
          }
        });
      }

      // Set design disaster placeholder
      const designImg = document.querySelector(
        'img[src*="avoid-a-design-disaster"]'
      );
      if (designImg && !isValidImageSource(designImg.src)) {
        designImg.src = getPlaceholderImage(
          IMAGE_SIZES.designDisaster.width,
          IMAGE_SIZES.designDisaster.height,
          'Expert CTA'
        );
      }

      console.log('[Placeholders] Default placeholders set for missing images');
    } catch (error) {
      console.error(
        '[Placeholders] Error setting default placeholders:',
        error
      );
    }
  }

  // Function to load all dynamic content
  async function loadDynamicContent() {
    addImageConsistencyStyles();

    // Set default placeholders first
    setDefaultPlaceholders();

    // Then load dynamic content (which may override placeholders)
    await loadBannerSection();
    await loadShowroomSection();
    await loadLuxurySofasSection(); // Load the new Luxury Sofas section
    await loadGallerySection();
    await loadDesignExpertSection();
    await loadQuizPromoSection();
  }

  // Load on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      // Wait for API client to be ready
      if (typeof window.apiClient !== 'undefined') {
        loadDynamicContent();
      } else {
        setTimeout(loadDynamicContent, 100);
      }
    });
  } else {
    // Wait for API client to be ready
    if (typeof window.apiClient !== 'undefined') {
      loadDynamicContent();
    } else {
      setTimeout(loadDynamicContent, 100);
    }
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

  // Listen for custom product change events
  window.addEventListener('productChanged', function (e) {
    console.log('[Dynamic Content] Product changed event received:', e.detail);
    loadDynamicContent();
  });
})();
