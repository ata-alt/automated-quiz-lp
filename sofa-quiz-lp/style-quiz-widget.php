<section class="quiz-block">
    <div class="container">
        <div id="quiz-intro" class="quiz-intro">
            <h2 class="quiz-intro-title">The Design Style Psychology Test</h2>
            <h3 class="quiz-intro-subtitle">Discover Your Interior Design Personality in 2 Minutes</h3>

            <div class="quiz-intro-content">
                <div class="intro-section">
                    <h4>What is this?</h4>
                    <p class="intro-tagline">8 images. 8 clicks. Your perfect space revealed.</p>
                    <p>We believe your ideal home isn't about following trends – it's about understanding who you are at your core. This visual personality test uses psychological insights to decode your subconscious preferences and reveal the design choices that will make you feel truly at home.</p>
                </div>

                <div class="intro-section">
                    <h4>How it works:</h4>
                    <ul>
                        <li>Look at each set of three images</li>
                        <li>Click the one that speaks to you (don't overthink it!)</li>
                        <li>Get your personalised Interior Design Profile</li>
                        <li>Discover colours, layouts, and styles that match your inner world</li>
                    </ul>
                </div>

                <div class="intro-section">
                    <h4>You'll discover:</h4>
                    <ul class="checklist">
                        <li>✓ Your design personality type</li>
                        <li>✓ Perfect colour palettes for your psychology</li>
                        <li>✓ Whether you need open or intimate spaces</li>
                        <li>✓ Your ideal level of visual complexity</li>
                        <li>✓ Style directions that genuinely suit you</li>
                    </ul>
                </div>

                <p class="intro-footer">No design knowledge needed. No right or wrong answers. Just pure instinct.</p>
            </div>

            <button class="btn btn-black font-uppercase" onclick="startQuiz()">Start The Test</button>
        </div>
        <div id="quiz" class="fade-in" style="display: none;"></div>
        <div id="result-form" class="result-section" style="display: none;">
            <h2 class="thick-h2 black">Your Design Profile is Complete</h2>
            <p>Out of 6,561 possible design personalities, you have a completely unique profile that reveals exactly why certain spaces make you feel at home while others never quite feel right.</p>
            <p>We'll email you your personalised report shortly.</p>
            <div class="spacing-v"></div>
            <form id="productquiz" class="webform" action="#" method="POST" onsubmit="submitDetails(event)">
                <div class="row">
                    <div class="col col-12 col-6-mid">
                        <div class="field-block">
                            <input type="text" name="fname" placeholder="First Name" class="input-text input-lg" pattern=".{2,255}" required title="2 to 255 characters">
                        </div>
                    </div>
                    <div class="col col-12 col-6-mid">
                        <div class="field-block">
                            <input type="text" name="lname" placeholder="Last Name" class="input-text input-lg" pattern=".{2,255}" required title="2 to 255 characters">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col col-12 col-6-mid">
                        <div class="field-block">
                            <input type="tel" name="phone" placeholder="Phone Number" class="input-text" required="required">
                        </div>
                    </div>
                    <div class="col col-12 col-6-mid">
                        <div class="field-block">
                            <input type="email" name="email" placeholder="Email" class="input-text input-lg" required>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col col-12">
                        <div class="field-block">
                            <input name="gdpr" id="gdpr-signup" type="checkbox" oninvalid="this.setCustomValidity( 'You must tick the consent statement before subscribing')" oninput="this.setCustomValidity( '')" class="input-checkbox" required>
                            <label for="gdpr-signup" class="input-checkbox-label">
                                <span><a href="/privacy-policy.html" target="_blank"><u>Privacy Policy agreed</u></a> </span>
                            </label>
                        </div>
                    </div>
                    <div class="col col-12">
                        <div class="field-block mobile-show" style="flex: 1 0 auto;">
                            <input class="btn font-uppercase btn-black full-width" contenteditable="false" style="background: #18191F !important;" type="submit" value="GET IN TOUCH">
                        </div>
                    </div>
                </div>
                <input type="hidden" id="hs_google_click_id" name="hs_google_click_id" value="">
            </form>
        </div>
    </div>
</section>