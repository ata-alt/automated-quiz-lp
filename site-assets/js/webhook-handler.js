/**
 * Webhook Handler for Quiz Submissions
 * Sends quiz data to n8n webhook when user submits the quiz
 */

(function () {
  'use strict';

  // n8n webhook URL
  const WEBHOOK_URL =
    'https://n8n.srv983823.hstgr.cloud/webhook/automated-quiz';

  /**
   * Send quiz submission data to n8n webhook
   * @param {Object} quizData - The quiz submission data
   * @returns {Promise<Object>} Response from the webhook
   */
  async function sendToWebhook(quizData) {
    try {
      console.log('[Webhook] Sending data to n8n webhook...', quizData);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        throw new Error(
          `Webhook request failed with status ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log('[Webhook] ✓ Response received from webhook:', responseData);
      console.log('[Webhook] Response is array:', Array.isArray(responseData));

      // Extract personality data from response
      let personalityData = null;
      let outputData = null;

      // Handle both array format [{output: {...}}] and object format {output: {...}}
      if (Array.isArray(responseData) && responseData.length > 0) {
        console.log(
          '[Webhook] Processing array response, length:',
          responseData.length
        );
        outputData = responseData[0];
      } else if (responseData && typeof responseData === 'object') {
        console.log('[Webhook] Processing object response');
        outputData = responseData;
      }

      if (outputData) {
        console.log('[Webhook] Output data:', outputData);

        if (
          outputData.output &&
          outputData.output.data &&
          outputData.output.data.personality
        ) {
          personalityData = outputData.output.data.personality;
          console.log(
            '[Webhook] ✓ Personality data extracted:',
            personalityData
          );
        } else {
          console.warn(
            '[Webhook] ✗ Personality data not found in expected path'
          );
          console.log('[Webhook] outputData.output:', outputData.output);
        }
      } else {
        console.warn('[Webhook] ✗ Could not extract output data from response');
      }

      const result = {
        success: true,
        data: responseData,
        personality: personalityData,
      };

      console.log('[Webhook] Returning result:', result);
      return result;
    } catch (error) {
      console.error('[Webhook] Error sending data to webhook:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Format quiz data for webhook submission
   * @param {string} name - User's first name
   * @param {string} lname - User's last name
   * @param {string} email - User's email address
   * @param {string} phone - User's phone number
   * @param {string} productKey - Product key/identifier
   * @param {Array} quizAnswers - Array of quiz answers with questions
   * @returns {Object} Formatted data object for webhook
   */
  function formatWebhookData(name, lname, email, phone, productKey, quizAnswers) {
    return {
      timestamp: new Date().toISOString(),
      user: {
        firstName: name,
        lastName: lname,
        email: email,
        phone: phone,
      },
      product: {
        key: productKey,
        name: productKey
          ? productKey.charAt(0).toUpperCase() + productKey.slice(1)
          : 'Default',
      },
      quiz: {
        totalQuestions: quizAnswers.length,
        answers: quizAnswers.map((answer, index) => ({
          questionNumber: index + 1,
          questionId: answer.questionId,
          questionText: answer.questionText,
          selectedOptionId: answer.optionId,
          selectedOptionText: answer.optionText,
        })),
      },
      metadata: {
        pageUrl: window.location.href,
        pageTitle: document.title,
        userAgent: navigator.userAgent,
        submittedAt: new Date().toLocaleString(),
      },
    };
  }

  /**
   * Main function to handle quiz submission to webhook
   * This is called from the quiz submission process
   */
  window.sendQuizToWebhook = async function (
    name,
    lname,
    email,
    phone,
    productKey,
    quizAnswers
  ) {
    // Format the data for webhook
    const webhookData = formatWebhookData(
      name,
      lname,
      email,
      phone,
      productKey,
      quizAnswers
    );

    // Send to webhook
    const result = await sendToWebhook(webhookData);

    return result;
  };

  console.log('[Webhook] Webhook handler initialized');
})();
