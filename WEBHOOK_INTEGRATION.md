# Webhook Integration Documentation

## Overview
This document describes the webhook integration that sends quiz submission data to an n8n automation workflow.

## Files Modified/Created

### 1. **webhook-handler.js** (NEW)
Location: `site-assets/js/webhook-handler.js`

This is the main webhook handler file that:
- Contains the webhook URL: `https://n8n.srv983823.hstgr.cloud/webhook-test/automated-quiz`
- Formats quiz data for webhook submission
- Sends POST requests to the n8n webhook
- Handles errors gracefully (logs errors but doesn't block user experience)

### 2. **sofa-quiz.js** (MODIFIED)
Location: `site-assets/js/sofa-quiz.js`

Modified the `submitDetails` function (around line 590) to:
- Call `window.sendQuizToWebhook()` after successful database save
- Pass user details and quiz answers to the webhook
- Handle webhook failures gracefully without affecting user experience

### 3. **frame.sofa-quiz.js** (MODIFIED)
Location: `site-assets/js/frame.sofa-quiz.js`

Updated the script loading logic to:
- Load `webhook-handler.js` before `sofa-quiz.js`
- Include error handling if webhook handler fails to load
- Ensure quiz continues to work even if webhook handler is unavailable

### 4. **index.php** (MODIFIED)
Location: `sofa-quiz-lp/index.php`

Added script tag to load webhook handler:
```html
<script src="../site-assets/js/webhook-handler.js?v=1"></script>
```

### 5. **test-quiz.html** (MODIFIED)
Location: `test-quiz.html`

Added script tag for testing purposes.

## Data Format Sent to Webhook

The webhook receives a POST request with the following JSON structure:

```json
{
  "timestamp": "2025-10-20T10:30:45.123Z",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "product": {
    "key": "sofa",
    "name": "Sofa"
  },
  "quiz": {
    "totalQuestions": 6,
    "answers": [
      {
        "questionNumber": 1,
        "questionId": 1,
        "questionText": "What style do you prefer?",
        "selectedOptionId": "a",
        "selectedOptionText": "Modern & Contemporary"
      },
      // ... more answers
    ]
  },
  "metadata": {
    "pageUrl": "https://example.com/quiz",
    "pageTitle": "Luxury Sofa Quiz",
    "userAgent": "Mozilla/5.0...",
    "submittedAt": "10/20/2025, 10:30:45 AM"
  }
}
```

## Workflow

1. User completes the quiz
2. User fills in contact form (name, email, phone)
3. User submits the form
4. Data is saved to the database
5. Data is sent to HubSpot
6. **Data is sent to n8n webhook** (NEW)
7. Success message is shown to user

## Error Handling

The webhook integration is designed to fail gracefully:
- If the webhook request fails, it logs a warning to console but doesn't alert the user
- If the webhook handler script fails to load, the quiz continues to work normally
- The webhook call doesn't block the user experience or success message

## Console Logs

You can monitor webhook activity in the browser console:
- `[Webhook] Webhook handler initialized` - Handler loaded successfully
- `[Webhook] Sending data to n8n webhook...` - Sending data
- `[Webhook] Successfully sent data to webhook` - Success
- `[Webhook] Error sending data to webhook` - Error occurred
- `[Quiz] Successfully sent to webhook` - Confirmation from quiz
- `[Quiz] Webhook handler not available` - Handler not loaded

## Testing

To test the webhook integration:
1. Open the quiz page
2. Complete all quiz questions
3. Fill in the contact form
4. Submit the form
5. Check browser console for webhook logs
6. Verify data received in n8n workflow

## Updating the Webhook URL

To change the webhook URL, edit `site-assets/js/webhook-handler.js`:

```javascript
const WEBHOOK_URL = 'https://n8n.srv983823.hstgr.cloud/webhook-test/automated-quiz';
```

## Future Enhancements

Potential improvements:
- Add retry logic for failed webhook requests
- Add authentication/API keys if needed
- Add webhook configuration via dashboard
- Add webhook success/failure tracking in database
