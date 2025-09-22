(function ($) {
  "use strict";
  const styleQuizWidget = {
    init() {
      console.log("[Loader] Initializing quiz widget");

      // Check if quiz is already loaded and initialize it
      if (typeof window.styleQuiz === "object" && typeof window.styleQuiz.init === "function") {
        console.log("[Loader] styleQuiz already available. Initializing...");
        window.styleQuiz.init();
      } else {
        // Wait for the sofa-quiz.js script to load
        console.log("[Loader] Waiting for sofa-quiz.js to load...");
        const checkQuizReady = () => {
          if (typeof window.styleQuiz !== "undefined" && typeof window.styleQuiz.init === "function") {
            console.log("[Loader] styleQuiz ready. Initializing...");
            window.styleQuiz.init();
          } else {
            setTimeout(checkQuizReady, 100);
          }
        };
        checkQuizReady();
      }
    }
  };

  $(function () {
    styleQuizWidget.init();
  });
})(jQuery);