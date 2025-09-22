<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sofa Quiz Admin Dashboard</title>
    <link rel="stylesheet" href="../site-assets/css/dashboard.css">
    <style>
        .emoji-item {
            font-size: 24px;
            padding: 8px;
            text-align: center;
            cursor: pointer;
            border-radius: 6px;
            transition: background-color 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
        }

        .emoji-item:hover {
            background-color: #e3f2fd;
            transform: scale(1.1);
        }

        .emoji-item:active {
            background-color: #bbdefb;
        }

        #emojiPicker {
            z-index: 1000;
            position: relative;
        }
    </style>
</head>

<body>
    <div class="dashboard-container">
        <div class="dashboard-header">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <h1 id="dashboardTitle">🛋️ Sofa Quiz Content Management Dashboard</h1>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div>
                        <label for="productQuizSelector" style="margin-right: 8px; font-weight: bold;">Current Quiz:</label>
                        <select id="productQuizSelector" onchange="switchProductQuiz(this.value)" style="color: black;">
                            <option style="color: black;" value="sofa">🛋️ Sofa Quiz</option>
                        </select>
                    </div>
                    <button class="btn btn-success" onclick="openNewProductQuizModal()">+ Create New Product Quiz</button>
                </div>
            </div>
        </div>

        <div class="status-message" id="statusMessage"></div>

        <div class="actions-bar">
            <div>
                <button class="btn btn-primary" onclick="loadCurrentQuiz()">Load Current Quiz</button>
                <button class="btn btn-primary" onclick="importJSON()">Import JSON</button>
                <button class="btn btn-primary" onclick="addNewQuestion()">+ Add Question</button>
            </div>
            <div>
                <button class="btn btn-success" onclick="saveQuiz()">💾 Save All Changes</button>
                <button class="btn btn-success" onclick="exportJSON()">📥 Export JSON</button>
                <button class="btn btn-primary" onclick="previewQuiz()">👁️ Preview</button>
            </div>
        </div>

        <!-- Banner Section Editor -->
        <div class="question-card" style="background: #fff3e0; border: 2px solid #ff6f00;">
            <h2 style="color: #ff6f00; margin-bottom: 20px;">🎨 Hero Banner Section</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <label style="font-weight: bold; display: block; margin-bottom: 10px;">Main Heading:</label>
                    <input type="text"
                        id="bannerMainHeading"
                        class="question-input"
                        value="Match Your Personality To A Luxury Sofa."
                        onchange="updateBannerText('mainHeading', this.value)"
                        placeholder="Enter main heading...">

                    <label style="font-weight: bold; display: block; margin: 15px 0 10px 0;">Sub Heading:</label>
                    <input type="text"
                        id="bannerSubHeading"
                        class="question-input"
                        value="Try Our AI Tool"
                        onchange="updateBannerText('subHeading', this.value)"
                        placeholder="Enter sub heading...">
                </div>
                <div>
                    <label style="font-weight: bold; display: block; margin-bottom: 10px;">Desktop Background Image:</label>
                    <div class="image-upload-area"
                        id="banner-desktop-image"
                        style="height: 120px; margin-bottom: 15px;"
                        onclick="document.getElementById('banner-desktop-file').click()">
                        <div class="upload-text">📤 Upload Desktop Banner</div>
                    </div>
                    <input type="file" id="banner-desktop-file"
                        style="display: none;" accept="image/*"
                        onchange="handleBannerImageUpload('desktop', this)">

                    <label style="font-weight: bold; display: block; margin-bottom: 10px;">Mobile Background Image:</label>
                    <div class="image-upload-area"
                        id="banner-mobile-image"
                        style="height: 120px;"
                        onclick="document.getElementById('banner-mobile-file').click()">
                        <div class="upload-text">📱 Upload Mobile Banner</div>
                    </div>
                    <input type="file" id="banner-mobile-file"
                        style="display: none;" accept="image/*"
                        onchange="handleBannerImageUpload('mobile', this)">
                </div>
            </div>
        </div>

        <!-- Showroom Section Editor -->
        <div class="question-card" style="background: #e8f4f8; border: 2px solid #2196F3;">
            <h2 style="color: #2196F3; margin-bottom: 20px;">📸 Showroom Section</h2>
            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">Section Heading:</label>
                <input type="text"
                    id="showroomHeading"
                    class="question-input"
                    value="The largest luxury sofa showroom in London"
                    onchange="updateShowroomHeading(this.value)"
                    placeholder="Enter showroom section heading...">
            </div>
            <div>
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">Showroom Image:</label>
                <div class="image-upload-area"
                    id="showroom-image"
                    style="max-width: 600px; height: 300px; background-size: contain; background-repeat: no-repeat;"
                    onclick="document.getElementById('showroom-image-file').click()">
                    <div class="upload-text">
                        📤 Click to upload showroom image
                    </div>
                </div>
                <input type="file"
                    id="showroom-image-file"
                    style="display: none;"
                    accept="image/*"
                    onchange="handleShowroomImageUpload(this)">
            </div>
        </div>

        <!-- Luxury Sofas Content Editor - NEW SECTION -->
        <div class="question-card" style="background: #f0e6ff; border: 2px solid #6b46c1;">
            <h2 style="color: #6b46c1; margin-bottom: 20px;">✨ Luxury Sofas Content Section</h2>

            <label style="font-weight: bold; display: block; margin-bottom: 10px;">Main Title:</label>
            <input type="text"
                id="luxurySofasTitle"
                class="question-input"
                value="Luxury Sofas, Redefined"
                onchange="updateLuxurySofasContent('title', this.value)"
                placeholder="Enter main title...">

            <label style="font-weight: bold; display: block; margin-bottom: 10px;">Introduction Paragraph:</label>
            <textarea id="luxurySofasIntro"
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; min-height: 100px; margin-bottom: 15px;"
                onchange="updateLuxurySofasContent('introduction', this.value)"
                placeholder="Enter introduction paragraph...">A sofa is never just a sofa. It's where you unwind after a long day, host spirited conversations, and perhaps—if it's truly exquisite—fall hopelessly in love with your own living room. At FCI London, we don't just sell sofas; we curate spaces of sophistication, tailored to those who appreciate life's finer details.</textarea>

            <label style="font-weight: bold; display: block; margin-bottom: 10px;">Section Subtitle:</label>
            <input type="text"
                id="luxurySofasSubtitle"
                class="question-input"
                value="Why Visit Our Showroom?"
                onchange="updateLuxurySofasContent('subtitle', this.value)"
                placeholder="Enter section subtitle...">

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">Showroom Points:</label>
                <div id="luxurySofasPoints"></div>
                <button class="btn btn-primary" onclick="addLuxurySofasPoint()" style="margin-top: 10px;">+ Add Point</button>
            </div>

            <label style="font-weight: bold; display: block; margin-bottom: 10px;">Conclusion Paragraph:</label>
            <textarea id="luxurySofasConclusion"
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; min-height: 80px;"
                onchange="updateLuxurySofasContent('conclusion', this.value)"
                placeholder="Enter conclusion paragraph..."><strong>Visit Us & Experience Luxury Firsthand</strong><br>Indulgence begins with a single step—or rather, a single seat. Visit our London showroom to immerse yourself in a world of impeccable design and let us help you find the sofa you never knew you needed.</textarea>
        </div>

        <!-- Gallery Section Editor -->
        <div class="question-card" style="background: #f3e5f5; border: 2px solid #9c27b0; margin-top: 20px;">
            <h2 style="color: #9c27b0; margin-bottom: 20px;">🖼️ Gallery Section (3 Images)</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                <div id="gallery-item-0"></div>
                <div id="gallery-item-1"></div>
                <div id="gallery-item-2"></div>
            </div>
        </div>


        <!-- Design Disaster Section Editor -->
        <div class="question-card" style="background: #e3f2fd; border: 2px solid #1976d2; margin-top: 20px;">
            <h2 style="color: #1976d2; margin-bottom: 20px;">💡 Design Expert CTA Section</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <label style="font-weight: bold; display: block; margin-bottom: 10px;">Section Heading (use \n for line break):</label>
                    <textarea id="designDisasterHeading"
                        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; min-height: 80px;"
                        onchange="updateDesignDisasterText('heading', this.value)"
                        placeholder="Enter heading...">Avoid a design disaster.
