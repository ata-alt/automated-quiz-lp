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
    whatWeDo: { width: 400, height: 486 },
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

  // Function to load and update banner section
  function loadBannerSection() {
    try {
      const savedData = localStorage.getItem('sofaQuizData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.bannerSection) {
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
      }
    } catch (error) {
      console.error('[Banner] Error loading section:', error);
    }
  }

  // Function to load and update showroom section
  function loadShowroomSection() {
    try {
      const savedData = localStorage.getItem('sofaQuizData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.showroomSection) {
          // Find and update the showroom heading
          const showroomHeadings = document.querySelectorAll('h2');
          showroomHeadings.forEach((heading) => {
            if (heading.textContent.includes('largest luxury sofa showroom')) {
              heading.textContent = data.showroomSection.heading;
            }
          });

          // Find and update the showroom image with sizing
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

          console.log('[Showroom] Section updated from saved data');
        }
      }
    } catch (error) {
      console.error('[Showroom] Error loading section:', error);
    }
  }

  // Function to load and update Gallery section (3 images)
  function loadGallerySection() {
    try {
      const savedData = localStorage.getItem('sofaQuizData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.gallerySection && data.gallerySection.images) {
          // Find the gallery section container
          const gallerySection = document.querySelector(
            'section.container.big'
          );

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
      }
    } catch (error) {
      console.error('[Gallery] Error loading section:', error);
    }
  }

  // Function to load and update Design Disaster section
  function loadDesignDisasterSection() {
    try {
      const savedData = localStorage.getItem('sofaQuizData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.designDisasterSection) {
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
              image.alt =
                'Interior designer offering fabric choices to a client';
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
      }
    } catch (error) {
      console.error('[DesignDisaster] Error loading section:', error);
    }
  }

  // Function to load and update Quiz Promo section
  function loadQuizPromoSection() {
    try {
      const savedData = localStorage.getItem('sofaQuizData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.quizPromoSection) {
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
            const button = promoSection.querySelector(
              'a.btn[href*="sofaquiz"]'
            );
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
                                             width="${
                                               IMAGE_SIZES.quizPromo.width
                                             }" 
                                             height="${
                                               IMAGE_SIZES.quizPromo.height
                                             }"
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
      }
    } catch (error) {
      console.error('[QuizPromo] Error loading section:', error);
    }
  }

  // Function to load and update "What we do" section
  function loadWhatWeDoSection() {
    try {
      const savedData = localStorage.getItem('sofaQuizData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.whatWeDoSection) {
          // Find and update the section heading
          const headings = document.querySelectorAll('h1');
          headings.forEach((heading) => {
            if (heading.textContent.trim() === 'What we do') {
              heading.textContent = data.whatWeDoSection.heading;
            }
          });

          // Find the What We Do section container
          const section = Array.from(document.querySelectorAll('section')).find(
            (s) =>
              s.innerHTML.includes('Interior Design Service') &&
              s.innerHTML.includes('Corner Sofas')
          );

          if (
            section &&
            data.whatWeDoSection.items &&
            data.whatWeDoSection.items.length > 0
          ) {
            // Find the row that contains the items
            const itemsRow = section.querySelector('.row:not(:first-child)');

            if (itemsRow) {
              // Clear existing items
              itemsRow.innerHTML = '';

              // Add new items with consistent sizing
              data.whatWeDoSection.items.forEach((item) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'col col-12 col-4-mid';
                itemDiv.innerHTML = `
                                    <div class="text-center">
                                        <img alt="${item.title}" 
                                             title="${item.title}" 
                                             src="${
                                               item.image || '/placeholder.jpg'
                                             }" 
                                             loading="lazy" 
                                             width="${
                                               IMAGE_SIZES.whatWeDo.width
                                             }" 
                                             height="${
                                               IMAGE_SIZES.whatWeDo.height
                                             }"
                                             style="width: 100%; height: ${
                                               IMAGE_SIZES.whatWeDo.height
                                             }px; object-fit: cover; object-position: center;">
                                    </div>
                                    <div class="spacing-v">
                                        <p><a class="btn btn-white thick-h4 black full-width" 
                                              href="${item.linkUrl}">
                                              ${item.linkText} 
                                              <i class="fa-solid fa-circle-chevron-right fa-lg" style="color: #000000;"></i>
                                        </a></p>
                                    </div>
                                `;
                itemsRow.appendChild(itemDiv);
              });
            }
          }

          console.log('[WhatWeDo] Section updated from saved data');
        }
      }
    } catch (error) {
      console.error('[WhatWeDo] Error loading section:', error);
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
    loadGallerySection();
    loadDesignDisasterSection();
    loadQuizPromoSection();
    loadWhatWeDoSection();
  }

  // Load on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDynamicContent);
  } else {
    loadDynamicContent();
  }

  // Listen for storage changes (live updates from admin dashboard)
  window.addEventListener('storage', function (e) {
    if (e.key === 'sofaQuizData') {
      console.log(
        '[Dynamic Content] Detected data change, reloading sections...'
      );
      loadDynamicContent();
    }
  });
})();
