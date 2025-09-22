(function () {
  'use strict';

  // Function to load quiz data from database or use defaults
  const loadQuizData = async function () {
    try {
      console.log('[Quiz] Attempting to fetch questions from database...');

      // Wait for API client to be available (with timeout)
      let attempts = 0;
      while (typeof window.apiClient === 'undefined' && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (typeof window.apiClient !== 'undefined') {
        // Get the current active product instead of hardcoding 'sofa'
        const currentProduct = await window.apiClient.getCurrentProduct();
        console.log('[Quiz] Loading questions for product:', currentProduct);
        const response = await window.apiClient.getContent(currentProduct);

        if (response && response.content && response.content.questions && response.content.questions.length > 0) {
          console.log('[Quiz] Successfully loaded questions from database:', response.content.questions.length, 'questions');
          return response.content.questions;
        } else {
          console.warn('[Quiz] No questions found in database, using defaults');
        }
      } else {
        console.warn('[Quiz] API client not available after timeout, using defaults');
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
        text: 'What best describes your household?',
        options: [
          {
            id: 'a',
            text: 'Young kids—energetic, messy, and always moving',
            image:
              '../site-assets/images/sofa-quiz/young-kids-energetic-messy-and-always-moving.jpg',
          },
          {
            id: 'b',
            text: 'Teenagers or young adults still at home',
            image:
              '../site-assets/images/sofa-quiz/teenagers-or-young-adults-still-at-home.jpg',
          },
          {
            id: 'c',
            text: 'Just the two of us—calm and design-focused',
            image:
              '../site-assets/images/sofa-quiz/just-the-two-of-us-calm-and-design-focused.jpg',
          },
          {
            id: 'd',
            text: 'Grown-up home—quiet, elegant, mostly adults',
            image: '../site-assets/images/sofa-quiz/grown-up-home.jpg',
          },
        ],
      },
      {
        id: 2,
        text: "What's your design style at home?",
        options: [
          {
            id: 'a',
            text: 'Minimalist—clean, sleek, no clutter',
            image:
              '../site-assets/images/sofa-quiz/minimalist-clean-sleek-no-clutter.jpg',
          },
          {
            id: 'b',
            text: 'Comfort-first—we live on the sofa',
            image:
              '../site-assets/images/sofa-quiz/comfort-first-we-live-on-the-sofa.jpg',
          },
          {
            id: 'c',
            text: 'Practical—tough furniture, daily use',
            image:
              '../site-assets/images/sofa-quiz/practical-tough-furniture-daily-use.jpg',
          },
          {
            id: 'd',
            text: 'Understated luxury—soft tones, high-end finishes',
            image:
              '../site-assets/images/sofa-quiz/understated-luxury-soft-tones-high-end-finishes.jpg',
          },
        ],
      },
      {
        id: 3,
        text: 'Preferred sofa materials?',
        options: [
          {
            id: 'a',
            text: 'Easy-clean fabrics or microfibres',
            image:
              '../site-assets/images/sofa-quiz/easy-clean-fabrics-or-microfibres.jpg',
          },
          {
            id: 'b',
            text: 'Treated leather—durable and refined',
            image:
              '../site-assets/images/sofa-quiz/treated-leather-durable-and-refined.jpg',
          },
          {
            id: 'c',
            text: 'Aniline leather—aged, rich, full of character',
            image:
              '../site-assets/images/sofa-quiz/aniline-leather-aged-rich-full-of-character.jpg',
          },
          {
            id: 'd',
            text: 'Natural fabrics—linen, wool, boucle, velvet',
            image:
              '../site-assets/images/sofa-quiz/natural-fabrics-linen-woo-boucle-velvet.jpg',
          },
        ],
      },
      {
        id: 4,
        text: "Who's using the sofa?",
        options: [
          {
            id: 'a',
            text: "Everyone's about the same build",
            image:
              '../site-assets/images/sofa-quiz/everyones-about-the-same-build.jpg',
          },
          {
            id: 'b',
            text: 'Big mix—short, tall, light, heavy',
            image:
              '../site-assets/images/sofa-quiz/big-mix-short-tall-light-heavy.jpg',
          },
          {
            id: 'c',
            text: 'We like structure and firm support',
            image:
              '../site-assets/images/sofa-quiz/we-like-structure-and-firm-support.jpg',
          },
          {
            id: 'd',
            text: 'We want soft, deep, all-day comfort',
            image:
              '../site-assets/images/sofa-quiz/we-want-soft-deep-all-day-comfort.jpg',
          },
        ],
      },
      {
        id: 5,
        text: 'How is the space used during the week?',
        options: [
          {
            id: 'a',
            text: "Looks over lounging—it's rarely used",
            image:
              '../site-assets/images/sofa-quiz/looks-over-lounging-its-rarely-used.jpg',
          },
          {
            id: 'b',
            text: 'Controlled chaos—tech, homework, snacks',
            image:
              '../site-assets/images/sofa-quiz/controlled-chaos-tech-homework-snacks.jpg',
          },
          {
            id: 'c',
            text: 'Hosting friends—drinks, movies, conversation',
            image:
              '../site-assets/images/sofa-quiz/hosting-friends-drinks-movies-conversation.jpg',
          },
          {
            id: 'd',
            text: 'Quiet evenings—reading, wine, feet up',
            image:
              '../site-assets/images/sofa-quiz/quiet-evenings-reading-wine-feet-up.jpg',
          },
        ],
      },
      {
        id: 6,
        text: 'What best describes your home?',
        options: [
          {
            id: 'a',
            text: 'Modern or architect-designed house',
            image:
              '../site-assets/images/sofa-quiz/modern-or-architect-designed-house.jpg',
          },
          {
            id: 'b',
            text: 'Detached house in the suburbs—spacious',
            image:
              '../site-assets/images/sofa-quiz/detached-house-in-the-suburbs-spacious-family-focused.jpg',
          },
          {
            id: 'c',
            text: 'Apartment—stylish but space-conscious',
            image:
              '../site-assets/images/sofa-quiz/apartment-stylish-but-space-conscious.jpg',
          },
          {
            id: 'd',
            text: 'Townhouse—multi-floor, mixed styles',
            image:
              '../site-assets/images/sofa-quiz/townhouse-multi-floor-mixed-styles.jpg',
          },
        ],
      },
    ];
  };

  const styleQuiz = {
    current: 0,
    answers: [],
    questions: [], // Will be populated on init

    init: async function () {
      console.log('[Quiz] Initializing quiz...');

      const quiz = document.getElementById('quiz');
      if (!quiz) {
        console.warn('[Quiz] Quiz element not found');
        return;
      }

      // Show loading state
      quiz.innerHTML = '<div class="loading-state"><h3>Loading quiz...</h3></div>';

      try {
        // Load questions dynamically
        this.questions = await loadQuizData();

        if (!this.questions || this.questions.length === 0) {
          quiz.innerHTML = '<div class="error-state"><h3>No quiz questions available</h3></div>';
          return;
        }

        console.log('[Quiz] Quiz initialized with', this.questions.length, 'questions');

        // Reset to first question
        this.current = 0;
        this.answers = [];

        this.renderQuestion(true); // Pass true to indicate this is the initial render
      } catch (error) {
        console.error('[Quiz] Failed to initialize quiz:', error);
        quiz.innerHTML = '<div class="error-state"><h3>Failed to load quiz</h3></div>';
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
            let imageUrl = opt.image || '../site-assets/images/sofa-quiz/placeholder.jpg';

            // Fix absolute paths from database to relative paths for HTML location
            if (imageUrl.startsWith('/site-assets/')) {
              imageUrl = '../' + imageUrl.substring(1); // Remove leading slash and add ../
            }

            return (
              '<button class="option-button" onclick="styleQuiz.handleAnswer(\'' +
              q.id +
              "', '" +
              opt.id +
              '\')">' +
              '<img src="' +
              imageUrl +
              '" alt="' +
              opt.text +
              '" onerror="this.src=\'../site-assets/images/sofa-quiz/placeholder.jpg\'" />' +
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

    handleAnswer: function (questionId, optionId) {
      const index = this.answers.findIndex((a) => a.questionId == questionId);
      if (index > -1) {
        this.answers[index].optionId = optionId;
      } else {
        this.answers.push({ questionId: questionId, optionId: optionId });
      }

      if (this.current < this.questions.length - 1) {
        this.current++;
        this.renderQuestion(false);
      } else {
        this.renderResult();
      }
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
  };

  // Make styleQuiz globally available
  window.styleQuiz = styleQuiz;

  // Form submission handler
  window.submitDetails = function (e) {
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
    document.addEventListener('DOMContentLoaded', async function() {
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