Talk to an expert.</textarea>

                    <label style="font-weight: bold; display: block; margin: 15px 0 10px 0;">Button Text:</label>
                    <input type="text"
                        id="designDisasterButtonText"
                        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;"
                        value="Book now"
                        onchange="updateDesignDisasterText('buttonText', this.value)"
                        placeholder="Enter button text...">

                    <label style="font-weight: bold; display: block; margin: 15px 0 10px 0;">Button Link:</label>
                    <input type="text"
                        id="designDisasterButtonLink"
                        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;"
                        value="/book-a-showroom-visit.html"
                        onchange="updateDesignDisasterText('buttonLink', this.value)"
                        placeholder="Enter button link...">
                </div>
                <div>
                    <label style="font-weight: bold; display: block; margin-bottom: 10px;">Section Image:</label>
                    <div class="image-upload-area"
                        id="design-disaster-image"
                        style="height: 250px;"
                        onclick="document.getElementById('design-disaster-file').click()">
                        <div class="upload-text">📤 Upload Image</div>
                    </div>
                    <input type="file" id="design-disaster-file"
                        style="display: none;" accept="image/*"
                        onchange="handleDesignDisasterImageUpload(this)">
                </div>
            </div>
        </div>

        <!-- Quiz Promo Section Editor -->
        <div class="question-card" style="background: #fff8e1; border: 2px solid #ff9800; margin-top: 20px;">
            <h2 style="color: #ff9800; margin-bottom: 20px;">🎯 Quiz Promo Section</h2>
            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">Section Heading:</label>
                <input type="text"
                    id="quizPromoHeading"
                    class="question-input"
                    value="Take our lifestyle quiz & find the perfect sofa match."
                    onchange="updateQuizPromoHeading(this.value)"
                    placeholder="Enter promo section heading...">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">Features List:</label>
                <div id="quizPromoFeatures"></div>
                <button class="btn btn-primary" onclick="addQuizPromoFeature()" style="margin-top: 10px;">+ Add Feature</button>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">Button Settings:</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <input type="text"
                        id="quizPromoButtonText"
                        placeholder="Button Text"
                        value="Try our Sofa Matching Quiz"
                        onchange="updateQuizPromoButton('text', this.value)"
                        style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <input type="text"
                        id="quizPromoButtonLink"
                        placeholder="Button Link"
                        value="#sofaquiz"
                        onchange="updateQuizPromoButton('link', this.value)"
                        style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
            </div>

            <div>
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">Slider Images:</label>
                <div id="quizPromoImages" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;"></div>
                <button class="btn btn-primary" onclick="addQuizPromoImage()" style="margin-top: 10px;">+ Add Image</button>
            </div>
        </div>

        <div id="questionsContainer"></div>

        <div class="preview-section" id="previewSection" style="display: none;">
            <div class="preview-title">Preview</div>
            <div id="previewContent"></div>
        </div>
    </div>

    <!-- Modal for JSON Export/Import -->
    <div id="jsonModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">×</span>
            <h2 id="modalTitle">Quiz Data</h2>
            <div id="modalBody"></div>
        </div>
    </div>

    <!-- Modal for Creating New Product Quiz -->
    <div id="newProductModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeNewProductModal()">×</span>
            <h2>Create New Product Quiz</h2>
            <div style="margin-top: 20px;">
                <div style="margin-bottom: 20px;">
                    <label for="productName" style="display: block; margin-bottom: 8px; font-weight: bold;">Product Name:</label>
                    <input type="text" id="productName" placeholder="e.g., Wardrobes, Kitchens, Bedroom Furniture"
                        style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label for="productEmoji" style="display: block; margin-bottom: 8px; font-weight: bold;">Product Emoji:</label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="text" id="productEmoji" placeholder="Click to select emoji"
                            style="width: 80px; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 24px; text-align: center; cursor: pointer;"
                            readonly onclick="toggleEmojiPicker()">
                        <button type="button" onclick="toggleEmojiPicker()"
                            style="padding: 12px 16px; border: 1px solid #ddd; border-radius: 5px; background: #f5f5f5; cursor: pointer;">
                            Choose Emoji
                        </button>
                    </div>
                    <div id="emojiPicker" style="display: none; margin-top: 10px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-height: 200px; overflow-y: auto;">
                        <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px;">
                            <!-- Product/Object Emojis -->
                            <div class="emoji-item" onclick="selectEmoji('🛋️')" title="Sofa">🛋️</div>
                            <div class="emoji-item" onclick="selectEmoji('🛏️')" title="Bed">🛏️</div>
                            <div class="emoji-item" onclick="selectEmoji('🪑')" title="Chair">🪑</div>
                            <div class="emoji-item" onclick="selectEmoji('🚪')" title="Door">🚪</div>
                            <div class="emoji-item" onclick="selectEmoji('🪟')" title="Window">🪟</div>
                            <div class="emoji-item" onclick="selectEmoji('🍳')" title="Kitchen">🍳</div>
                            <div class="emoji-item" onclick="selectEmoji('🔥')" title="Fireplace">🔥</div>
                            <div class="emoji-item" onclick="selectEmoji('💡')" title="Lighting">💡</div>

                            <!-- Fashion/Clothing -->
                            <div class="emoji-item" onclick="selectEmoji('👗')" title="Dress/Clothing">👗</div>
                            <div class="emoji-item" onclick="selectEmoji('👔')" title="Suit/Formal">👔</div>
                            <div class="emoji-item" onclick="selectEmoji('👕')" title="T-shirt">👕</div>
                            <div class="emoji-item" onclick="selectEmoji('👖')" title="Jeans">👖</div>
                            <div class="emoji-item" onclick="selectEmoji('👠')" title="Shoes">👠</div>
                            <div class="emoji-item" onclick="selectEmoji('👜')" title="Handbag">👜</div>
                            <div class="emoji-item" onclick="selectEmoji('⌚')" title="Watch">⌚</div>
                            <div class="emoji-item" onclick="selectEmoji('💍')" title="Jewelry">💍</div>

                            <!-- Home & Garden -->
                            <div class="emoji-item" onclick="selectEmoji('🏠')" title="Home">🏠</div>
                            <div class="emoji-item" onclick="selectEmoji('🏡')" title="House">🏡</div>
                            <div class="emoji-item" onclick="selectEmoji('🛠️')" title="Tools">🛠️</div>
                            <div class="emoji-item" onclick="selectEmoji('🔨')" title="Hammer">🔨</div>
                            <div class="emoji-item" onclick="selectEmoji('🪴')" title="Plant">🪴</div>
                            <div class="emoji-item" onclick="selectEmoji('🌱')" title="Garden">🌱</div>
                            <div class="emoji-item" onclick="selectEmoji('🪣')" title="Bucket">🪣</div>
                            <div class="emoji-item" onclick="selectEmoji('🧽')" title="Cleaning">🧽</div>

                            <!-- Electronics & Tech -->
                            <div class="emoji-item" onclick="selectEmoji('📱')" title="Phone">📱</div>
                            <div class="emoji-item" onclick="selectEmoji('💻')" title="Laptop">💻</div>
                            <div class="emoji-item" onclick="selectEmoji('📺')" title="TV">📺</div>
                            <div class="emoji-item" onclick="selectEmoji('🎮')" title="Gaming">🎮</div>
                            <div class="emoji-item" onclick="selectEmoji('📷')" title="Camera">📷</div>
                            <div class="emoji-item" onclick="selectEmoji('🎧')" title="Headphones">🎧</div>
                            <div class="emoji-item" onclick="selectEmoji('⌨️')" title="Keyboard">⌨️</div>
                            <div class="emoji-item" onclick="selectEmoji('🖥️')" title="Computer">🖥️</div>

                            <!-- Food & Kitchen -->
                            <div class="emoji-item" onclick="selectEmoji('🍽️')" title="Dining">🍽️</div>
                            <div class="emoji-item" onclick="selectEmoji('🥄')" title="Spoon">🥄</div>
                            <div class="emoji-item" onclick="selectEmoji('🍴')" title="Fork/Knife">🍴</div>
                            <div class="emoji-item" onclick="selectEmoji('🥢')" title="Chopsticks">🥢</div>
                            <div class="emoji-item" onclick="selectEmoji('☕')" title="Coffee">☕</div>
                            <div class="emoji-item" onclick="selectEmoji('🍵')" title="Tea">🍵</div>
                            <div class="emoji-item" onclick="selectEmoji('🧊')" title="Ice">🧊</div>
                            <div class="emoji-item" onclick="selectEmoji('🥘')" title="Cooking">🥘</div>

                            <!-- Sports & Fitness -->
                            <div class="emoji-item" onclick="selectEmoji('⚽')" title="Soccer">⚽</div>
                            <div class="emoji-item" onclick="selectEmoji('🏀')" title="Basketball">🏀</div>
                            <div class="emoji-item" onclick="selectEmoji('🎾')" title="Tennis">🎾</div>
                            <div class="emoji-item" onclick="selectEmoji('🏋️')" title="Gym">🏋️</div>
                            <div class="emoji-item" onclick="selectEmoji('🧘')" title="Yoga">🧘</div>
                            <div class="emoji-item" onclick="selectEmoji('🏃')" title="Running">🏃</div>
                            <div class="emoji-item" onclick="selectEmoji('🚴')" title="Cycling">🚴</div>
                            <div class="emoji-item" onclick="selectEmoji('🏊')" title="Swimming">🏊</div>

                            <!-- General Items -->
                            <div class="emoji-item" onclick="selectEmoji('📦')" title="Package">📦</div>
                            <div class="emoji-item" onclick="selectEmoji('🎁')" title="Gift">🎁</div>
                            <div class="emoji-item" onclick="selectEmoji('💎')" title="Jewelry">💎</div>
                            <div class="emoji-item" onclick="selectEmoji('🧸')" title="Toy">🧸</div>
                            <div class="emoji-item" onclick="selectEmoji('📚')" title="Books">📚</div>
                            <div class="emoji-item" onclick="selectEmoji('🎨')" title="Art">🎨</div>
                            <div class="emoji-item" onclick="selectEmoji('🎵')" title="Music">🎵</div>
                            <div class="emoji-item" onclick="selectEmoji('✨')" title="Sparkles">✨</div>
                        </div>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <label for="productDescription" style="display: block; margin-bottom: 8px; font-weight: bold;">Description (Optional):</label>
                    <textarea id="productDescription" placeholder="Brief description of this product quiz"
                        style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; min-height: 80px; resize: vertical;"></textarea>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 30px;">
                    <button class="btn" onclick="closeNewProductModal()" style="background: #ccc; color: #333;">Cancel</button>
                    <button class="btn btn-success" onclick="createNewProductQuiz()">Create Quiz</button>
                </div>
            </div>
        </div>
    </div>
