(function ($) {
  'use strict';
  const styleQuizWidget = {
    loadApiClient(callback) {
      // Check if API client already exists
      if (typeof window.apiClient !== 'undefined') {
        console.log('[Frame] API client already loaded');
        callback();
        return;
      }

      // Load API client first
      const apiScript = document.createElement('script');
      apiScript.src = '/site-assets/automated-quiz/v2/api/api-client.js?v=4';
      apiScript.onload = () => {
        console.log('[Frame] API client loaded');
        callback();
      };
      apiScript.onerror = () => {
        console.warn('[Frame] Failed to load API client');
        callback(); // Continue anyway
      };
      document.head.appendChild(apiScript);
    },

    init() {
      $('.style-quiz-widget').each(function () {
        const container = $(this);
        // Preserve the data-quiz-type attribute
        const quizType = container.attr('data-quiz-type');

        // Load API client first, then load widget
        styleQuizWidget.loadApiClient(() => {
          $.get(
            '/site-assets/automated-quiz/v2/sofa-quiz-lp/style-quiz-widget.php',
            function (html) {
              container.html(html);

              // Restore the data-quiz-type attribute after loading HTML
              if (quizType) {
                container.attr('data-quiz-type', quizType);
                console.log('[Frame] Restored data-quiz-type:', quizType);
              }
              if (
                typeof window.styleQuiz === 'object' &&
                typeof window.styleQuiz.init === 'function'
              ) {
                console.log(
                  '[Loader] styleQuiz already defined. Calling init.'
                );
                window.styleQuiz.init();
              } else {
                const script = document.createElement('script');
                script.src =
                  '/site-assets/automated-quiz/v2/site-assets/js/sofa-quiz.js?v=25';
                script.defer = true;
                script.onload = () => {
                  if (
                    typeof window.styleQuiz !== 'undefined' &&
                    typeof window.styleQuiz.init === 'function'
                  ) {
                    console.log(
                      '[Loader] Script loaded. Calling window.styleQuiz.init()'
                    );
                    window.styleQuiz.init();
                  } else {
                    console.warn(
                      '[Loader] Script loaded but styleQuiz not found'
                    );
                  }
                };
                document.body.appendChild(script);
              }
            }
          );
        });
      });
    },
  };
  $(function () {
    styleQuizWidget.init();
  });
})(jQuery);
