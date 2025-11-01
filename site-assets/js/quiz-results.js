// Quiz Results Management
let currentPage = 0;
let currentLimit = 10;
let currentFilter = '';
let totalResults = 0;
let allResults = [];

// Initialize results when tab is shown
function initializeResults() {
  console.log('[Results] Initializing quiz results...');

  // Auto-filter by current product - ALWAYS filter by current product
  const currentProduct = window.currentProductKey || 'default';
  console.log('[Results] Current product key:', currentProduct);

  // Update the product display badge
  updateProductDisplay(currentProduct);

  // Load results with current product filter (always filter by current product)
  loadResults(0, currentLimit, currentProduct);
}

// Load quiz results from API
async function loadResults(
  page = 0,
  limit = currentLimit,
  productFilter = currentFilter
) {
  try {
    console.log('[Results] Loading results...', { page, limit, productFilter });

    const params = new URLSearchParams({
      limit: limit,
      offset: page * limit,
      _t: Date.now() // Cache busting timestamp
    });

    if (productFilter) {
      params.append('product_key', productFilter);
    }

    const response = await fetch(`../api/quiz-results.php?${params}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    const data = await response.json();

    if (data.success) {
      allResults = data.results;
      totalResults = data.pagination.total;
      currentPage = page;
      currentLimit = limit;
      currentFilter = productFilter;

      renderResults(data.results);
      renderPagination(data.pagination);
      updateResultsCount(data.pagination);

      console.log(
        '[Results] Results loaded successfully:',
        data.results.length,
        'results'
      );
    } else {
      throw new Error(data.error || 'Failed to load results');
    }
  } catch (error) {
    console.error('[Results] Error loading results:', error);
    showError('Failed to load quiz results: ' + error.message);
  }
}

// Render results table
function renderResults(results) {
  const container = document.getElementById('resultsContainer');

  if (!results || results.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 10px;">📝</div>
                <h3>No quiz results found</h3>
                <p>No one has submitted the quiz yet${
                  currentFilter ? ' for the selected product' : ''
                }.</p>
            </div>
        `;
    return;
  }

  let tableHTML = `
        <table class="results-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Product</th>
                    <th>Submitted</th>
                    <th>Answers</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

  results.forEach((result) => {
    const submittedDate = new Date(result.created_at).toLocaleString();
    const answersCount = result.quiz_answers ? result.quiz_answers.length : 0;

    tableHTML += `
            <tr>
                <td><strong>#${result.id}</strong></td>
                <td>${escapeHtml(result.name)}</td>
                <td><a href="mailto:${escapeHtml(result.email)}">${escapeHtml(
      result.email
    )}</a></td>
                <td>${result.phone ? escapeHtml(result.phone) : '-'}</td>
                <td>${
                  result.product_key ? escapeHtml(result.product_key) : '-'
                }</td>
                <td><small>${submittedDate}</small></td>
                <td><span style="background: #e0f2fe; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${answersCount} answers</span></td>
                <td>
                    <button class="btn btn-sm" onclick="viewAnswers(${
                      result.id
                    })" style="padding: 4px 8px; font-size: 12px;">👁️ View</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteResult(${
                      result.id
                    })" style="padding: 4px 8px; font-size: 12px; margin-left: 5px;">🗑️</button>
                </td>
            </tr>
        `;
  });

  tableHTML += `
            </tbody>
        </table>
    `;

  container.innerHTML = tableHTML;
}

// Render pagination
function renderPagination(pagination) {
  const container = document.getElementById('paginationContainer');
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let paginationHTML = '';

  // Previous button
  paginationHTML += `
        <button class="pagination-btn"
                onclick="loadResults(${currentPage - 1})"
                ${currentPage === 0 ? 'disabled' : ''}>
            ← Previous
        </button>
    `;

  // Page numbers
  const startPage = Math.max(0, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);

  if (startPage > 0) {
    paginationHTML += `<button class="pagination-btn" onclick="loadResults(0)">1</button>`;
    if (startPage > 1) {
      paginationHTML += `<span style="padding: 8px;">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}"
                    onclick="loadResults(${i})">
                ${i + 1}
            </button>
        `;
  }

  if (endPage < totalPages - 1) {
    if (endPage < totalPages - 2) {
      paginationHTML += `<span style="padding: 8px;">...</span>`;
    }
    paginationHTML += `<button class="pagination-btn" onclick="loadResults(${
      totalPages - 1
    })">${totalPages}</button>`;
  }

  // Next button
  paginationHTML += `
        <button class="pagination-btn"
                onclick="loadResults(${currentPage + 1})"
                ${currentPage >= totalPages - 1 ? 'disabled' : ''}>
            Next →
        </button>
    `;

  container.innerHTML = paginationHTML;
}

