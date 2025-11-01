<section class="quiz-block">
    <div class="container">
        <div id="quiz-intro" class="quiz-intro">
            <h2 class="quiz-intro-title">Can't Decide?</h2>
            <h3 class="quiz-intro-subtitle">Let's Find Your Perfect Match</h3>
            <button class="btn btn-black font-uppercase" onclick="startQuiz()">Find My Perfect <span class="product-name">Product</span></button>
        </div>
        <div id="quiz" class="fade-in" style="display: none;"></div>
        <div id="result-form" class="result-section" style="display: none;">
            <h2 class="thick-h2 black">Ok We're On It.</h2>
            <h3 class="thick-h3 black">We'll send you an email shortly with your lifestyle matched to a few <span class="product-name">Product</span> options.</h3>
            <div class="spacing-v"></div>
            <form id="sofaquiz" class="webform" action="#" method="POST" onsubmit="submitDetails(event)">
                <div class="row">
                    <div class="col col-12 col-4-mid">
                        <div class="field-block">
                            <input type="text" name="fname" placeholder="First Name" class="input-text input-lg" pattern=".{2,255}" required title="2 to 255 characters">
                        </div>
                    </div>
                    <div class="col col-12 col-4-mid">
                        <div class="field-block">
                            <input type="email" name="email" placeholder="Email" class="input-text input-lg" required>
                        </div>
                    </div>
                    <div class="col col-12 col-4-mid">
                        <div class="field-block">
                            <input type="tel" name="phone" placeholder="Phone Number" class="input-text" required="required">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col col-12">
                        <div class="field-block">
                            <input name="gdpr" id="gdpr-signup" type="checkbox" required>
                            <label for="gdpr-signup" class="input-checkbox-label">
                                <span><a href="/privacy-policy.html" target="_blank"><u>Privacy Policy agreed</u></a></span>
                            </label>
                        </div>
                    </div>
                    <div class="col col-12">
                        <div class="field-block mobile-show" style="flex: 1 0 auto;">
                            <input class="btn font-uppercase btn-black full-width" type="submit" value="Find My Match">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</section>