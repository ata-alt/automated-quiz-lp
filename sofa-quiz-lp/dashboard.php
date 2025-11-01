<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Admin Dashboard</title>
    <link rel="stylesheet" href="../site-assets/css/dashboard.css?v=8">
    <style>
        /* Additional Mobile Responsive Styles */
        @media (max-width: 768px) {
            .modal-content {
                width: 95% !important;
                margin: 10px auto !important;
            }

            .user-info-grid {
                grid-template-columns: 1fr !important;
            }

            .answer-card {
                margin-bottom: 10px;
            }

            div[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
            }

            /* Promo Tab Mobile Styles */
            #quizPromoFeatures {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            #quizPromoFeatures>div {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;
                width: 100%;
            }

            #quizPromoFeatures input {
                flex: 1;
                min-width: 0;
            }

            #quizPromoFeatures button {
                flex-shrink: 0;
            }

            #quizPromoImages {
                grid-template-columns: repeat(2, 1fr) !important;
            }

            /* Questions Tab Mobile Styles */
            .options-grid {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
            }

            .option-header {
                flex-direction: column;
                align-items: flex-start !important;
                gap: 10px;
            }

            .option-label {
                width: 100%;
                text-align: center;
                padding: 8px 16px !important;
                font-size: 14px !important;
            }

            .option-card {
                padding: 20px !important;
            }

            /* Button Responsive Adjustments */
            .question-card button.btn {
                padding: 10px 16px !important;
                font-size: 13px !important;
            }
        }

        @media (max-width: 480px) {
            .dashboard-header h1 {
                font-size: 18px !important;
                line-height: 1.3 !important;
            }

            .tab-text {
                display: none !important;
            }

            .tab-icon {
                margin: 0 !important;
            }

            .question-card {
                padding: 15px !important;
                margin: 10px !important;
            }

            .question-card h2 {
                font-size: 20px !important;
                margin-bottom: 15px !important;
            }

            .modal-content {
                width: 100% !important;
                height: 100vh !important;
                margin: 0 !important;
                border-radius: 0 !important;
                max-height: 100vh !important;
            }

            .results-table {
                display: block;
                overflow-x: auto;
            }

            .results-table thead {
                display: none;
            }

            .results-table tr {
                display: block;
                margin-bottom: 10px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
            }

            .results-table td {
                display: block;
                padding: 8px !important;
                text-align: left;
                border: none !important;
            }

            .results-table td::before {
                content: attr(data-label);
                font-weight: bold;
                margin-right: 10px;
            }

            /* Promo Tab Mobile Styles - Small Screens */
            #quizPromoImages {
                grid-template-columns: 1fr !important;
                gap: 15px !important;
            }

            #quizPromoFeatures button.btn-danger {
                padding: 6px 10px !important;
                font-size: 11px !important;
            }

            .button-settings-grid input {
                font-size: 14px !important;
                padding: 10px !important;
            }

            /* Questions Tab Mobile Styles - Small Screens */
            .option-header {
                flex-direction: row !important;
                justify-content: space-between !important;
                align-items: center !important;
                flex-wrap: nowrap !important;
            }

            .option-label {
                font-size: 12px !important;
                padding: 6px 12px !important;
                border-radius: 50px !important;
                display: inline-flex !important;
                width: auto !important;
                flex-shrink: 0 !important;
            }

            .option-card {
                padding: 15px !important;
                border-radius: 10px !important;
            }

            .option-header .btn-danger {
                width: auto !important;
                min-width: auto !important;
                margin-top: 0 !important;
                padding: 6px 10px !important;
                font-size: 11px !important;
                flex-shrink: 0 !important;
            }

            .image-upload-area {
                min-height: 100px !important;
                padding: 10px !important;
            }

            .upload-text {
                font-size: 12px !important;
                padding: 8px 12px !important;
            }

            /* Add Question Card Mobile Styles */
            #addQuestionCard {
                padding: 20px !important;
            }

            #addQuestionCard h3 {
                font-size: 18px !important;
            }

            #addQuestionCard button {
                padding: 12px 20px !important;
                font-size: 14px !important;
                width: 100% !important;
            }

            #addQuestionCard p {
                font-size: 12px !important;
            }

            /* Promo Header Mobile */
            .promo-header {
                flex-direction: column !important;
                align-items: flex-start !important;
            }

            .btn-save-promo {
                width: 100% !important;
            }

            /* Features and Images Buttons Mobile */
            .btn-add-feature,
            .btn-add-image,
            .btn-add-point {
                width: 100% !important;
                max-width: none !important;
            }

            /* Luxury Content Showroom Points Mobile - 480px */
            .luxury-point-card {
                padding: 10px !important;
                margin-bottom: 12px !important;
                border-radius: 8px !important;
            }

            .luxury-point-header {
                gap: 8px !important;
            }

            .luxury-point-title,
            .luxury-point-description {
                font-size: 14px !important;
                padding: 8px !important;
                border-radius: 6px !important;
            }

            .luxury-point-description {
                min-height: 50px !important;
            }

            .luxury-point-delete {
                padding: 8px !important;
                font-size: 12px !important;
                border-radius: 6px !important;
            }

        }

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
            background-color: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(3px);
            animation: fadeIn 0.3s ease;
        }

        .modal-content {
            background-color: #ffffff;
            margin: 5% auto;
            padding: 0;
            border-radius: 0;
            width: 90%;
            max-width: 800px;
            max-height: 85vh;
            box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease;
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }

        .modal-header {
            background: #ffffff;
            color: #000000;
            padding: 32px 40px;
            border-bottom: 1px solid #e0e0e0;
            position: relative;
        }

        .modal-header h2 {
            margin: 0;
            font-size: 16px;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .modal-body {
            padding: 40px;
            max-height: 60vh;
            overflow-y: auto;
            background: #ffffff;
        }

        .close {
            position: absolute;
            top: 32px;
            right: 40px;
            color: #000000;
            font-size: 24px;
            font-weight: 300;
            cursor: pointer;
            opacity: 1;
            transition: all 0.2s ease;
            width: auto;
            height: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0;
        }

        .close:hover {
            opacity: 0.6;
            background: transparent;
            transform: none;
        }

        .user-info-card {
            background: #fafafa;
            border-radius: 0;
            padding: 32px;
            margin-bottom: 24px;
            box-shadow: none;
            border: 1px solid #e0e0e0;
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
            font-size: 10px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #6b6b6b;
        }

        .user-info-value {
            font-size: 14px;
            font-weight: 300;
            color: #000000;
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
            font-size: 14px;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #000000;
        }

        .answers-count {
            background: transparent;
            color: #000000;
            padding: 6px 16px;
            border-radius: 0;
            border: 1px solid #e0e0e0;
            font-size: 11px;
            font-weight: 300;
            letter-spacing: 0.1em;
        }

        .answer-card {
            background: white;
            margin-bottom: 16px;
            border-radius: 0;
            overflow: hidden;
            box-shadow: none;
            border: 1px solid #e0e0e0;
            transition: all 0.2s ease;
        }

        .answer-card:hover {
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
            transform: none;
        }

        .answer-header {
            background: #fafafa;
            padding: 20px 24px;
            border-bottom: 1px solid #e0e0e0;
        }

        .answer-question {
            font-weight: 300;
            color: #000000;
            margin: 0;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .question-number {
            background: transparent !important;
            color: #000000 !important;
            min-width: auto !important;
            height: auto !important;
            border-radius: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 11px !important;
            font-weight: 300 !important;
            flex-shrink: 0 !important;
            text-align: center !important;
            line-height: 1 !important;
            border: 1px solid #e0e0e0 !important;
            box-shadow: none !important;
            padding: 8px 16px !important;
            white-space: nowrap !important;
            text-transform: uppercase !important;
            letter-spacing: 0.15em !important;
        }

        .answer-content {
            padding: 20px;
        }

        .answer-text {
            background: #fafafa;
            color: #000000;
            padding: 16px 20px;
            border-radius: 0;
            font-weight: 300;
            margin: 0;
            border: 1px solid #e0e0e0;
            font-size: 14px;
            line-height: 1.6;
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
            width: 6px;
        }

        .modal-body::-webkit-scrollbar-track {
            background: #fafafa;
            border-radius: 0;
        }

        .modal-body::-webkit-scrollbar-thumb {
            background: #e0e0e0;
            border-radius: 0;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
            background: #6b6b6b;
        }
    </style>
</head>

<body>
    <!-- Status message outside container for fixed positioning -->
    <div class="status-message" id="statusMessage"></div>

    <div class="dashboard-container">
        <div class="dashboard-header">
            <div class="dashboard-header-content">
                <h1 id="dashboardTitle">Default Quiz Content Management Dashboard</h1>
                <div class="dashboard-header-actions">
                    <div class="quiz-selector-container">
                        <label for="productQuizSelector" class="quiz-selector-label">Current Quiz:</label>
                        <select id="productQuizSelector" onchange="switchProductQuiz(this.value)">
                            <option value="default">Default Quiz</option>
                        </select>
                        <button class="btn btn-danger" onclick="confirmDeleteProduct()" id="deleteProductBtn" style="padding: 8px 15px; display: none;">Delete</button>
                    </div>
                    <button class="btn btn-primary" onclick="openDeveloperNotesModal()"><span class="btn-text-desktop">Developer Notes</span><span class="btn-text-mobile">Docs</span></button>
                    <button class="btn btn-success btn-create-quiz" onclick="openNewProductQuizModal()"><span class="btn-text-desktop">+ Create New Product Quiz</span><span class="btn-text-mobile">+ New Quiz</span></button>
                </div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
            <div class="tab-buttons">
                <button class="tab-btn active" onclick="showTab('questions')" data-tab="questions">
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
                <button class="tab-btn" onclick="openDeveloperNotesModal()" data-tab="developer-notes">
                    <span class="tab-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                        </svg>
                    </span>
                    <span class="tab-text">Developer Notes</span>
                </button>
            </div>
            <div class="actions-bar">
                <div>
                    <span id="currentTabActions"></span>
                </div>
                <div>
                    <button class="btn btn-success" onclick="saveQuiz()">Save All Changes</button>
                    <button class="btn btn-primary" onclick="previewQuiz()">Preview</button>
                </div>
            </div>
        </div>

        <!-- Tab Content Container -->
        <div class="tab-content-container">
            <!-- Questions Tab Content -->
            <div class="tab-content active" id="questions-tab">
                <div id="questionsContainer"></div>

                <!-- Add New Question Card -->
                <div class="question-card add-question-card" id="addQuestionCard" style="background: #fafafa; border: 1px solid #e0e0e0;">
                    <div class="add-question-content" style="text-align: center; padding: 40px 20px;">
                        <h3 style="color: #000000; margin-bottom: 20px; font-weight: 300; text-transform: uppercase; letter-spacing: 0.1em; font-size: 16px;">Add New Question</h3>
                        <button class="btn btn-primary btn-add-question" onclick="addNewQuestion()" style="padding: 15px 30px; font-size: 18px;">
                            <span class="btn-text-desktop">➕ Add Question</span>
                            <span class="btn-text-mobile">➕ Add</span>
                        </button>
                        <p style="margin-top: 15px; color: #6b6b6b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Click to add a new quiz question</p>
                    </div>
                </div>
            </div>

            <!-- Quiz Results Tab Content -->
            <div class="tab-content" id="results-tab">
                <div class="question-card" style="background: white; border: 1px solid #e0e0e0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 id="resultsTabTitle" style="color: #000000; margin: 0;">Quiz Results</h2>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-primary" onclick="refreshResults()" style="padding: 8px 20px;">🔄 Refresh</button>
                            <button class="btn btn-success" onclick="exportResults()" style="padding: 8px 20px;">Export CSV</button>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="filters-container" style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                           <div>
                            <label style="font-weight: bold; margin-right: 8px;">Showing Results For:</label>
                            <input type="text" id="currentProductDisplay" readonly value="Default" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; color: #666; cursor: not-allowed; font-weight: 500;">
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

    <!-- Modal for Developer Notes -->
    <div id="developerNotesModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Widget Integration Guide</h2>
                <span class="close" onclick="closeDeveloperNotesModal()">×</span>
            </div>
            <div class="modal-body" style="max-height: 70vh;">
                <div style="background: #fafafa; padding: 24px; border-radius: 0; border: 1px solid #e0e0e0; margin-bottom: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.1em; color: #000;">Integration Code</h3>
                    <p style="margin-bottom: 12px; font-size: 13px; color: #6b6b6b; line-height: 1.6;">To integrate the quiz widget into your webpage, add the following code snippet where you want the quiz to appear:</p>
                    <div style="position: relative;">
                        <div style="background: #000; color: #10b981; padding: 16px; border-radius: 0; font-family: 'Courier New', monospace; font-size: 13px; overflow-x: auto; border: 1px solid #333;">
                            <code id="integrationCode">&lt;section class="style-quiz-widget container" data-quiz-type="<span id="quizTypeValue" style="color: #fbbf24;">table</span>"&gt; &lt;/section&gt;</code>
                        </div>
                        <button onclick="copyIntegrationCode()" class="btn btn-primary" style="position: absolute; top: 8px; right: 8px; padding: 8px 16px; font-size: 11px; display: flex; align-items: center; gap: 6px;">
                            <span id="copyIcon">📋</span>
                            <span id="copyText">Copy</span>
                        </button>
                    </div>
                </div>

                <div style="background: white; padding: 24px; border-radius: 0; border: 1px solid #e0e0e0;">
                    <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.1em; color: #000;">Available Quiz Types</h3>
                    <p style="margin-bottom: 16px; font-size: 13px; color: #6b6b6b; line-height: 1.6;">Click on any product category below to update the integration code:</p>

                    <div id="quizTypesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-top: 16px;">
                        <div class="quiz-type-item active" data-type="table" onclick="selectQuizType('table')" style="background: #000; padding: 12px 16px; border-radius: 0; border: 1px solid #000; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #fff; font-weight: 500;">table</span>
                        </div>
                        <div class="quiz-type-item" data-type="wardrobes" onclick="selectQuizType('wardrobes')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">wardrobes</span>
                        </div>
                        <div class="quiz-type-item" data-type="rugs" onclick="selectQuizType('rugs')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">rugs</span>
                        </div>
                        <div class="quiz-type-item" data-type="sofas" onclick="selectQuizType('sofas')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">sofas</span>
                        </div>
                        <div class="quiz-type-item" data-type="furniture" onclick="selectQuizType('furniture')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">furniture</span>
                        </div>
                        <div class="quiz-type-item" data-type="bedroom" onclick="selectQuizType('bedroom')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">bedroom</span>
                        </div>
                        <div class="quiz-type-item" data-type="chair" onclick="selectQuizType('chair')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">chair</span>
                        </div>
                        <div class="quiz-type-item" data-type="coffeetables" onclick="selectQuizType('coffeetables')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">coffeetables</span>
                        </div>
                        <div class="quiz-type-item" data-type="kitchen" onclick="selectQuizType('kitchen')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">kitchen</span>
                        </div>
                        <div class="quiz-type-item" data-type="tv" onclick="selectQuizType('tv')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">tv</span>
                        </div>
                        <div class="quiz-type-item" data-type="diningtable" onclick="selectQuizType('diningtable')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">diningtable</span>
                        </div>
                        <div class="quiz-type-item" data-type="storagefurniture" onclick="selectQuizType('storagefurniture')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">storagefurniture</span>
                        </div>
                        <div class="quiz-type-item" data-type="sideboard" onclick="selectQuizType('sideboard')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">sideboard</span>
                        </div>
                        <div class="quiz-type-item" data-type="barstool" onclick="selectQuizType('barstool')" style="background: #fafafa; padding: 12px 16px; border-radius: 0; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #000; font-weight: 500;">barstool</span>
                        </div>
                    </div>

                    <div style="margin-top: 24px; padding: 16px; background: #f0f9ff; border-left: 3px solid #3b82f6; border-radius: 0;">
                        <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.6;"><strong>Note:</strong> Ensure that the quiz type you select corresponds to a configured product quiz in your dashboard. The widget will dynamically load the appropriate quiz content based on the specified type.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
<script src="../api/api-client-fallback.js"></script>
<script src="../site-assets/js/dashboard-php.js?v=14"></script>
<script src="../site-assets/js/dashboard-effects.js" defer></script>
<script src="../site-assets/js/quiz-results.js?v=7" defer></script>

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
        showTab('questions');
    });

    // Developer Notes Modal Functions
    function openDeveloperNotesModal() {
        document.getElementById('developerNotesModal').style.display = 'block';
    }

    function closeDeveloperNotesModal() {
        document.getElementById('developerNotesModal').style.display = 'none';
    }

    // Select Quiz Type and Update Integration Code
    function selectQuizType(type) {
        // Update the quiz type value in the integration code
        document.getElementById('quizTypeValue').textContent = type;

        // Remove active class from all items
        const allItems = document.querySelectorAll('.quiz-type-item');
        allItems.forEach(item => {
            item.classList.remove('active');
            item.style.background = '#fafafa';
            item.style.borderColor = '#e0e0e0';
            const span = item.querySelector('span');
            if (span) span.style.color = '#000';
        });

        // Add active class to selected item
        const selectedItem = document.querySelector(`.quiz-type-item[data-type="${type}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
            selectedItem.style.background = '#000';
            selectedItem.style.borderColor = '#000';
            const span = selectedItem.querySelector('span');
            if (span) span.style.color = '#fff';
        }
    }

    // Update Developer Notes Quiz Types List
    async function updateDeveloperNotesQuizTypes() {
        try {
            const response = await apiClient.getProducts();
            const quizTypesGrid = document.getElementById('quizTypesGrid');

            if (!quizTypesGrid) return;

            // Clear existing items
            quizTypesGrid.innerHTML = '';

            // Add quiz type for each product
            response.products.forEach((product, index) => {
                const productKey = product.product_key;
                const isFirst = index === 0;

                const quizTypeItem = document.createElement('div');
                quizTypeItem.className = `quiz-type-item ${isFirst ? 'active' : ''}`;
                quizTypeItem.setAttribute('data-type', productKey);
                quizTypeItem.onclick = () => selectQuizType(productKey);
                quizTypeItem.style.background = isFirst ? '#000' : '#fafafa';
                quizTypeItem.style.padding = '12px 16px';
                quizTypeItem.style.borderRadius = '0';
                quizTypeItem.style.border = isFirst ? '1px solid #000' : '1px solid #e0e0e0';
                quizTypeItem.style.cursor = 'pointer';
                quizTypeItem.style.transition = 'all 0.3s ease';

                const span = document.createElement('span');
                span.style.fontFamily = "'Courier New', monospace";
                span.style.fontSize = '12px';
                span.style.color = isFirst ? '#fff' : '#000';
                span.style.fontWeight = '500';
                span.textContent = productKey;

                quizTypeItem.appendChild(span);
                quizTypesGrid.appendChild(quizTypeItem);
            });

            // Update the integration code to show the first product key
            if (response.products.length > 0) {
                document.getElementById('quizTypeValue').textContent = response.products[0].product_key;
            }
        } catch (error) {
            console.error('Failed to update developer notes quiz types:', error);
        }
    }

    // Override openDeveloperNotesModal to refresh quiz types
    const originalOpenDeveloperNotesModal = openDeveloperNotesModal;
    openDeveloperNotesModal = function() {
        updateDeveloperNotesQuizTypes();
        document.getElementById('developerNotesModal').style.display = 'block';
    };

    // Copy Integration Code to Clipboard
    function copyIntegrationCode() {
        const quizType = document.getElementById('quizTypeValue').textContent;
        const codeText = `<section class="style-quiz-widget container" data-quiz-type="${quizType}"> </section>`;

        navigator.clipboard.writeText(codeText).then(() => {
            // Update button to show success state
            const copyIcon = document.getElementById('copyIcon');
            const copyText = document.getElementById('copyText');

            copyIcon.textContent = '✓';
            copyText.textContent = 'Copied!';

            // Reset button after 2 seconds
            setTimeout(() => {
                copyIcon.textContent = '📋';
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard');
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('developerNotesModal');
        if (event.target === modal) {
            closeDeveloperNotesModal();
        }
    });
</script>

</html>