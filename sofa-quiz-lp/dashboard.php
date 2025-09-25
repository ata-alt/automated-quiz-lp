<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Admin Dashboard</title>
    <link rel="stylesheet" href="../site-assets/css/dashboard.css?v=2">
    <style>

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        .results-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        .results-table th {
            background: #f8fafc;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #e2e8f0;
            color: #374151;
        }

        .results-table td {
            padding: 12px 8px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }

        .results-table tbody tr:hover {
            background: #f8fafc;
        }

        .pagination-btn {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            background: white;
            color: #374151;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .pagination-btn:hover {
            background: #f3f4f6;
        }

        .pagination-btn.active {
            background: #2563eb;
            color: white;
            border-color: #2563eb;
        }

        .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Enhanced Modal Styling */
        .modal {
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            animation: fadeIn 0.3s ease;
        }

        .modal-content {
            background-color: #ffffff;
            margin: 5% auto;
            padding: 0;
            border-radius: 16px;
            width: 90%;
            max-width: 800px;
            max-height: 85vh;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            animation: slideIn 0.3s ease;
            overflow: hidden;
        }

        .modal-header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            padding: 24px 32px;
            border-bottom: none;
            position: relative;
        }

        .modal-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .modal-body {
            padding: 32px;
            max-height: 60vh;
            overflow-y: auto;
            background: #fafbff;
        }

        .close {
            position: absolute;
            top: 20px;
            right: 24px;
            color: white;
            font-size: 28px;
            font-weight: 300;
            cursor: pointer;
            opacity: 0.8;
            transition: all 0.2s ease;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        .close:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
            transform: rotate(90deg);
        }

        .user-info-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #2563eb;
        }

        .user-info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-top: 16px;
        }

        .user-info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .user-info-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
        }

        .user-info-value {
            font-size: 16px;
            font-weight: 500;
            color: #111827;
        }

        .answers-section {
            margin-top: 8px;
        }

        .answers-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e5e7eb;
        }

        .answers-header h4 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #111827;
        }

        .answers-count {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .answer-card {
            background: white;
            margin-bottom: 16px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            transition: all 0.2s ease;
        }

        .answer-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }

        .answer-header {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 16px 20px;
            border-bottom: 1px solid #e5e7eb;
        }

        .answer-question {
            font-weight: 600;
            color: #374151;
            margin: 0;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .question-number {
            background: #005743 !important;
            color: #ffffff !important;
            min-width: 120px !important;
            height: 40px !important;
            border-radius: 100px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            flex-shrink: 0 !important;
            text-align: center !important;
            line-height: 1 !important;
            border: 2px solid #ffffff !important;
            box-shadow: 0px 4px 6px -1px rgba(0, 87, 67, 0.1) !important;
            padding: 0 16px !important;
            white-space: nowrap !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
        }

        .answer-content {
            padding: 20px;
        }

        .answer-text {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            color: #1e40af;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 500;
            margin: 0;
            border-left: 4px solid #2563eb;
        }

        .no-answers {
            text-align: center;
            padding: 48px 24px;
            color: #6b7280;
        }

        .no-answers-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        /* Custom scrollbar for modal body */
        .modal-body::-webkit-scrollbar {
            width: 8px;
        }

        .modal-body::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
        }

        .modal-body::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    </style>
</head>