</body>
<script src="../api/api-client-fallback.js"></script>
<script src="../site-assets/js/dashboard-php.js"></script>
<script src="../site-assets/js/dashboard-effects.js" defer></script>

<script>
// Emoji Picker Functions
function toggleEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    if (picker.style.display === 'none' || picker.style.display === '') {
        picker.style.display = 'block';

        // Close picker when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeEmojiPickerOnOutsideClick);
        }, 100);
    } else {
        picker.style.display = 'none';
        document.removeEventListener('click', closeEmojiPickerOnOutsideClick);
    }
}

function selectEmoji(emoji) {
    const emojiInput = document.getElementById('productEmoji');
    emojiInput.value = emoji;

    // Hide the picker
    document.getElementById('emojiPicker').style.display = 'none';
    document.removeEventListener('click', closeEmojiPickerOnOutsideClick);

    // Show visual feedback
    emojiInput.style.backgroundColor = '#e8f5e8';
    setTimeout(() => {
        emojiInput.style.backgroundColor = '';
    }, 500);
}

function closeEmojiPickerOnOutsideClick(event) {
    const picker = document.getElementById('emojiPicker');
    const emojiInput = document.getElementById('productEmoji');
    const chooseButton = event.target.closest('button');

    // Don't close if clicking on the picker itself, the input, or the choose button
    if (!picker.contains(event.target) &&
        event.target !== emojiInput &&
        !(chooseButton && chooseButton.textContent.includes('Choose Emoji'))) {
        picker.style.display = 'none';
        document.removeEventListener('click', closeEmojiPickerOnOutsideClick);
    }
}

// Close picker with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const picker = document.getElementById('emojiPicker');
        if (picker.style.display === 'block') {
            picker.style.display = 'none';
            document.removeEventListener('click', closeEmojiPickerOnOutsideClick);
        }
    }
});
</script>

</html>