// Update results count display
function updateResultsCount(pagination) {
  const countElement = document.getElementById('resultsCount');
  const start = pagination.offset + 1;
  const end = Math.min(pagination.offset + pagination.limit, pagination.total);

  countElement.textContent = `Showing ${start}-${end} of ${pagination.total} results`;
}

// Update the product display text field
function updateProductDisplay(productKey) {
  const displayElement = document.getElementById('currentProductDisplay');
  if (displayElement) {
    // Capitalize product name for display
    const displayName = productKey.charAt(0).toUpperCase() + productKey.slice(1);
    displayElement.value = displayName;
  }
}

// Filter results by product (now uses current product automatically)
function filterResults() {
  // Always use the current product as filter
  const currentProduct = window.currentProductKey || 'default';
  loadResults(0, currentLimit, currentProduct);
}

// Change results per page
function changeResultsPerPage() {
  const limit = parseInt(document.getElementById('resultsPerPage').value);
  // Always use current product as filter
  const currentProduct = window.currentProductKey || 'default';
  loadResults(0, limit, currentProduct);
}

// Refresh results
function refreshResults() {
  console.log('[Results] Refreshing results...');
  // Always use current product as filter
  const currentProduct = window.currentProductKey || 'default';
  loadResults(currentPage, currentLimit, currentProduct);
}

// View detailed answers for a result
function viewAnswers(resultId) {
  const result = allResults.find((r) => r.id == resultId);
  if (!result) {
    alert('Result not found');
    return;
  }

  const submittedDate = new Date(result.created_at);
  const formatDate = submittedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formatTime = submittedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let answersHTML = `
        <div class="user-info-card">
            <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                <span style="background: #2563eb; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600;">#${
                  result.id
                }</span>
                Submission Details
            </h3>
            <div class="user-info-grid">
                <div class="user-info-item">
                    <span class="user-info-label">👤 Full Name</span>
                    <span class="user-info-value">${escapeHtml(
                      result.name
                    )}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">✉️ Email Address</span>
                    <span class="user-info-value">
                        <a href="mailto:${escapeHtml(
                          result.email
                        )}" style="color: #2563eb; text-decoration: none;">
                            ${escapeHtml(result.email)}
                        </a>
                    </span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">📱 Phone Number</span>
                    <span class="user-info-value">${
                      result.phone ? escapeHtml(result.phone) : 'Not provided'
                    }</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">🛋️ Product Interest</span>
                    <span class="user-info-value">
                        ${
                          result.product_key
                            ? `<span style="background: #f3f4f6; padding: 4px 8px; border-radius: 6px; font-size: 14px;">${escapeHtml(
                                result.product_key
                              )}</span>`
                            : 'Not specified'
                        }
                    </span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">📅 Submission Date</span>
                    <span class="user-info-value">${formatDate}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">🕒 Submission Time</span>
                    <span class="user-info-value">${formatTime}</span>
                </div>
            </div>
        </div>

        <div class="answers-section">
    `;

  if (result.quiz_answers && result.quiz_answers.length > 0) {
    answersHTML += `
            <div class="answers-header">
                <h4>💬 Quiz Responses</h4>
                <span class="answers-count">${result.quiz_answers.length} answers</span>
            </div>
        `;

    result.quiz_answers.forEach((answer, index) => {
      answersHTML += `
                <div class="answer-card">
                    <div class="answer-header">
                        <div class="answer-question">
                            <span class="question-number">${index + 1}</span>
                            <span>${escapeHtml(answer.questionText)}</span>
                        </div>
                    </div>
                    <div class="answer-content">
                        <div class="answer-text">
                            ✓ ${escapeHtml(answer.optionText)}
                        </div>
                    </div>
                </div>
            `;
    });
  } else {
    answersHTML += `
            <div class="no-answers">
                <div class="no-answers-icon">📝</div>
                <h4>No Quiz Answers</h4>
                <p>This submission doesn't contain any quiz responses.</p>
            </div>
        `;
  }

  answersHTML += '</div>';

  showModal(`📊 Quiz Submission #${result.id}`, answersHTML);
}

