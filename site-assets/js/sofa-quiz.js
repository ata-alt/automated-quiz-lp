(function () {
  'use strict';

  // Function to generate placeholder image URL
  function getPlaceholderImage(width, height, text = 'No Image') {
    return `https://placehold.co/${width}x${height}/e5e5e5/666666?text=${encodeURIComponent(
      text
    )}`;
  }

  // Function to return default questions
  function getDefaultQuestions() {
    return [
      {
        id: 1,
        title: '',
        text: 'Question 1',
        options: [
          {
            id: 'a',
            text: 'Option A',
            image: null,
          },
          {
            id: 'b',
            text: 'Option B',
            image: null,
          },
          {
            id: 'c',
            text: 'Option C',
            image: null,
          },
        ],
      },
      {
        id: 2,
        title: '',
        text: 'Question 2',
        options: [
          {
            id: 'a',
            text: 'Option A',
            image: null,
          },
          {
            id: 'b',
            text: 'Option B',
            image: null,
          },
          {
            id: 'c',
            text: 'Option C',
            image: null,
          },
        ],
      },
      {
        id: 3,
        title: '',
        text: 'Question 3',
        options: [
          {
            id: 'a',
            text: 'Option A',
            image: null,
          },
          {
            id: 'b',
            text: 'Option B',
            image: null,
          },
          {
            id: 'c',
            text: 'Option C',
            image: null,
          },
        ],
      },
      {
        id: 4,
        title: '',
        text: 'Question 4',
        options: [
          {
            id: 'a',
            text: 'Option A',
            image: null,
          },
          {
            id: 'b',
            text: 'Option B',
            image: null,
          },
          {
            id: 'c',
            text: 'Option C',
            image: null,
          },
        ],
      },
      {
        id: 5,
        title: '',
        text: 'Question 5',
        options: [
          {
            id: 'a',
            text: 'Option A',
            image: null,
          },
          {
            id: 'b',
            text: 'Option B',
            image: null,
          },
          {
            id: 'c',
            text: 'Option C',
            image: null,
          },
        ],
      },
      {
        id: 6,
        title: '',
        text: 'Question 6',
        options: [
          {
            id: 'a',
            text: 'Option A',
            image: null,
          },
          {
            id: 'b',
            text: 'Option B',
            image: null,
          },
          {
            id: 'c',
            text: 'Option C',
            image: null,
          },
        ],
      },
      {
        id: 7,
        title: '',
        text: 'Question 7',
        options: [
          {
            id: 'a',
            text: 'Option A',
            image: null,
          },
          {
            id: 'b',
            text: 'Option B',
            image: null,
          },
          {
            id: 'c',
            text: 'Option C',
            image: null,
          },
        ],
      },
      {
        id: 8,
        title: '',
        text: 'Question 8',
        options: [
          {
            id: 'a',
            text: 'Option A',
            image: null,
          },
          {
            id: 'b',
            text: 'Option B',
            image: null,
          },
          {
            id: 'c',
            text: 'Option C',
            image: null,
          },
        ],
      },
    ];
  }

  // Function to load quiz data from database or use defaults
  const loadQuizData = async function () {
    try {
      // Check if we have a data-quiz-type attribute first
      const quizWidget = document.querySelector('.style-quiz-widget');
      const productType = quizWidget?.getAttribute('data-quiz-type');

      // Only wait for API client if we don't have a product type
      if (!productType) {
        let attempts = 0;
        while (typeof window.apiClient === 'undefined' && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (typeof window.apiClient === 'undefined') {
          return getDefaultQuestions();
        }
      }

      // Wait for API client to be available (with shorter timeout since we have product type)
      let attempts = 0;
      while (typeof window.apiClient === 'undefined' && attempts < 50) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      if (typeof window.apiClient !== 'undefined') {
        // Get product type from data-quiz-type attribute or fallback to API
        const currentProduct =
          productType || (await window.apiClient.getCurrentProduct());
        const response = await window.apiClient.getContent(currentProduct);

        if (
          response &&
          response.content &&
          response.content.questions &&
          response.content.questions.length > 0
        ) {
          return response.content.questions;
        }
      } else {
        return getDefaultQuestions();
      }
    } catch (error) {
      // Silently fall back to defaults
    }

    // Return default questions if no saved data
    return getDefaultQuestions();
  };

  const styleQuiz = {
    current: 0,
    answers: [],
    questions: [], // Will be populated on init
    currentProductName: 'Default', // Will be updated on init

    init: async function () {
      const quiz = document.getElementById('quiz');
      if (!quiz) {
        return;
      }

      // Show loading state
      quiz.innerHTML =
        '<div class="loading-state"><h3>Loading quiz...</h3></div>';

      try {
        // Get current product from data attribute or API
        if (typeof window.apiClient !== 'undefined') {
          try {
            const quizWidget = document.querySelector('.style-quiz-widget');
            const productType = quizWidget?.getAttribute('data-quiz-type');
            const currentProduct =
              productType || (await window.apiClient.getCurrentProduct());

            const response = await window.apiClient.getProducts();
            const product = response.products.find(
              (p) => p.product_key === currentProduct
            );
            if (product) {
              this.currentProductName = product.name || 'Default';
            }
          } catch (error) {
            // Silently use default
          }
        }

        // Load questions dynamically
        this.questions = await loadQuizData();

        if (!this.questions || this.questions.length === 0) {
          quiz.innerHTML =
            '<div class="error-state"><h3>No quiz questions available</h3></div>';
          return;
        }

        // Reset to first question
        this.current = 0;
        this.answers = [];

        this.renderQuestion(true); // Pass true to indicate this is the initial render
      } catch (error) {
        quiz.innerHTML =
          '<div class="error-state"><h3>Failed to load quiz</h3></div>';
      }
    },

    renderQuestion: function (isInitialRender) {
      const quiz = document.getElementById('quiz');
      if (!quiz) return;

      quiz.classList.remove('fade-in');
      quiz.classList.add('fade-out');

      setTimeout(() => {
        const q = this.questions[this.current];
        if (!q) {
          return;
        }

        const selected = this.answers.find(
          (a) => a.questionId == q.id
        )?.optionId;

        const optionsHTML = q.options
          .map(function (opt) {
            // Handle both base64 and URL images
            let imageUrl = opt.image;

            // If no image, generate dynamic placeholder with current product name
            if (!imageUrl) {
              imageUrl = getPlaceholderImage(
                400,
                300,
                styleQuiz.currentProductName + ' Quiz Img'
              );
            }

            // Fix paths for deployed environment
            // Deployed at: /site-assets/automated-quiz/v2/
            // Images at: /site-assets/automated-quiz/v2/uploaded-image/

            // Handle absolute paths starting with /
            if (imageUrl.startsWith('/site-assets/')) {
              // Already absolute path - use as is
              imageUrl = imageUrl;
            } else if (imageUrl.startsWith('../uploaded-image/')) {
              // Relative path from dashboard - convert to absolute for deployed site
              imageUrl =
                '/site-assets/automated-quiz/v2/uploaded-image/' +
                imageUrl.substring(18); // Remove '../uploaded-image/'
            } else if (imageUrl.startsWith('uploaded-image/')) {
              // Missing path prefix - add absolute path
              imageUrl = '/site-assets/automated-quiz/v2/' + imageUrl;
            } else if (imageUrl.startsWith('../site-assets/')) {
              // Convert relative site-assets to absolute
              imageUrl = '/' + imageUrl.substring(3); // Remove '../'
            }

            return (
              '<button class="option-button" onclick="styleQuiz.handleAnswer.call(this, \'' +
              q.id +
              "', '" +
              opt.id +
              '\', event)">' +
              '<img src="' +
              imageUrl +
              '" alt="' +
              opt.text +
              '" onerror="this.src=\'' +
              getPlaceholderImage(
                400,
                300,
                styleQuiz.currentProductName + ' Quiz Img'
              ) +
              '\'" />' +
              '<div class="spacing-v block-text" style="margin: 0px;">' +
              opt.text +
              '</div>' +
              '</button>'
            );
          })
          .join('');

        const progressWidth =
          ((this.current + 1) / this.questions.length) * 100;

        // Build the title HTML if a title exists
        const titleHTML =
          q.title && q.title.trim()
            ? '<h2 class="thick-h3 black" style="margin-bottom: 10px; margin-top: 0; font-size: 28px; font-weight: 700; line-height: 1.3;">' +
              q.title +
              '</h2>'
            : '';

        // If we have a title, make the question text smaller and less prominent
        const questionTextStyle =
          q.title && q.title.trim()
            ? 'style="font-size: 20px; font-weight: 500; color: #555; margin-top: 5px;"'
            : '';

        quiz.innerHTML =
          '<div class="question-container spacing-v">' +
          titleHTML +
          '<h3 class="thick-h3 black" ' +
          questionTextStyle +
          '>' +
          q.text +
          '</h3>' +
          '<div class="row options-grid">' +
          optionsHTML +
          '</div>' +
          '<div class="progress-dots">' +
          '<div class="progress-dots-inner" style="width: ' +
          progressWidth +
          '%;"></div>' +
          '</div>' +
          '<div class="nav-buttons">' +
          '<button onclick="styleQuiz.goBack()" ' +
          (this.current === 0 ? 'disabled' : '') +
          '>Previous</button>' +
          '</div>' +
          '</div>';

        quiz.classList.remove('fade-out');
        quiz.classList.add('fade-in');

        // Only scroll if this is not the initial render
        if (!isInitialRender) {
          // Scroll to the top of the quiz container
          quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    },

    handleAnswer: function (questionId, optionId, evt) {
      // Flip all option buttons
      const allButtons = document.querySelectorAll('.option-button');
      allButtons.forEach((button) => {
        button.classList.add('flip-all');
      });

      // Mark the clicked button
      this.classList.add('clicked');

      const quiz = styleQuiz; // Reference to the quiz object
      const index = quiz.answers.findIndex((a) => a.questionId == questionId);
      if (index > -1) {
        quiz.answers[index].optionId = optionId;
      } else {
        quiz.answers.push({ questionId: questionId, optionId: optionId });
      }

      // Wait for the flip animation to complete before moving to next question
      setTimeout(() => {
        if (quiz.current < quiz.questions.length - 1) {
          quiz.current++;
          quiz.renderQuestion(false);
        } else {
          quiz.renderResult();
        }
      }, 600); // Match the flip animation duration
    },

    goBack: function () {
      if (this.current > 0) {
        this.current--;
        this.renderQuestion(false);
      }
    },

    renderResult: function () {
      const quiz = document.getElementById('quiz');
      const result = document.getElementById('result-form');

      if (!quiz || !result) {
        return;
      }

      quiz.classList.remove('fade-in');
      quiz.classList.add('fade-out');

      setTimeout(function () {
        quiz.style.display = 'none';
        result.style.display = 'block';
        result.classList.add('fade-in');

        // Scroll to the result form
        result.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    },

    // Method to reload quiz data (useful for live updates)
    reloadQuizData: async function () {
      this.questions = await loadQuizData();
      this.current = 0;
      this.answers = [];
      await this.init();
    },

    // Method to update product name for placeholder images
    updateProductName: async function () {
      if (typeof window.apiClient !== 'undefined') {
        try {
          const currentProduct = await window.apiClient.getCurrentProduct();
          const response = await window.apiClient.getProducts();
          const product = response.products.find(
            (p) => p.product_key === currentProduct
          );
          if (product) {
            this.currentProductName = product.name || 'Default';
          }
        } catch (error) {
          // Silently use default
        }
      }
    },
  };

  // Make styleQuiz globally available
  window.styleQuiz = styleQuiz;

  // Function to start quiz (called from intro button)
  window.startQuiz = function () {
    const intro = document.getElementById('quiz-intro');
    const quiz = document.getElementById('quiz');

    if (intro && quiz) {
      intro.style.display = 'none';
      quiz.style.display = 'block';

      // Initialize quiz if not already initialized
      if (window.styleQuiz && typeof window.styleQuiz.init === 'function') {
        window.styleQuiz.init();
      }
    }
  };

  // Function to update product name in intro button
  function updateIntroProductName() {
    const productNameSpans = document.querySelectorAll('.product-name');

    if (!productNameSpans.length) {
      return false;
    }

    // Use the properly formatted product name from styleQuiz
    if (
      styleQuiz.currentProductName &&
      styleQuiz.currentProductName !== 'Default'
    ) {
      productNameSpans.forEach(
        (span) => (span.textContent = styleQuiz.currentProductName)
      );
      return true;
    } else {
      return false; // Retry if product name not yet loaded
    }
  }

  // Retry mechanism to wait for element to be available
  function tryUpdateProductName(attempts = 0, maxAttempts = 50) {
    const success = updateIntroProductName();

    if (!success && attempts < maxAttempts) {
      setTimeout(() => {
        tryUpdateProductName(attempts + 1, maxAttempts);
      }, 100); // Retry every 100ms
    }
  }

  // Update product name when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      tryUpdateProductName();
    });
  } else {
    tryUpdateProductName();
  }

  // Function to display personality result
  function displayPersonalityResult(userName, personality) {
    const result = document.getElementById('result-form');

    // Create the personality result HTML with styling matching the quiz theme
    const resultHTML = `
      <div class="personality-result" style="text-align: center; padding: 20px; animation: fadeIn 0.5s;">
        <h3 class="thick-h3" style="color:#0f172a; font-size: 28px; margin-bottom: 30px;">
          ${escapeHtml(personality.profileName)}
        </h3>

        <div style="margin: 30px auto; max-width: 600px;">
          <img
            src="${escapeHtml(personality.imageUrl)}"
            alt="${escapeHtml(personality.profileName)}"
            style="max-width: 100%; height: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
            onerror="this.style.display='none'"
          />
        </div>
      </div>

      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    result.innerHTML = resultHTML;

    // Scroll to result
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Helper function to escape HTML
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Form submission handler - stores quiz results to database AND sends to webhook
  window.submitDetails = async function (e) {
    e.preventDefault();

    const form = document.querySelector('#automated-quiz');
    if (!form) {
      return;
    }

    const name = form.querySelector("input[name='fname']").value;
    const email = form.querySelector("input[name='email']").value;
    const phone = form.querySelector("input[name='phone']").value;

    if (!form.querySelector("input[name='gdpr']").checked) {
      alert('Please agree to the privacy policy to continue.');
      return;
    }

    const submitBtn = form.querySelector("input[type='submit']");
    const originalBtnValue = submitBtn.value;
    submitBtn.value = 'Sending...';
    submitBtn.disabled = true;

    // Prepare quiz answers for database storage
    const quizAnswers = [];
    // Also prepare answers for HubSpot format
    const hubspotAnswers = {};

    console.log('[Quiz] Starting to process answers for HubSpot...');
    console.log('[Quiz] Total answers to process:', styleQuiz.answers.length);

    styleQuiz.answers.forEach(function (a) {
      const q = styleQuiz.questions.find(function (q) {
        return q.id == a.questionId;
      });

      if (!q) {
        console.warn('[Quiz] Question not found for answer:', a);
        return;
      }

      const selectedOption = q.options.find(function (opt) {
        return opt.id === a.optionId;
      });

      console.log('[Quiz] Processing Q' + a.questionId + ':', {
        questionTitle: q.title,
        questionText: q.text,
        selectedOptionId: a.optionId,
        selectedOptionText: selectedOption ? selectedOption.text : 'Unknown',
      });

      // For database
      quizAnswers.push({
        questionId: a.questionId,
        questionTitle: q.title || '',
        questionText: q.text,
        optionId: a.optionId,
        optionText: selectedOption ? selectedOption.text : 'Unknown',
      });

      // For HubSpot - include title if it exists and send option ID instead of text
      const questionDisplay =
        q.title && q.title.trim() ? q.title + ' - ' + q.text : q.text;
      const hubspotValue = questionDisplay + ': ' + a.optionId;
      hubspotAnswers['q' + a.questionId] = hubspotValue;

      console.log(
        '[Quiz] HubSpot field created - q' + a.questionId + ':',
        hubspotValue
      );
    });

    console.log('[Quiz] Final HubSpot answers object:', hubspotAnswers);

    // Get current product key from data attribute or API
    let currentProduct = null;
    if (typeof window.apiClient !== 'undefined') {
      try {
        const quizWidget = document.querySelector('.style-quiz-widget');
        const productType = quizWidget?.getAttribute('data-quiz-type');
        currentProduct =
          productType || (await window.apiClient.getCurrentProduct());
      } catch (error) {
        // Silently continue
      }
    }

    const quizData = {
      name: name,
      email: email,
      phone: phone,
      product_key: currentProduct,
      answers: quizAnswers,
    };

    // Store quiz result in database
    fetch('/site-assets/automated-quiz/v2/api/quiz-results.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Send to HubSpot
          sendToHubspot(name, email, phone, hubspotAnswers);

          // Show final success message
          const result = document.getElementById('result-form');
          result.innerHTML =
            '<h2 class="thick-h2 black">Your Design Profile is Complete</h2>' +
            '<p>Out of 6,561 possible design personalities, you have a completely unique profile that reveals exactly why certain spaces make you feel at home while others never quite feel right.</p>' +
            "<p>We'll email you your personalised report shortly.</p>";

          // Send to n8n webhook (in background without showing spinner)
          if (typeof window.sendQuizToWebhook === 'function') {
            window
              .sendQuizToWebhook(
                name,
                email,
                phone,
                currentProduct,
                quizAnswers
              )
              .then((webhookResult) => {
                console.log('[Quiz] Webhook result received:', webhookResult);

                if (webhookResult.success && webhookResult.data) {
                  console.log('[Quiz] Sending data to email handler...');
                  fetch(
                    '/site-assets/automated-quiz/v2/sofa-quiz-lp/handler.automated-quiz.php',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(webhookResult.data),
                    }
                  )
                    .then((response) => response.json())
                    .then((emailResult) => {
                      console.log(
                        '[Quiz] Email handler response:',
                        emailResult
                      );
                      if (emailResult.success) {
                        console.log('[Quiz] Email sent successfully!');
                      } else {
                        console.error(
                          '[Quiz] Email handler failed:',
                          emailResult
                        );
                      }
                    })
                    .catch((error) => {
                      console.error('[Quiz] Email handler error:', error);
                    });
                } else {
                  console.warn(
                    '[Quiz] Webhook did not return valid data for email handler'
                  );
                }
              })
              .catch((error) => {
                console.warn('[Quiz] Webhook error but continuing:', error);
              });
          }

          // Track event
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            formID: 'automated-quiz',
            event: 'formsubmit',
            email: email,
            quizResultId: data.result_id,
          });

          if (typeof zaraz !== 'undefined') {
            zaraz.track('automated-quiz', {
              formID: 'automated-quiz',
              quizResultId: data.result_id,
            });
          }
        } else {
          throw new Error(data.message || 'Failed to store quiz result');
        }
      })
      .catch((error) => {
        // Even if database fails, try to send to HubSpot
        sendToHubspot(name, email, phone, hubspotAnswers);
        alert('Something went wrong. Please try again later.');
        submitBtn.value = originalBtnValue;
        submitBtn.disabled = false;
      });

    // HubSpot integration
    function sendToHubspot(name, email, phone, answers) {
      const fields = [
        { name: 'firstname', value: name },
        { name: 'email', value: email },
        { name: 'phone', value: phone },
        ...Object.entries(answers).map(([key, value]) => ({
          name: key,
          value: value,
        })),
      ];

      fetch(
        //change the d02069e2-8aa3-4f69-b176-5e14d2abb0bf to faa1ab45-641d-4ee5-befa-3442869ee1af copying from the form in hubspot and in the api-frame-cron-every5mins.php
        'https://api.hsforms.com/submissions/v3/integration/submit/6991142/faa1ab45-641d-4ee5-befa-3442869ee1af',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields,
            context: {
              pageUri: window.location.href,
              pageName: document.title,
            },
          }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            response.text();
          }
        })
        .catch((error) => {
          // Silently fail
        });
    }
  };

  // COMMENTED OUT - Original submitDetails function that sends to HubSpot
  /*
  window.submitDetails_OLD = function (e) {
    e.preventDefault();

    const form = document.querySelector('#productquiz');
    if (!form) {
      console.error('[Quiz] Form not found');
      return;
    }

    const name = form.querySelector("input[name='fname']").value;
    const email = form.querySelector("input[name='email']").value;
    const phone = form.querySelector("input[name='phone']").value;

    if (!form.querySelector("input[name='gdpr']").checked) {
      alert('Please agree to the privacy policy to continue.');
      return;
    }

    const submitBtn = form.querySelector("input[type='submit']");
    const originalBtnValue = submitBtn.value;
    submitBtn.value = 'Sending...';
    submitBtn.disabled = true;

    const answers = {};
    styleQuiz.answers.forEach(function (a) {
      const q = styleQuiz.questions.find(function (q) {
        return q.id == a.questionId;
      });

      if (!q) {
        console.warn('[Quiz] Question not found for answer:', a);
        return;
      }

      const selectedOption = q.options.find(function (opt) {
        return opt.id === a.optionId;
      });

      answers['q' + a.questionId] =
        q.text + ': ' + (selectedOption ? selectedOption.text : 'Unknown');
    });

    const formData = {
      fname: name,
      email: email,
      phone: phone,
      gdpr: 'yes',
      message: 'Product Quiz Submission',
    };

    // jQuery AJAX call
    if (typeof $ !== 'undefined' && $.post) {
      $.post('/form.submit?form=productquiz', formData, function (data) {
        if (data === '0') {
          sendToHubspot(name, email, phone, answers);
        } else {
          console.error('Form submission failed', data);
          alert('Something went wrong. Please try again later.');
          submitBtn.value = originalBtnValue;
          submitBtn.disabled = false;
        }
      }).fail(function (xhr, status, error) {
        console.error('Request failed:', status, error);
        console.error('Response:', xhr.responseText);
        alert('Something went wrong. Please try again later.');
        submitBtn.value = originalBtnValue;
        submitBtn.disabled = false;
      });
    } else {
      // Fallback if jQuery is not available
      sendToHubspot(name, email, phone, answers);
    }

    function sendToHubspot(name, email, phone, answers) {
      const fields = [
        { name: 'firstname', value: name },
        { name: 'email', value: email },
        { name: 'phone', value: phone },
        ...Object.entries(answers).map(([key, value]) => ({
          name: key,
          value: value,
        })),
      ];

      fetch(
        'https://api.hsforms.com/submissions/v3/integration/submit/6991142/d02069e2-8aa3-4f69-b176-5e14d2abb0bf',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields,
            context: {
              pageUri: window.location.href,
              pageName: document.title,
            },
          }),
        }
      )
        .then((response) => {
          const result = document.getElementById('result-form');
          if (response.ok) {
            result.innerHTML =
              "<h2 style='color:#0f172a;'>Thank you, " +
              name +
              '! Your report is on the way.</h2>';

            // Track event
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              formID: 'productquiz',
              event: 'formsubmit',
              email: email,
            });

            if (typeof zaraz !== 'undefined') {
              zaraz.track('productquiz', { formID: 'productquiz' });
            }
          } else {
            response
              .text()
              .then((text) => console.error('HubSpot submission issue:', text));
            result.innerHTML =
              "<h2 style='color:#0f172a;'>Thank you, " +
              name +
              '! Your submission has been received.</h2>';
          }
        })
        .catch((error) => {
          console.error('Error submitting to HubSpot:', error);
          const result = document.getElementById('result-form');
          result.innerHTML =
            "<h2 style='color:#0f172a;'>Thank you, " +
            name +
            '! Your submission has been received.</h2>';
        });
    }
  };
  */

  // Listen for custom events to update quiz when admin makes changes
  window.addEventListener('quizDataUpdated', function (e) {
    if (
      window.styleQuiz &&
      typeof window.styleQuiz.reloadQuizData === 'function'
    ) {
      window.styleQuiz.reloadQuizData();
    }
  });

  // Don't auto-initialize quiz - wait for user to click "Start Quiz" button
  // Quiz will be initialized when startQuiz() is called
})();
