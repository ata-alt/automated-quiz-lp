// Showroom Content Loader with fallback support
// TODO: This file contains localStorage fallback functionality that should be removed
// once database integration is complete. This file is for backward compatibility only.

(function () {
  'use strict';

  // API client for communicating with backend (with fallback)
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
          this.useFallback = false;
        }
      } catch (error) {
        this.useFallback = true;
      }
    }

    async getCurrentProduct() {
      if (this.useFallback) {
        return localStorage.getItem('currentProduct') || 'sofa';
      }

      try {
        const response = await fetch(
          this.baseUrl + 'settings.php?key=current_product'
        );
        const data = await response.json();
        return data.value || 'sofa';
      } catch (error) {
        return localStorage.getItem('currentProduct') || 'sofa';
      }
    }

    async getContent(productKey = 'sofa') {
      if (this.useFallback) {
        return this.getContentFallback(productKey);
      }

      try {
        const response = await fetch(
          this.baseUrl + `content.php?product_key=${productKey}`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        return this.getContentFallback(productKey);
      }
    }

    getContentFallback(productKey) {
      if (productKey === 'sofa') {
        const sofaData = JSON.parse(
          localStorage.getItem('sofaQuizData') || '{}'
        );
        return {
          content: {
            banner: sofaData.bannerSection,
            showroom: sofaData.showroomSection,
            luxury_content: sofaData.luxurySofasSection,
            gallery: sofaData.gallerySection,
            design_expert: sofaData.designDisasterSection,
            quiz_promo: sofaData.quizPromoSection,
            questions: sofaData.questions || [],
          },
        };
      } else {
        const productQuizzes = JSON.parse(
          localStorage.getItem('productQuizzes') || '{}'
        );
        const product = productQuizzes[productKey];
        if (product) {
          return {
            content: {
              banner: product.bannerContent,
              showroom: product.showroomContent,
              luxury_content: product.luxurySofasSection,
              gallery: product.gallerySection,
              design_expert: product.designDisasterSection,
              quiz_promo: product.quizPromoSection,
              questions: product.questions || [],
            },
          };
        }
      }
      return { content: {} };
    }
  }

  const apiClient = new ApiClient();

  // Store current product name globally for placeholder text
  let currentProductName = 'Sofa';

  // Function to generate placeholder image URL
  function getPlaceholderImage(width, height, text = 'No Image') {
    return `https://placehold.co/${width}x${height}/e5e5e5/666666?text=${encodeURIComponent(
      text
    )}`;
  }

  // Function to capitalize first letter of product name
  function capitalizeProduct(product) {
    return product.charAt(0).toUpperCase() + product.slice(1).toLowerCase();
  }
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

  // Function to get current product data
  async function getCurrentProductData() {
    try {
      const currentProduct = await apiClient.getCurrentProduct();
      currentProductName = capitalizeProduct(currentProduct);
      const response = await apiClient.getContent(currentProduct);
      return response.content;
    } catch (error) {
      console.error('Failed to get current product data:', error);
      return null;
    }
  }

  // Function to load and update banner section
  async function loadBannerSection() {
    try {
      const data = await getCurrentProductData();

      if (data && data.banner) {
        // Find the banner section
        const bannerSection = document.querySelector('.banner-block');

        if (bannerSection) {
          // Update main heading
          const mainHeading = bannerSection.querySelector(
            '.banner-heading.thick-h1'
          );
          if (mainHeading) {
            mainHeading.textContent = data.banner.mainHeading;
          }

          // Update sub heading
          const subHeading = bannerSection.querySelector('p.banner-heading');
          if (subHeading) {
            subHeading.textContent = data.banner.subHeading;
          }

          // Update background images
          const picture = bannerSection.querySelector('picture');
          if (picture) {
            // Update mobile image source
            const source = picture.querySelector('source');
            if (source) {
              const mobileImage = data.banner.mobileImage ||
                getPlaceholderImage(
                  IMAGE_SIZES.banner.mobile.width,
                  IMAGE_SIZES.banner.mobile.height,
                  `${currentProductName} Hero Banner`
                );
              source.srcset = mobileImage;
            }

            // Update desktop image with sizing
            const img = picture.querySelector('img.banner-img');
            if (img) {
              const desktopImage = data.banner.backgroundImage ||
                getPlaceholderImage(
                  IMAGE_SIZES.banner.desktop.width,
                  IMAGE_SIZES.banner.desktop.height,
                  `${currentProductName} Hero Banner`
                );
              img.srcset = desktopImage;
              img.src = desktopImage;
              img.alt = `${currentProductName} Hero Banner`;
              applyImageSizing(img, IMAGE_SIZES.banner.desktop);
            }
          }
        }

        console.log('[Banner] Section updated from data source');
      }
    } catch (error) {
      console.error('[Banner] Error loading section:', error);
    }
  }

  // Function to load and update showroom section
  async function loadShowroomSection() {
    try {
      const data = await getCurrentProductData();

      if (data && data.showroom) {
        // Update showroom heading by ID first, then fallback to text search
        const showroomTitle = document.getElementById('showroomSectionTitle');
        if (showroomTitle) {
          showroomTitle.textContent = data.showroom.heading;
        } else {
          // Fallback to searching by text content
          const showroomHeadings = document.querySelectorAll('h2');
          showroomHeadings.forEach((heading) => {
            if (
              heading.textContent.includes('largest luxury') ||
              heading.textContent.includes('showroom')
            ) {
              heading.textContent = data.showroom.heading;
            }
          });
        }

        // Update showroom image by ID first, then fallback
        const showroomImage = document.getElementById('showroomSectionImage');
        if (showroomImage && data.showroom.image) {
          showroomImage.src = data.showroom.image;
          showroomImage.alt = data.showroom.heading;
          showroomImage.title = data.showroom.heading;
          applyImageSizing(showroomImage, IMAGE_SIZES.showroom);
        } else {
          // Fallback to finding images by attributes
          const showroomImages = document.querySelectorAll(
            'img[alt*="showroom"], img[src*="shoroomlndn"]'
          );
          showroomImages.forEach((img) => {
            if (data.showroom.image) {
              img.src = data.showroom.image;
              img.alt = data.showroom.heading;
              img.title = data.showroom.heading;
              applyImageSizing(img, IMAGE_SIZES.showroom);
            }
          });
        }

        console.log('[Showroom] Section updated from data source');
      }
    } catch (error) {
      console.error('[Showroom] Error loading section:', error);
    }
  }

  // Function to load and update Luxury Content Section
  async function loadLuxuryContentSection() {
    try {
      const data = await getCurrentProductData();

      if (data && data.luxury_content) {
        // Update main title
        const mainTitle = document.getElementById('showroomMainTitle');
        if (mainTitle) {
          mainTitle.textContent = data.luxury_content.title;
        } else {
          // Fallback for elements without ID
          const titles = document.querySelectorAll(
            'p.thick-h1.text-center.black'
          );
          titles.forEach((title) => {
            if (
              title.textContent.includes('Luxury') ||
              title.textContent.includes('Redefined')
            ) {
              title.textContent = data.luxury_content.title;
            }
          });
        }

        // Update introduction paragraph
        const introduction = document.getElementById('showroomIntroduction');
        if (introduction) {
          introduction.textContent = data.luxury_content.introduction;
        }

        // Update subtitle
        const subtitle = document.getElementById('showroomWhyVisitTitle');
        if (subtitle) {
          subtitle.textContent = data.luxury_content.subtitle;
        }

        // Update points
        const pointsContainer = document.getElementById('showroomPoints');
        if (pointsContainer && data.luxury_content.points) {
          pointsContainer.innerHTML = data.luxury_content.points
            .map(
              (point) =>
                `<p class="block-text"><strong>${point.title}</strong><br>${point.description}</p>`
            )
            .join('');
        }

        // Update conclusion
        const conclusion = document.getElementById('showroomConclusion');
        if (conclusion) {
          conclusion.innerHTML = data.luxury_content.conclusion;
        }

        // If elements don't have IDs, try alternative approach
        if (!mainTitle || !introduction) {
          const contentDiv = document.getElementById('showroomContent');
          if (contentDiv && data.luxury_content.points) {
            // Build the entire content structure
            let contentHTML = `
              <p class="block-text" id="showroomIntroduction">${data.luxury_content.introduction}</p>
              <p class="block-text" id="showroomWhyVisitTitle">${data.luxury_content.subtitle}</p>
              <div id="showroomPoints">
            `;

            data.luxury_content.points.forEach((point) => {
              contentHTML += `<p class="block-text"><strong>${point.title}</strong><br>${point.description}</p>`;
            });

            contentHTML += `
              </div>
              <p class="block-text" id="showroomConclusion">${data.luxury_content.conclusion}</p>
            `;

            contentDiv.innerHTML = contentHTML;
          }
        }

        console.log('[LuxuryContent] Section updated from data source');
      }
    } catch (error) {
      console.error('[LuxuryContent] Error loading section:', error);
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
              img.src = imageData.src || getPlaceholderImage(IMAGE_SIZES.gallery.width, IMAGE_SIZES.gallery.height, `${currentProductName} Gallery`);
              img.alt = imageData.alt;
              img.title = imageData.alt;
              applyImageSizing(img, IMAGE_SIZES.gallery);
            } else {
              // Use placeholder if no image data available
              img.src = getPlaceholderImage(IMAGE_SIZES.gallery.width, IMAGE_SIZES.gallery.height, `${currentProductName} Gallery`);
              img.alt = `${currentProductName} gallery placeholder image`;
              img.title = `${currentProductName} gallery placeholder image`;
              applyImageSizing(img, IMAGE_SIZES.gallery);
            }
          });

          console.log('[Gallery] Section updated from data source');
        }
      } else {
        // If no gallery data is available, set placeholder images
        const gallerySection = document.querySelector('section.container.big');
        if (gallerySection) {
          const galleryImages = gallerySection.querySelectorAll('img');
          galleryImages.forEach((img) => {
            img.src = getPlaceholderImage(IMAGE_SIZES.gallery.width, IMAGE_SIZES.gallery.height, `${currentProductName} Gallery`);
            img.alt = `${currentProductName} gallery placeholder image`;
            img.title = `${currentProductName} gallery placeholder image`;
            applyImageSizing(img, IMAGE_SIZES.gallery);
          });
          console.log('[Gallery] Section updated with placeholder images');
        }
      }
    } catch (error) {
      console.error('[Gallery] Error loading section:', error);
    }
  }
  // Function to load and update Design Expert section
  async function loadDesignExpertSection() {
    try {
      const data = await getCurrentProductData();

      if (data && data.design_expert) {
        // Find the design expert section
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
            heading.innerHTML = data.design_expert.heading.replace(
              /\n/g,
              '<br>'
            );
          }

          // Update image with sizing
          const image = designSection.querySelector(
            'img[src*="avoid-a-design-disaster"]'
          );
          if (image) {
            const { width, height } = IMAGE_SIZES.designDisaster;
            image.src =
              data.design_expert.image ||
              getPlaceholderImage(width, height, `${currentProductName} Design Expert`);
            image.alt = 'Interior designer offering fabric choices to a client';
            applyImageSizing(image, IMAGE_SIZES.designDisaster);
          }

          // Update button
          const button = designSection.querySelector('a.btn');
          if (button) {
            button.href = data.design_expert.buttonLink;
            button.innerHTML = `${data.design_expert.buttonText} <i class="fa-solid fa-circle-chevron-right fa-lg" style="color: #000000;"></i>`;
          }
        }

        console.log('[DesignExpert] Section updated from data source');
      }
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

          // Update slider images with consistent sizing and placeholder fallback
          const slider = promoSection.querySelector('#wardrobes-slider');
          if (
            slider &&
            data.quiz_promo.images &&
            data.quiz_promo.images.length > 0
          ) {
            slider.innerHTML = data.quiz_promo.images
              .map((image, index) => {
                const fallbackImage = getPlaceholderImage(
                  IMAGE_SIZES.quizPromo.width,
                  IMAGE_SIZES.quizPromo.height,
                  `${currentProductName} ${index + 1}`
                );

                return `
                    <li>
                      <img alt="Luxury ${currentProductName} ${index + 1}"
                           title="Luxury ${currentProductName} ${index + 1}"
                           src="${image || fallbackImage}"
                           onerror="this.src='${fallbackImage}'"
                           loading="lazy"
                           width="${IMAGE_SIZES.quizPromo.width}"
                           height="${IMAGE_SIZES.quizPromo.height}"
                           style="width: 100%; height: ${
                             IMAGE_SIZES.quizPromo.height
                           }px; object-fit: cover; object-position: center;">
                    </li>
                  `;
              })
              .join('');
          } else if (slider) {
            // If no images in data, create placeholder images
            const placeholderImages = Array.from({ length: 6 }, (_, index) => {
              const placeholderSrc = getPlaceholderImage(
                IMAGE_SIZES.quizPromo.width,
                IMAGE_SIZES.quizPromo.height,
                `${currentProductName} ${index + 1}`
              );

              return `
                <li>
                  <img alt="${currentProductName} placeholder ${index + 1}"
                       title="${currentProductName} placeholder ${index + 1}"
                       src="${placeholderSrc}"
                       loading="lazy"
                       width="${IMAGE_SIZES.quizPromo.width}"
                       height="${IMAGE_SIZES.quizPromo.height}"
                       style="width: 100%; height: ${
                         IMAGE_SIZES.quizPromo.height
                       }px; object-fit: cover; object-position: center;">
                </li>
              `;
            }).join('');

            slider.innerHTML = placeholderImages;
          }

          // Re-initialize the slider after content update
          // Use longer delay and ensure proper cleanup
          setTimeout(() => {
            try {
              const $slider = jQuery('#wardrobes-slider');

              // Complete cleanup of existing slider
              if (typeof jQuery !== 'undefined' && $slider.length) {
                // Remove existing lightSlider data and events
                if ($slider.data('lightSlider')) {
                  $slider.data('lightSlider').destroy();
                }

                // Clean up any remaining slider wrapper elements
                $slider.removeClass('lightSlider lsGrab lsGrabbing lSSlide');
                $slider.removeAttr('style');

                // Remove any existing navigation controls to prevent duplicates
                $slider.parent().find('.lSAction').remove();

                // Wait for cleanup to complete, then reinitialize
                setTimeout(() => {
                  $slider.lightSlider({
                    item: 1,
                    loop: true,
                    controls: true,
                    slideMargin: 0,
                    adaptiveHeight: true,
                    pager: false,
                    speed: 400,
                    onSliderLoad: function () {
                      // Ensure images are properly sized after slider loads
                      jQuery('#wardrobes-slider img').each(function () {
                        const img = jQuery(this);
                        img.css({
                          width: '100%',
                          height: '560px',
                          'object-fit': 'cover',
                          'object-position': 'center',
                        });
                      });

                      console.log('[QuizPromo] Slider re-initialized with working navigation');
                    },
                  });
                }, 50);
              }
            } catch (error) {
              console.error('[QuizPromo] Error re-initializing slider:', error);
            }
          }, 200);
        }

        console.log('[QuizPromo] Section updated from database');
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
  async function loadDynamicContent() {
    try {
      addImageConsistencyStyles();
      await loadBannerSection();
      await loadShowroomSection();
      await loadLuxuryContentSection();
      await loadGallerySection();
      await loadDesignExpertSection();
      await loadQuizPromoSection();
      console.log('[Dynamic Content] All sections loaded successfully');
    } catch (error) {
      console.error('[Dynamic Content] Error loading sections:', error);
    }
  }

  // Load on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDynamicContent);
  } else {
    loadDynamicContent();
  }

  // Listen for localStorage changes (for fallback mode)
  window.addEventListener('storage', function (e) {
    if (
      e.key === 'sofaQuizData' ||
      e.key === 'productQuizzes' ||
      e.key === 'currentProduct'
    ) {
      console.log(
        '[Dynamic Content] Storage change detected, reloading sections...'
      );
      loadDynamicContent();
    }
  });

  // Listen for potential updates from dashboard
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'content-updated') {
      console.log(
        '[Dynamic Content] Content update message received, reloading sections...'
      );
      loadDynamicContent();
    }
  });
})();