<body>
    <!-- Status message outside container for fixed positioning -->
    <div class="status-message" id="statusMessage"></div>

    <div class="dashboard-container">
        <div class="dashboard-header">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <h1 id="dashboardTitle">Sofa Quiz Content Management Dashboard</h1>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <label for="productQuizSelector" style="margin-right: 8px; font-weight: bold;">Current Quiz:</label>
                        <select id="productQuizSelector" onchange="switchProductQuiz(this.value)" style="color: black;">
                            <option style="color: black;" value="sofa">Sofa Quiz</option>
                        </select>
                        <button class="btn btn-danger" onclick="confirmDeleteProduct()" id="deleteProductBtn" style="padding: 8px 15px; display: none;">Delete</button>
                    </div>
                    <button class="btn btn-success" onclick="openNewProductQuizModal()">+ Create New Product Quiz</button>
                </div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
            <div class="tab-buttons">
                <button class="tab-btn active" onclick="showTab('banner')" data-tab="banner">
                    <span class="tab-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd" d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.208.688a1.857 1.857 0 011.792 1.792c.452 2.668.688 5.41.688 8.208 0 2.797-.236 5.54-.688 8.208a1.857 1.857 0 01-1.792 1.792 49.069 49.069 0 01-8.208.688 49.069 49.069 0 01-8.208-.688 1.857 1.857 0 01-1.792-1.792A49.069 49.069 0 012.25 12c0-2.797.236-5.54.688-8.208A1.857 1.857 0 013.792 2.938zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm3 2.25a.75.75 0 100-1.5.75.75 0 000 1.5zm-6 0a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
                        </svg>
                    </span>
                    <span class="tab-text">Hero Banner</span>
                </button>
                <button class="tab-btn" onclick="showTab('content')" data-tab="content">
                    <span class="tab-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clip-rule="evenodd" />
                        </svg>
                    </span>
                    <span class="tab-text">Luxury Content</span>
                </button>
                <button class="tab-btn" onclick="showTab('gallery')" data-tab="gallery">
                    <span class="tab-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                        </svg>
                    </span>
                    <span class="tab-text">Gallery</span>
                </button>
                <button class="tab-btn" onclick="showTab('promo')" data-tab="promo">
                    <span class="tab-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    </span>
                    <span class="tab-text">Quiz Promo</span>
                </button>
                <button class="tab-btn" onclick="showTab('questions')" data-tab="questions">
                    <span class="tab-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clip-rule="evenodd" />
                        </svg>
                    </span>
                    <span class="tab-text">Questions</span>
                </button>
                <button class="tab-btn" onclick="showTab('results')" data-tab="results">
                    <span class="tab-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v.756a49.106 49.106 0 019.152 1 .75.75 0 01-.152 1.485h-1.918l2.474 10.124a.75.75 0 01-.375.84A6.723 6.723 0 0118.75 18a6.723 6.723 0 01-3.181-.795.75.75 0 01-.375-.84l2.474-10.124H12.75v13.28c1.293.076 2.534.343 3.697.776a.75.75 0 01-.262 1.453h-8.37a.75.75 0 01-.262-1.453c1.162-.433 2.404-.7 3.697-.775V6.24H6.332l2.474 10.124a.75.75 0 01-.375.84A6.723 6.723 0 015.25 18a6.723 6.723 0 01-3.181-.795.75.75 0 01-.375-.84L4.168 6.241H2.25a.75.75 0 01-.152-1.485 49.105 49.105 0 019.152-1V3a.75.75 0 01.75-.75zm4.878 13.543l1.872-7.662 1.872 7.662h-3.744zm-9.756 0L5.25 8.131l-1.872 7.662h3.744z" clip-rule="evenodd" />
                        </svg>
                    </span>
                    <span class="tab-text">Quiz Results</span>
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
                        <h2 id="bannerTabTitle" style="color: #ff6f00; margin: 0;">Sofa Hero Banner</h2>
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
                        <h2 id="contentTabTitle" style="color: #6b46c1; margin: 0;">Sofa Luxury Content</h2>
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
                        <h2 id="galleryTabTitle" style="color: #9c27b0; margin: 0;">Sofa Gallery (3 Images)</h2>
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
                        <h2 id="promoTabTitle" style="color: #ff9800; margin: 0;">Sofa Quiz Promo</h2>
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

            <!-- Quiz Results Tab Content -->
            <div class="tab-content" id="results-tab">
                <div class="question-card" style="background: #f0f4ff; border: 2px solid #2563eb;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 id="resultsTabTitle" style="color: #2563eb; margin: 0;">Quiz Results</h2>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-primary" onclick="refreshResults()" style="padding: 8px 20px;">🔄 Refresh</button>
                            <button class="btn btn-success" onclick="exportResults()" style="padding: 8px 20px;">Export CSV</button>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                        <div>
                            <label style="font-weight: bold; margin-right: 8px;">Filter by Product:</label>
                            <select id="productFilter" onchange="filterResults()" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="">All Products</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-weight: bold; margin-right: 8px;">Results per page:</label>
                            <select id="resultsPerPage" onchange="changeResultsPerPage()" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="10">10</option>
                                <option value="25" selected>25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div>
                            <span id="resultsCount" style="color: #666; font-weight: bold;"></span>
                        </div>
                    </div>

                    <!-- Results Table -->
                    <div id="resultsContainer" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div id="loadingResults" style="text-align: center; padding: 40px;">
                            <div style="display: inline-block; animation: spin 1s linear infinite; font-size: 24px;">⏳</div>
                            <p>Loading quiz results...</p>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div id="paginationContainer" style="display: flex; justify-content: center; margin-top: 20px; gap: 10px;">
                        <!-- Pagination buttons will be inserted here -->
                    </div>
                </div>
            </div>

        </div> <!-- End tab-content-container -->

    </div>

    <!-- Modal for JSON Export/Import -->
    <div id="jsonModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <span class="close" onclick="closeModal()">×</span>
                <h2 id="modalTitle">Quiz Data</h2>
            </div>
            <div class="modal-body" id="modalBody"></div>
        </div>
    </div>

    <!-- Modal for Creating New Product Quiz -->
    <div id="newProductModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Create New Product Quiz</h2>
                <span class="close" onclick="closeNewProductModal()">×</span>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <label for="productName" style="display: block; margin-bottom: 8px; font-weight: bold;">Product Name:</label>
                    <input type="text" id="productName" placeholder="e.g., Wardrobes, Kitchens, Bedroom Furniture"
                        style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;">
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
<script src="../site-assets/js/quiz-results.js" defer></script>

<script>

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
            case 'results':
                actionsContainer.innerHTML = '<button class="btn btn-primary" onclick="refreshResults()">🔄 Refresh</button>';
                break;
        }
    }

    // Initialize first tab on page load
    document.addEventListener('DOMContentLoaded', function() {
        showTab('banner');
    });
</script>

</html>