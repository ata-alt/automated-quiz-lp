(function () {
  'use strict';

  // Function to generate placeholder image URL
  function getPlaceholderImage(width, height, text = 'No Image') {
    return `https://placehold.co/${width}x${height}/e5e5e5/666666?text=${encodeURIComponent(
      text
    )}`;
  }

  // Function to load quiz data from database or use defaults
  const loadQuizData = async function () {
    try {
      console.log('[Quiz] Attempting to fetch questions from database...');

      // Wait for API client to be available (with timeout)
      let attempts = 0;
      while (typeof window.apiClient === 'undefined' && attempts < 50) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      if (typeof window.apiClient !== 'undefined') {
        // Get the current active product instead of hardcoding 'sofa'
        const currentProduct = await window.apiClient.getCurrentProduct();
        console.log('[Quiz] Loading questions for product:', currentProduct);
        const response = await window.apiClient.getContent(currentProduct);

        if (
          response &&
          response.content &&
          response.content.questions &&
          response.content.questions.length > 0
        ) {
          console.log(
            '[Quiz] Successfully loaded questions from database:',
            response.content.questions.length,
            'questions'
          );
          return response.content.questions;
        } else {
          console.warn('[Quiz] No questions found in database, using defaults');
        }
      } else {
        console.warn(
          '[Quiz] API client not available after timeout, using defaults'
        );
      }
    } catch (error) {
      console.error('[Quiz] Error loading data from database:', error);
      console.log('[Quiz] Falling back to default questions');
    }

    console.log('[Quiz] Using default quiz questions');
    // Return default questions if no saved data
    return [
      {
        id: 1,
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
    ];
  };

  const styleQuiz = {
    current: 0,
    answers: [],
    questions: [], // Will be populated on init
    currentProductName: 'Sofa', // Will be updated on init

    init: async function () {
      console.log('[Quiz] Initializing quiz...');

      const quiz = document.getElementById('quiz');
      if (!quiz) {
        console.warn('[Quiz] Quiz element not found');
        return;
      }

      // Show loading state
      quiz.innerHTML =
        '<div class="loading-state"><h3>Loading quiz...</h3></div>';

      try {
        // Get current product name for placeholder images
        if (typeof window.apiClient !== 'undefined') {
          try {
            const currentProduct = await window.apiClient.getCurrentProduct();
            const response = await window.apiClient.getProducts();
            const product = response.products.find(
              (p) => p.product_key === currentProduct
            );
            if (product) {
              this.currentProductName = product.name || 'Sofa';
            }
          } catch (error) {
            console.warn(
              '[Quiz] Could not get current product name, using default'
            );
          }
        }

        // Load questions dynamically
        this.questions = await loadQuizData();

        if (!this.questions || this.questions.length === 0) {
          quiz.innerHTML =
            '<div class="error-state"><h3>No quiz questions available</h3></div>';
          return;
        }

        console.log(
          '[Quiz] Quiz initialized with',
          this.questions.length,
          'questions'
        );

        // Reset to first question
        this.current = 0;
        this.answers = [];

        this.renderQuestion(true); // Pass true to indicate this is the initial render
      } catch (error) {
        console.error('[Quiz] Failed to initialize quiz:', error);
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
          console.error('[Quiz] Question not found at index:', this.current);
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

            // Fix absolute paths from database to relative paths for HTML location
            if (imageUrl.startsWith('/site-assets/')) {
              imageUrl = '../' + imageUrl.substring(1); // Remove leading slash and add ../
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

        quiz.innerHTML =
          '<div class="question-container spacing-v">' +
          '<h3 class="thick-h3 black">' +
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
        console.error('[Quiz] Result elements not found');
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
            this.currentProductName = product.name || 'Sofa';
          }
        } catch (error) {
          console.warn(
            '[Quiz] Could not get current product name, using default'
          );
        }
      }
    },
  };

  // Make styleQuiz globally available
  window.styleQuiz = styleQuiz;

  // Form submission handler - stores quiz results to database
  window.submitDetails = async function (e) {
    e.preventDefault();

    const form = document.querySelector('#sofaquiz');
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

    // Prepare quiz answers for database storage
    const quizAnswers = [];
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

      quizAnswers.push({
        questionId: a.questionId,
        questionText: q.text,
        optionId: a.optionId,
        optionText: selectedOption ? selectedOption.text : 'Unknown'
      });
    });

    // Get current product key if available
    let currentProduct = null;
    if (typeof window.apiClient !== 'undefined') {
      try {
        currentProduct = await window.apiClient.getCurrentProduct();
        console.log('[Quiz] Current product:', currentProduct);
      } catch (error) {
        console.warn('[Quiz] Could not get current product:', error);
      }
    }

    const quizData = {
      name: name,
      email: email,
      phone: phone,
      product_key: currentProduct,
      answers: quizAnswers
    };

    // Store quiz result in database
    fetch('../api/quiz-results.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('[Quiz] Quiz result stored successfully with ID:', data.result_id);

        // Show success message
        const result = document.getElementById('result-form');
        result.innerHTML =
          "<h2 style='color:#0f172a;'>Thank you, " +
          name +
          '! Your quiz results have been saved.</h2>';

        // Track event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          formID: 'sofaquiz',
          event: 'formsubmit',
          email: email,
          quizResultId: data.result_id
        });

        if (typeof zaraz !== 'undefined') {
          zaraz.track('sofaquiz', {
            formID: 'sofaquiz',
            quizResultId: data.result_id
          });
        }
      } else {
        throw new Error(data.message || 'Failed to store quiz result');
      }
    })
    .catch(error => {
      console.error('[Quiz] Error storing quiz result:', error);
      alert('Something went wrong. Please try again later.');
      submitBtn.value = originalBtnValue;
      submitBtn.disabled = false;
    });
  };

  // COMMENTED OUT - Original submitDetails function that sends to HubSpot
  /*
  window.submitDetails_OLD = function (e) {
    e.preventDefault();

    const form = document.querySelector('#sofaquiz');
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
      message: 'Sofa Quiz Submission',
    };

    // jQuery AJAX call
    if (typeof $ !== 'undefined' && $.post) {
      $.post('/form.submit?form=sofaquiz', formData, function (data) {
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
              formID: 'sofaquiz',
              event: 'formsubmit',
              email: email,
            });

            if (typeof zaraz !== 'undefined') {
              zaraz.track('sofaquiz', { formID: 'sofaquiz' });
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
    console.log('[Quiz] Detected quiz data change, reloading...');
    if (
      window.styleQuiz &&
      typeof window.styleQuiz.reloadQuizData === 'function'
    ) {
      window.styleQuiz.reloadQuizData();
    }
  });

  // Initialize quiz when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async function () {
      console.log('[Quiz] DOM loaded, initializing quiz...');
      if (window.styleQuiz && typeof window.styleQuiz.init === 'function') {
        await window.styleQuiz.init();
      }
    });
  } else {
    // DOM already loaded
    console.log('[Quiz] DOM already loaded, initializing quiz immediately...');
    if (window.styleQuiz && typeof window.styleQuiz.init === 'function') {
      window.styleQuiz.init();
    }
  }
})();
