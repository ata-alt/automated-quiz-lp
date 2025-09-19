(function ($) {
  "use strict";
  const styleQuizWidget = {
    init() {
      $(".style-quiz-widget").each(function () {
        const container = $(this);
        $.get("/layout.style-quiz-widget.php", function (html) {
          container.html(html);
          if (typeof window.styleQuiz === "object" && typeof window.styleQuiz.init === "function") {
            console.log("[Loader] styleQuiz already defined. Calling init.");
            window.styleQuiz.init();
          } else {
            const script = document.createElement("script");
            script.src = "/site-assets/js/sofa-quiz.js";
            script.defer = true;
            script.onload = () => {
              if (typeof window.styleQuiz !== "undefined" && typeof window.styleQuiz.init === "function") {
                console.log("[Loader] Script loaded. Calling window.styleQuiz.init()");
                window.styleQuiz.init();
              } else {
                console.warn("[Loader] Script loaded but styleQuiz not found");
              }
            };
            document.body.appendChild(script);
          }
        });
      });
    }
  };
  $(function () {
    styleQuizWidget.init();
  });
})(jQuery);