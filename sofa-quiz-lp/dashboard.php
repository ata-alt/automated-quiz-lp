<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Admin Dashboard</title>
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
    <!-- Status message outside container for fixed positioning -->
    <div class="status-message" id="statusMessage"></div>

    <div class="dashboard-container">
        <div class="dashboard-header">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <h1 id="dashboardTitle">🛋️ Sofa Quiz Content Management Dashboard</h1>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <label for="productQuizSelector" style="margin-right: 8px; font-weight: bold;">Current Quiz:</label>
                        <select id="productQuizSelector" onchange="switchProductQuiz(this.value)" style="color: black;">
                            <option style="color: black;" value="sofa">🛋️ Sofa Quiz</option>
                        </select>
                        <button class="btn btn-danger" onclick="confirmDeleteProduct()" id="deleteProductBtn" style="padding: 8px 15px; display: none;">🗑️ Delete</button>
                    </div>
                    <button class="btn btn-success" onclick="openNewProductQuizModal()">+ Create New Product Quiz</button>
                </div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
            <div class="tab-buttons">
                <button class="tab-btn active" onclick="showTab('banner')" data-tab="banner">
                    <span class="tab-icon">🎨</span>
                    <span class="tab-text">Hero Banner</span>
                </button>
                <button class="tab-btn" onclick="showTab('content')" data-tab="content">
                    <span class="tab-icon">✨</span>
                    <span class="tab-text">Luxury Content</span>
                </button>
                <button class="tab-btn" onclick="showTab('gallery')" data-tab="gallery">
                    <span class="tab-icon">🖼️</span>
                    <span class="tab-text">Gallery</span>
                </button>
                <button class="tab-btn" onclick="showTab('promo')" data-tab="promo">
                    <span class="tab-icon">🎯</span>
                    <span class="tab-text">Quiz Promo</span>
                </button>
                <button class="tab-btn" onclick="showTab('questions')" data-tab="questions">
                    <span class="tab-icon">❓</span>
                    <span class="tab-text">Questions</span>
                </button>
            </div>
            <div class="actions-bar">
                <div>
                    <span id="currentTabActions"></span>
                </div>
                <div>
                    <button class="btn btn-success" onclick="saveQuiz()">💾 Save All Changes</button>
                    <button class="btn btn-primary" onclick="previewQuiz()">👁️ Preview</button>
                </div>
            </div>
        </div>

        <!-- Tab Content Container -->
        <div class="tab-content-container">

            <!-- Banner Tab Content -->
            <div class="tab-content active" id="banner-tab">
                <div class="question-card" style="background: #fff3e0; border: 2px solid #ff6f00;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="color: #ff6f00; margin: 0;">🎨 Hero Banner Section</h2>
                        <button class="btn btn-success" onclick="saveBannerSection()" style="padding: 8px 20px;">💾 Save Banner</button>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="font-weight: bold; display: block; margin-bottom: 10px;">Main Heading:</label>
                            <input type="text"
                                id="bannerMainHeading"
                                class="question-input"
                                value=""
                                onchange="updateBannerText('mainHeading', this.value)"
                                placeholder="Type your main heading here...">

                            <label style="font-weight: bold; display: block; margin: 15px 0 10px 0;">Sub Heading:</label>
                            <input type="text"
                                id="bannerSubHeading"
                                class="question-input"
                                value=""
                                onchange="updateBannerText('subHeading', this.value)"
                                placeholder="Type your sub heading here...">
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
            </div>

            <!-- Luxury Content Tab Content -->
            <div class="tab-content" id="content-tab">
                <div class="question-card" style="background: #f0e6ff; border: 2px solid #6b46c1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="color: #6b46c1; margin: 0;">✨ Luxury Sofas Content Section</h2>
                        <button class="btn btn-success" onclick="saveLuxurySofasSection()" style="padding: 8px 20px;">💾 Save Content</button>
                    </div>

                    <label style="font-weight: bold; display: block; margin-bottom: 10px;">Main Title:</label>
                    <input type="text"
                        id="luxurySofasTitle"
                        class="question-input"
                        value=""
                        onchange="updateLuxurySofasContent('title', this.value)"
                        placeholder="Type your main title here...">

                    <label style="font-weight: bold; display: block; margin-bottom: 10px;">Introduction Paragraph:</label>
                    <textarea id="luxurySofasIntro"
                        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; min-height: 100px; margin-bottom: 15px;"
                        onchange="updateLuxurySofasContent('introduction', this.value)"
                        placeholder="Enter introduction paragraph describing your luxury products..."></textarea>

                    <label style="font-weight: bold; display: block; margin-bottom: 10px;">Section Subtitle:</label>
                    <input type="text"
                        id="luxurySofasSubtitle"
                        class="question-input"
                        value=""
                        onchange="updateLuxurySofasContent('subtitle', this.value)"
                        placeholder="Type your section subtitle here...">

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 10px;">Showroom Points:</label>
                        <div id="luxurySofasPoints"></div>
                        <button class="btn btn-primary" onclick="addLuxurySofasPoint()" style="margin-top: 10px;">+ Add Point</button>
                    </div>

                    <label style="font-weight: bold; display: block; margin-bottom: 10px;">Conclusion Paragraph:</label>
                    <textarea id="luxurySofasConclusion"
                        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; min-height: 80px;"
                        onchange="updateLuxurySofasContent('conclusion', this.value)"
                        placeholder="Type your conclusion paragraph here..."></textarea>
                </div>
            </div>

            <!-- Gallery Tab Content -->
            <div class="tab-content" id="gallery-tab">
                <div class="question-card" style="background: #f3e5f5; border: 2px solid #9c27b0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="color: #9c27b0; margin: 0;">🖼️ Gallery Section (3 Images)</h2>
                        <button class="btn btn-success" onclick="saveGallerySection()" style="padding: 8px 20px;">💾 Save Gallery</button>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                        <div id="gallery-item-0"></div>
                        <div id="gallery-item-1"></div>
                        <div id="gallery-item-2"></div>
                    </div>
                </div>
            </div>
            <!-- Promo Tab Content -->
            <div class="tab-content" id="promo-tab">
                <div class="question-card" style="background: #fff8e1; border: 2px solid #ff9800;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="color: #ff9800; margin: 0;">🎯 Quiz Promo Section</h2>
                        <button class="btn btn-success" onclick="saveQuizPromoSection()" style="padding: 8px 20px;">💾 Save Promo</button>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 10px;">Section Heading:</label>
                        <input type="text"
                            id="quizPromoHeading"
                            class="question-input"
                            value=""
                            onchange="updateQuizPromoHeading(this.value)"
                            placeholder="Type your section heading here...">
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
                                placeholder="Try our Matching Quiz"
                                value=""
                                onchange="updateQuizPromoButton('text', this.value)"
                                style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <input type="text"
                                id="quizPromoButtonLink"
                                placeholder="#quiz"
                                value=""
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
            </div>

            <!-- Questions Tab Content -->
            <div class="tab-content" id="questions-tab">
                <div id="questionsContainer"></div>

                <!-- Add New Question Card -->
                <div class="question-card" id="addQuestionCard" style="background: #e8f5e9; border: 2px solid #4caf50;">
                    <div style="text-align: center; padding: 40px 20px;">
                        <h3 style="color: #4caf50; margin-bottom: 20px;">Add New Question</h3>
                        <button class="btn btn-primary" onclick="addNewQuestion()" style="padding: 15px 30px; font-size: 18px;">
                            ➕ Add Question
                        </button>
                        <p style="margin-top: 15px; color: #666;">Click to add a new quiz question</p>
                    </div>
                </div>
            </div>

        </div> <!-- End tab-content-container -->

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

    // Tab Management Functions
    function showTab(tabName) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tab buttons
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Add active class to clicked tab button
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update current tab actions (if needed)
        updateTabActions(tabName);
    }

    function updateTabActions(tabName) {
        const actionsContainer = document.getElementById('currentTabActions');
        if (!actionsContainer) return;

        // Clear current actions
        actionsContainer.innerHTML = '';

        // Add specific actions based on tab
        switch (tabName) {
            case 'banner':
                actionsContainer.innerHTML = '<button class="btn btn-info" onclick="saveBannerSection()">💾 Save Banner</button>';
                break;
            case 'content':
                actionsContainer.innerHTML = '<button class="btn btn-info" onclick="saveLuxurySofasSection()">💾 Save Content</button>';
                break;
            case 'gallery':
                actionsContainer.innerHTML = '<button class="btn btn-info" onclick="saveGallerySection()">💾 Save Gallery</button>';
                break;
            case 'promo':
                actionsContainer.innerHTML = '<button class="btn btn-info" onclick="saveQuizPromoSection()">💾 Save Promo</button>';
                break;
            case 'questions':
                actionsContainer.innerHTML = '<button class="btn btn-primary" onclick="addNewQuestion()">➕ Add Question</button>';
                break;
        }
    }

    // Initialize first tab on page load
    document.addEventListener('DOMContentLoaded', function() {
        showTab('banner');
    });
</script>

</html>