// Delete a result
async function deleteResult(resultId) {
  if (
    !confirm(
      'Are you sure you want to delete this quiz result? This action cannot be undone.'
    )
  ) {
    return;
  }

  try {
    console.log('[Results] Deleting result with ID:', resultId);

    const response = await fetch(`../api/quiz-results.php?id=${resultId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      console.log('[Results] Result deleted successfully:', data.deleted_id);

      // Show success message
      alert('Quiz result deleted successfully!');

      // Refresh the results to update the display
      refreshResults();
    } else {
      throw new Error(data.error || 'Failed to delete result');
    }
  } catch (error) {
    console.error('[Results] Error deleting result:', error);
    alert('Failed to delete quiz result: ' + error.message);
  }
}

// Export results to CSV
function exportResults() {
  if (allResults.length === 0) {
    alert('No results to export');
    return;
  }

  let csv = 'ID,Name,Email,Phone,Product,Submitted,Answers\n';

  allResults.forEach((result) => {
    const submittedDate = new Date(result.created_at)
      .toISOString()
      .split('T')[0];
    const answersText = result.quiz_answers
      ? result.quiz_answers
          .map((a) => `Q: ${a.questionText} A: ${a.optionText}`)
          .join(' | ')
      : '';

    csv += `${result.id},"${escapeCSV(result.name)}","${escapeCSV(
      result.email
    )}","${escapeCSV(result.phone || '')}","${escapeCSV(
      result.product_key || ''
    )}","${submittedDate}","${escapeCSV(answersText)}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeCSV(text) {
  if (!text) return '';
  return text.toString().replace(/"/g, '""');
}

function showError(message) {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #dc2626;">
            <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
            <h3>Error</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="refreshResults()" style="margin-top: 15px;">Try Again</button>
        </div>
    `;
}

function showModal(title, content) {
  // Use existing modal from dashboard
  const modal = document.getElementById('jsonModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modal.style.display = 'block';
}

// Initialize when results tab is shown
document.addEventListener('DOMContentLoaded', function () {
  // Override the existing showTab function to initialize results when needed
  const originalShowTab = window.showTab;
  window.showTab = function (tabName) {
    originalShowTab(tabName);
    if (tabName === 'results') {
      setTimeout(initializeResults, 100); // Small delay to ensure DOM is ready
    }
  };

  // Override switchProductQuiz to refresh results when product changes
  if (window.switchProductQuiz) {
    const originalSwitchProductQuiz = window.switchProductQuiz;
    window.switchProductQuiz = async function (productKey) {
      await originalSwitchProductQuiz(productKey);

      // If currently on results tab, refresh the results with new filter
      const activeTab = document.querySelector('.tab-content.active');
      if (activeTab && activeTab.id === 'results-tab') {
        setTimeout(initializeResults, 100);
      }
    };
  }
});
