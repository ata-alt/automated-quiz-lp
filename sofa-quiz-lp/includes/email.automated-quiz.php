<?php

/**
 * Email Template for Automated Quiz Results
 *
 * This template generates the HTML email content for quiz results.
 * It expects the following variables to be available:
 * - $userName: User's full name
 * - $userEmail: User's email address
 * - $imageUrl: URL to the style image
 * - $styleWords: Array with word1, word2, word3
 * - $profile: Complete profile data array
 */

// Helper function to safely get nested array values
function getNestedValue($array, $keys, $default = '')
{
    foreach ($keys as $key) {
        if (!isset($array[$key])) {
            return $default;
        }
        $array = $array[$key];
    }
    return $array;
}

// Helper function to generate bullet list HTML
function generateBulletList($items)
{
    if (!is_array($items) || empty($items)) {
        return '';
    }

    $html = '';
    $count = count($items);
    foreach ($items as $index => $item) {
        $margin = ($index < $count - 1) ? '10px' : '0';
        $html .= '<p style="margin: 0 0 ' . $margin . '; color: #2e2e2e; font-size: 14px; line-height: 1.6; font-weight: 300; padding-left: 20px; position: relative;">
            <span style="position: absolute; left: 0; color: #000000; font-weight: 600;">•</span>
            ' . htmlspecialchars($item) . '
        </p>';
    }
    return $html;
}

// Helper function for checkmark lists
function generateCheckmarkList($items)
{
    if (!is_array($items) || empty($items)) {
        return '';
    }

    $html = '';
    $count = count($items);
    foreach ($items as $index => $item) {
        $margin = ($index < $count - 1) ? '10px' : '0';
        $html .= '<p style="margin: 0 0 ' . $margin . '; color: #2e2e2e; font-size: 14px; line-height: 1.6; font-weight: 300; padding-left: 20px; position: relative;">
            <span style="position: absolute; left: 0; color: #7cb342; font-weight: 600;">✓</span>
            ' . htmlspecialchars($item) . '
        </p>';
    }
    return $html;
}

// Helper function for X-mark lists
function generateXmarkList($items)
{
    if (!is_array($items) || empty($items)) {
        return '';
    }

    $html = '';
    $count = count($items);
    foreach ($items as $index => $item) {
        $margin = ($index < $count - 1) ? '10px' : '0';
        $html .= '<p style="margin: 0 0 ' . $margin . '; color: #2e2e2e; font-size: 14px; line-height: 1.6; font-weight: 300; padding-left: 20px; position: relative;">
            <span style="position: absolute; left: 0; color: #e53935; font-weight: 600;">✗</span>
            ' . htmlspecialchars($item) . '
        </p>';
    }
    return $html;
}

// Helper function for question lists
function generateQuestionList($items)
{
    if (!is_array($items) || empty($items)) {
        return '';
    }

    $html = '';
    $count = count($items);
    foreach ($items as $index => $item) {
        $margin = ($index < $count - 1) ? '8px' : '0';
        $html .= '<p style="margin: 0 0 ' . $margin . '; color: #2e2e2e; font-size: 13px; line-height: 1.5; font-weight: 300; padding-left: 18px; position: relative;">
            <span style="position: absolute; left: 0; color: #2c2c2c; font-weight: 600;">?</span>
            ' . htmlspecialchars($item) . '
        </p>';
    }
    return $html;
}

// Generate color palette HTML
function generateColorPalette($colors)
{
    if (!is_array($colors) || empty($colors)) {
        return '';
    }

    $html = '';
    foreach ($colors as $color) {
        $name = isset($color['name']) ? htmlspecialchars($color['name']) : '';
        $hexCode = isset($color['hexCode']) ? htmlspecialchars($color['hexCode']) : '#000000';
        $percentage = isset($color['percentage']) ? htmlspecialchars($color['percentage']) : '';
        $application = isset($color['application']) ? htmlspecialchars($color['application']) : '';

        $html .= '<tr>
            <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td style="width: 60px; padding-right: 15px;">
                            <div style="width: 60px; height: 60px; background-color: ' . $hexCode . '; border: 1px solid #e0e0e0;"></div>
                        </td>
                        <td style="vertical-align: top;">
                            <p style="margin: 0 0 5px 0; color: #2c2c2c; font-size: 16px; font-weight: 600;">
                                ' . $name . '
                            </p>
                            <p style="margin: 0 0 8px 0; color: #2e2e2e; font-size: 13px; font-weight: 400; font-family: \'Courier New\', monospace;">
                                ' . $hexCode . '
                            </p>
                            <p style="margin: 0; color: #2e2e2e; font-size: 14px; line-height: 1.5; font-weight: 300;">
                                <strong style="color: #2c2c2c; font-weight: 600;">' . $percentage . '</strong> - ' . $application . '
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>';
    }
    return $html;
}

// Generate implementation timeline HTML
function generateTimeline($actionOrder)
{
    if (!is_array($actionOrder) || empty($actionOrder)) {
        return '';
    }

    $html = '';
    $count = count($actionOrder);
    foreach ($actionOrder as $index => $step) {
        $marginBottom = ($index < $count - 1) ? '20px' : '0';
        $paddingBottom = ($index < $count - 1) ? '20px' : '0';
        $borderBottom = ($index < $count - 1) ? '1px solid #e0e0e0' : 'none';

        if (is_array($step)) {
            $week = isset($step['week']) ? htmlspecialchars($step['week']) : '';
            $task = isset($step['task']) ? htmlspecialchars($step['task']) : '';
            $description = isset($step['description']) ? htmlspecialchars($step['description']) : '';
            $title = 'Week ' . $week;
            $content = $task . ($description ? ': ' . $description : '');
        } else {
            $parts = explode(':', $step, 2);
            $title = htmlspecialchars($parts[0]);
            $content = isset($parts[1]) ? htmlspecialchars(trim($parts[1])) : '';
        }

        $html .= '<div style="margin-bottom: ' . $marginBottom . '; padding-bottom: ' . $paddingBottom . '; border-bottom: ' . $borderBottom . ';">
            <p style="margin: 0 0 8px 0; color: #2e2e2e; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ' . $title . '
            </p>
            <p style="margin: 0; color: #2e2e2e; font-size: 14px; line-height: 1.6; font-weight: 300;">
                ' . $content . '
            </p>
        </div>';
    }
    return $html;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Personalized Interior Design Action Guide - FCI London</title>
    <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>

<body style="margin: 0; padding: 0; font-family: 'Gilroy', 'Titillium Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f7; line-height: 1.6;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f7f7f7;">
        <tr>
            <td align="center" style="padding: 40px 20px;">

                <!-- Main Container -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; max-width: 600px; box-shadow: 0 2px 20px rgba(0,0,0,0.08);">

                    <!-- Header Logo & Brand -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 30px 40px; text-align: center; border-bottom: 4px solid #000000;">
                            <img src="https://www.fcilondon.co.uk/cdn-cgi/image/quality=75,f=auto/site-assets/img/logos/logo-horizontal-text.png" alt="FCI London" width="200" height="58" style="display: inline-block;">
                        </td>
                    </tr>

                    <!-- Hero Section -->
                    <tr>
                        <td style="padding: 50px 40px 30px 40px; text-align: center;">
                            <h1 style="margin: 0 0 15px 0; color: #2c2c2c; font-size: 32px; font-weight: 600; line-height: 1.2;">
                                Your Personalised Design Action Guide
                            </h1>
                            <p style="margin: 0 0 10px 0; color: #2e2e2e; font-size: 16px; font-weight: 300;">
                                Prepared for <?php echo $userName; ?>
                            </p>
                            <p style="margin: 0; color: #2e2e2e; font-size: 13px; font-weight: 300; font-style: italic;">
                                Share this comprehensive guide with your designer or sales adviser
                            </p>
                        </td>
                    </tr>

                    <!-- Profile Image -->
                    <?php if (!empty($imageUrl)): ?>
                        <tr>
                            <td align="center" style="padding: 0 40px 40px 40px;">
                                <img src="<?php echo $imageUrl; ?>"
                                    alt="Your Design Style"
                                    style="max-width: 100%; max-height: 720px; height: auto; width: auto; border: 1px solid #e8e8e8; display: block; margin: 0 auto;" />
                            </td>
                        </tr>
                    <?php endif; ?>

                    <!-- Style Identity -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <div style="background-color: #000000; padding: 30px; text-align: center;">
                                <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 12px; font-weight: 400; text-transform: uppercase; letter-spacing: 2px;">
                                    Your Design Identity
                                </p>
                                <h2 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; line-height: 1.3;">
                                    <?php echo htmlspecialchars($styleWords['word1'] ?? ''); ?> •
                                    <?php echo htmlspecialchars($styleWords['word2'] ?? ''); ?> •
                                    <?php echo htmlspecialchars($styleWords['word3'] ?? ''); ?> •
                                    <?php echo htmlspecialchars($styleWords['word4'] ?? ''); ?> •
                                    <?php echo htmlspecialchars($styleWords['word5'] ?? ''); ?> •
                                    <?php echo htmlspecialchars($styleWords['word6'] ?? ''); ?> •
                                    <?php echo htmlspecialchars($styleWords['word7'] ?? ''); ?> •
                                    <?php echo htmlspecialchars($styleWords['word8'] ?? ''); ?>
                                </h2>
                            </div>
                        </td>
                    </tr>
                    <!-- SECTION 1: Your Interior Personality Decoded-->
                    <?php if (isset($profile['yourInteriorPersonalityDecoded'])): ?>
                        <tr>
                            <td style="padding: 0 40px 40px 40px;">
                                <h3 style="margin: 0 0 20px 0; color: #2c2c2c; font-size: 20px; font-weight: 600; letter-spacing: 1px; border-bottom: 2px solid #000000; padding-bottom: 12px;">
                                    SECTION 1: Your Interior Personality Decoded
                                </h3>

                                <div style="background-color: #f8f8f8; padding: 25px; margin-bottom: 25px;">
                                    <?php
                                    $text = trim($profile['yourInteriorPersonalityDecoded']);

                                    // Split the text into sentences
                                    $sentences = preg_split('/(?<=[.?!])\s+/', $text);

                                    // Determine roughly how many sentences per paragraph
                                    $totalSentences = count($sentences);
                                    $sentencesPerParagraph = ceil($totalSentences / 3);

                                    // Build 3 paragraphs
                                    for ($i = 0; $i < 3; $i++) {
                                        $start = $i * $sentencesPerParagraph;
                                        $paragraph = implode(' ', array_slice($sentences, $start, $sentencesPerParagraph));
                                        if (!empty($paragraph)) {
                                            echo '<p style="margin: 0 0 15px 0; color: #2c2c2c; font-size: 14px; line-height: 1.7; text-align: justify;">' . htmlspecialchars($paragraph) . '</p>';
                                        }
                                    }
                                    ?>
                                </div>
                            </td>
                        </tr>
                    <?php endif; ?>


                    <!-- SECTION 2: Colour Palette -->
                    <?php if (isset($profile['colourPalette'])): ?>
                        <tr>
                            <td style="padding: 0 40px 40px 40px;">
                                <h3 style="margin: 0 0 25px 0; color: #2c2c2c; font-size: 20px; font-weight: 600; letter-spacing: 1px; border-bottom: 2px solid #000000; padding-bottom: 12px;">
                                    SECTION 2: Your Colour Palette
                                </h3>
                                <p style="margin: 0 0 15px 0; color: #2e2e2e; font-size: 15px; line-height: 1.6; font-weight: 400;">
                                    Based on your quiz results, these are the colours most in tune with your personality. Even if they don’t feel like an obvious match at first glance, ask your designer or retailer to show them grouped together or in a 3D render. You may be surprised by how naturally they come to life when seen in context.
                                </p>

                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                                    <?php echo generateColorPalette($profile['colourPalette']); ?>
                                </table>

                                <?php if (isset($profile['colourRuleNote'])): ?>
                                    <div style="background-color: #fffbf0; padding: 20px;">
                                        <p style="margin: 0 0 10px 0; color: #2c2c2c; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Application Rule
                                        </p>
                                        <p style="margin: 0; color: #2e2e2e; font-size: 14px; line-height: 1.6; font-weight: 300;">
                                            <?php echo htmlspecialchars($profile['colourRuleNote']); ?>
                                        </p>
                                    </div>
                                <?php endif; ?>

                                <?php if (isset($profile['paintShopReference'])): ?>
                                    <div style="background-color: #f5f7fa; padding: 15px; margin-top: 15px;">
                                        <p style="margin: 0; color: #2e2e2e; font-size: 13px; line-height: 1.5; font-weight: 300;">
                                            <strong style="color: #2c2c2c; font-weight: 600;padding-bottom: 12px;">Paint Shop Note:</strong> <?php echo htmlspecialchars($profile['paintShopReference']); ?>
                                        </p>
                                    </div>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endif; ?>
                    <!-- SECTION 3: Documentation Checklist -->
                    <?php if (isset($profile['documentationChecklist'])): ?>
                        <tr>
                            <td style="padding: 40px 40px 40px 40px; page-break-before: always;"> <!-- keep td padding -->
                                <h3 style="margin: 0 0 15px 0; color: #2c2c2c; font-size: 18px; font-weight: 600; letter-spacing: 1px; border-bottom: 2px solid #000000; padding-bottom: 8px;">
                                    SECTION 3: Documentation Checklist
                                </h3>

                                <p style="margin: 0 0 10px 0; color: #6a6a6a; font-size: 13px; line-height: 1.4; font-weight: 400;">
                                    Before heading to a showroom or meeting your designer, collect this information as part of your homework — it'll sharpen your search and help everyone get on the same page quickly.
                                </p>

                                <!-- Photos Required -->
                                <?php if (isset($profile['documentationChecklist']['photosRequired'])): ?>
                                    <div style="margin-bottom: 10px;">
                                        <p style="margin: 0 0 5px 0; color: #2c2c2c; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Photos Required
                                        </p>
                                        <div style="background-color: #fafafa; padding: 10px;">
                                            <?php echo generateBulletList($profile['documentationChecklist']['photosRequired']); ?>
                                        </div>
                                    </div>
                                <?php endif; ?>

                                <!-- Videos Required -->
                                <?php if (isset($profile['documentationChecklist']['videosRequired'])): ?>
                                    <div style="margin-bottom: 10px;">
                                        <p style="margin: 0 0 5px 0; color: #2c2c2c; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Videos Required
                                        </p>
                                        <div style="background-color: #fafafa; padding: 10px;">
                                            <?php echo generateBulletList($profile['documentationChecklist']['videosRequired']); ?>
                                        </div>
                                    </div>
                                <?php endif; ?>

                                <!-- Measurements Needed -->
                                <?php if (isset($profile['documentationChecklist']['measurementsNeeded'])): ?>
                                    <div style="margin-bottom: 0;">
                                        <p style="margin: 0 0 5px 0; color: #2c2c2c; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Measurements Needed
                                        </p>
                                        <div style="background-color: #fafafa; padding: 10px;">
                                            <?php echo generateBulletList($profile['documentationChecklist']['measurementsNeeded']); ?>
                                        </div>
                                    </div>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endif; ?>

                    <!-- SECTION 4: How to Make Decisions Without Overthinking (or Rushing) -->
                    <?php if (isset($profile['decisionMakingGuide'])): ?>
                        <tr>
                            <td style="padding: 40px 40px 40px 40px;">
                                <h3 style="margin: 0 0 20px 0; color: #2c2c2c; font-size: 20px; font-weight: 600;  letter-spacing: 1px; border-bottom: 2px solid #000000; padding-bottom: 12px;">
                                    SECTION 4: How to Make Decisions Without Overthinking (or Rushing)
                                </h3>

                                <div style="background-color: #f8f8f8; padding: 25px; margin-bottom: 25px;">
                                    <?php
                                    $text = trim($profile['decisionMakingGuide']);
                                    $sentences = preg_split('/(?<=[.?!])\s+/', $text);
                                    $totalSentences = count($sentences);
                                    $sentencesPerParagraph = ceil($totalSentences / 2); // 2 paragraphs

                                    for ($i = 0; $i < 2; $i++) {
                                        $start = $i * $sentencesPerParagraph;
                                        $paragraph = implode(' ', array_slice($sentences, $start, $sentencesPerParagraph));
                                        if (!empty($paragraph)) {
                                            echo '<p style="margin: 0 0 15px 0; color: #2c2c2c; font-size: 14px; line-height: 1.7; text-align: justify;">' . htmlspecialchars($paragraph) . '</p>';
                                        }
                                    }
                                    ?>
                                </div>
                            </td>
                        </tr>
                    <?php endif; ?>

                    <!-- SECTION 5: Psychologically Aligned Buying Pitfalls to Avoid -->
                    <?php if (isset($profile['buyingPitfalls'])): ?>
                        <tr>
                            <td style="padding: 20px 40px 40px 40px;;">
                                <h3 style="margin: 0 0 20px 0; color: #2c2c2c; font-size: 20px; font-weight: 600; letter-spacing: 1px; border-bottom: 2px solid #000000; padding-bottom: 12px;">
                                    SECTION 5: Psychologically Aligned Buying Pitfalls to Avoid
                                </h3>

                                <div style="background-color: #f8f8f8; padding: 25px; margin-bottom: 25px;">
                                    <?php
                                    $text = trim($profile['buyingPitfalls']);
                                    $sentences = preg_split('/(?<=[.?!])\s+/', $text);
                                    $totalSentences = count($sentences);
                                    $sentencesPerParagraph = ceil($totalSentences / 5); // 5 paragraphs

                                    for ($i = 0; $i < 5; $i++) {
                                        $start = $i * $sentencesPerParagraph;
                                        $paragraph = implode(' ', array_slice($sentences, $start, $sentencesPerParagraph));
                                        if (!empty($paragraph)) {
                                            echo '<p style="margin: 0 0 15px 0; color: #2c2c2c; font-size: 14px; line-height: 1.7; text-align: justify;">' . htmlspecialchars($paragraph) . '</p>';
                                        }
                                    }
                                    ?>
                                </div>
                            </td>
                        </tr>
                    <?php endif; ?>


                    <!-- SECTION 6: Lifestyle Communication Script -->
                    <?php if (isset($profile['lifestyleCommunicationScript'])): ?>
                        <tr>
                            <td style="padding: 40px 40px 40px 40px; page-break-before: always;">
                                <h3 style="margin: 0 0 25px 0; color: #2c2c2c; font-size: 20px; font-weight: 600; letter-spacing: 1px; border-bottom: 2px solid #000000; padding-bottom: 12px;">
                                    SECTION 6: Lifestyle Communication Script
                                </h3>

                                <div style="background-color: #fffbf0; padding: 25px;">
                                    <p style="margin: 0 0 5px 0; color: #8a8a8a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                                        What to tell your designer or salesperson:
                                    </p>
                                    <p style="margin: 0 0 25px 0; color: #6a6a6a; font-size: 12px; font-style: italic; line-height: 1.5; font-weight: 300;">
                                        Share these key points to help them understand your preferences clearly.
                                    </p>
                                    <!-- NEW: Daily Routine Factors -->
                                    <?php if (isset($profile['lifestyleCommunicationScript']['dailyRoutineFactors'])): ?>
                                        <div style="margin-bottom: 30px;">
                                            <p style="margin: 0 0 12px 0; color: #2c2c2c; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                                Daily Routine Factors:
                                            </p>

                                            <?php foreach ($profile['lifestyleCommunicationScript']['dailyRoutineFactors'] as $key => $factor): ?>
                                                <div style="margin-bottom: 18px;">
                                                    <p style="margin: 0 0 5px 0; color: #2c2c2c; font-size: 13px; font-weight: 600;">
                                                        <?php
                                                        // Convert camelCase or PascalCase to words with spaces
                                                        $formattedKey = preg_replace('/([a-z])([A-Z])/', '$1 $2', $key);
                                                        $formattedKey = ucwords($formattedKey); // Capitalize each word
                                                        echo htmlspecialchars($formattedKey);
                                                        ?>:
                                                    </p>

                                                    <?php if (!empty($factor['description'])): ?>
                                                        <p style="margin: 0 0 6px 0; color: #2e2e2e; font-size: 12px; font-style: italic;">
                                                            <?php echo htmlspecialchars($factor['description']); ?>
                                                        </p>
                                                    <?php endif; ?>

                                                    <?php if (!empty($factor['examples'])): ?>
                                                        <?php foreach ($factor['examples'] as $example): ?>
                                                            <p style="margin: 0 0 5px 0; color: #2e2e2e; font-size: 14px; line-height: 1.6; font-weight: 300; padding: 10px 12px; background-color: #ffffff;">
                                                                <span style="font-weight: 300; color: #2e2e2e;">eg:</span> “<?php echo htmlspecialchars($example); ?>”
                                                            </p>
                                                        <?php endforeach; ?>
                                                    <?php endif; ?>
                                                </div>
                                            <?php endforeach; ?>
                                        </div>
                                    <?php endif; ?>

                                    <!-- NEW: Household Dynamics -->
                                    <?php if (isset($profile['lifestyleCommunicationScript']['householdDynamics'])): ?>
                                        <div>
                                            <p style="margin: 0 0 12px 0; color: #2c2c2c; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                                Household Dynamics:
                                            </p>

                                            <?php foreach ($profile['lifestyleCommunicationScript']['householdDynamics'] as $key => $dynamic): ?>
                                                <div style="margin-bottom: 18px;">
                                                    <p style="margin: 0 0 5px 0; color: #2c2c2c; font-size: 13px; font-weight: 600; text-transform: capitalize;">
                                                        <?php echo htmlspecialchars(ucfirst($key)); ?>:
                                                    </p>
                                                    <?php if (!empty($dynamic['description'])): ?>
                                                        <p style="margin: 0 0 6px 0; color: #6a6a6a; font-size: 12px; font-style: italic;">
                                                            <?php echo htmlspecialchars($dynamic['description']); ?>
                                                        </p>
                                                    <?php endif; ?>
                                                    <?php if (!empty($dynamic['examples'])): ?>
                                                        <?php foreach ($dynamic['examples'] as $example): ?>
                                                            <p style="margin: 0 0 5px 0; color: #2e2e2e; font-size: 14px; line-height: 1.6; font-weight: 300; padding: 10px 12px; background-color: #ffffff;">
                                                                <span style="font-weight: 300; color: #2e2e2e;">eg:</span> “<?php echo htmlspecialchars($example); ?>”
                                                            </p>
                                                        <?php endforeach; ?>
                                                    <?php endif; ?>
                                                </div>
                                            <?php endforeach; ?>
                                        </div>
                                    <?php endif; ?>
                                    <!-- Existing items -->
                                    <?php if (isset($profile['lifestyleCommunicationScript']['entertainmentStyle'])): ?>
                                        <div style="margin-bottom: 20px;">
                                            <p style="margin: 0 0 8px 0; color: #2c2c2c; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                Entertainment Style:
                                            </p>
                                            <p style="margin: 0; color: #2e2e2e; font-size: 14px; line-height: 1.6; font-weight: 300; padding: 12px 15px; background-color: #ffffff;">
                                                <span style="font-weight: 300; color: #2e2e2e;">eg:</span> "<?php echo htmlspecialchars($profile['lifestyleCommunicationScript']['entertainmentStyle']); ?>"
                                            </p>
                                        </div>
                                    <?php endif; ?>

                                    <?php if (isset($profile['lifestyleCommunicationScript']['maintenanceReality'])): ?>
                                        <div style="margin-bottom: 20px;">
                                            <p style="margin: 0 0 8px 0; color: #2c2c2c; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                Maintenance Reality:
                                            </p>
                                            <p style="margin: 0; color: #2e2e2e; font-size: 14px; line-height: 1.6; font-weight: 300; padding: 12px 15px; background-color: #ffffff;">
                                                <span style="font-weight: 300; color: #2e2e2e;">eg:</span> "<?php echo htmlspecialchars($profile['lifestyleCommunicationScript']['maintenanceReality']); ?>"
                                            </p>
                                        </div>
                                    <?php endif; ?>

                                    <?php if (isset($profile['lifestyleCommunicationScript']['designApproach'])): ?>
                                        <div style="margin-bottom: 25px;">
                                            <p style="margin: 0 0 8px 0; color: #2c2c2c; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                Design Approach:
                                            </p>
                                            <p style="margin: 0; color: #2e2e2e; font-size: 14px; line-height: 1.6; font-weight: 300; padding: 12px 15px; background-color: #ffffff;">
                                                <span style="font-weight: 300; color: #2e2e2e;">eg:</span> "<?php echo htmlspecialchars($profile['lifestyleCommunicationScript']['designApproach']); ?>"
                                            </p>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                    <?php endif; ?>

                    <!-- SECTION 7: Personality Mistakes And Fixes -->
                    <?php if (isset($profile['personalityMistakesAndFixes'])): ?>
                        <tr>
                            <td style="padding: 40px 40px 0 40px; page-break-before: always;">
                                <h3 style="margin: 0 0 20px 0; color: #2c2c2c; font-size: 20px; font-weight: 600;  letter-spacing: 1px; border-bottom: 2px solid #000000; padding-bottom: 12px;">
                                    SECTION 7: Personality Mistakes And Fixes
                                </h3>

                                <div style="background-color: #f8f8f8; padding: 25px; margin-bottom: 10px;">
                                    <?php
                                    $text = trim($profile['personalityMistakesAndFixes']);
                                    $sentences = preg_split('/(?<=[.?!])\s+/', $text);
                                    $totalSentences = count($sentences);
                                    $sentencesPerParagraph = ceil($totalSentences / 2); // 2 paragraphs

                                    for ($i = 0; $i < 2; $i++) {
                                        $start = $i * $sentencesPerParagraph;
                                        $paragraph = implode(' ', array_slice($sentences, $start, $sentencesPerParagraph));
                                        if (!empty($paragraph)) {
                                            echo '<p style="margin: 0 0 15px 0; color: #2c2c2c; font-size: 14px; line-height: 1.7; text-align: justify;">' . htmlspecialchars($paragraph) . '</p>';
                                        }
                                    }
                                    ?>
                                </div>
                            </td>
                        </tr>
                    <?php endif; ?>

                    <!-- Call to Action -->
                    <tr>
                        <td style="padding: 0 30px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; padding: 25px 25px 30px 25px; text-align: center;">
                                <tr>
                                    <td>

                                        <h3 style="margin: 0 0 12px 0; color: #000000; font-size: 20px; font-weight: 400; line-height: 1.3;">
                                            Ready to Start Your Transformation?
                                        </h3>

                                        <p style="margin: 0 0 18px 0; color: #000000; font-size: 14px; line-height: 1.5; font-weight: 300;">
                                            Bring this guide to your consultation. Our design team will use it to create your perfect space.
                                        </p>

                                        <div style="text-align: center; overflow: hidden;">
                                            <img src="https://imagedelivery.net/HiLW5AP7jgpL7TeYz6gWzQ/02976134-6556-45a0-cfdf-aed2df2b0000/public"
                                                alt="Consultation Image"
                                                style="width: 100%; max-width: 630px; height: auto; display: inline-block;">
                                        </div>

                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top: 15px;">
                                            <tr>
                                                <td style="background-color: #000000; padding: 12px 30px; text-align: center;">
                                                    <a href="https://www.fcilondon.co.uk/book-a-showroom-visit.html" style="color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 400; text-transform: uppercase; letter-spacing: 1px; display: block;">
                                                        Book Your Consultation
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; background-color: #fafafa; text-align: center; border-top: 1px solid #e8e8e8;">
                            <p style="margin: 0 0 15px 0;">
                                <img src="https://www.fcilondon.co.uk/cdn-cgi/image/quality=75,f=auto/site-assets/img/logos/logo-horizontal-text.png" alt="FCI London" width="160" style="display: inline-block;">
                            </p>

                            <p style="margin: 0 0 12px 0; color: #6a6a6a; font-size: 11px; line-height: 1.5; font-weight: 400;">
                                Contemporary Furniture & Interior Design Est. 1985<br>
                                30,000 sq ft Showroom | Over 700 Brands Under One Roof
                            </p>

                            <p style="margin: 0 0 15px 0; color: #8a8a8a; font-size: 11px; font-weight: 400;">
                                <a href="mailto:hello@fcilondon.co.uk" style="color: #8a8a8a; text-decoration: none;">hello@fcilondon.co.uk</a> |
                                <a href="tel:02080682166" style="color: #8a8a8a; text-decoration: none;">020 8068 2166</a> |
                                <a href="https://www.fcilondon.co.uk" style="color: #8a8a8a; text-decoration: none;">www.fcilondon.co.uk</a>
                            </p>

                            <p style="margin: 0 0 15px 0; color: #8a8a8a; font-size: 10px; font-weight: 400;">
                                <a href="https://www.fcilondon.co.uk/about-us.html" style="color: #8a8a8a; text-decoration: none;">About Us</a> |
                                <a href="https://www.fcilondon.co.uk/delivery-policy.html" style="color: #8a8a8a; text-decoration: none;">Delivery & Returns</a> |
                                <a href="https://www.fcilondon.co.uk/terms-and-conditions.html" style="color: #8a8a8a; text-decoration: none;">Terms</a> |
                                <a href="https://www.fcilondon.co.uk/privacy-policy.html" style="color: #8a8a8a; text-decoration: none;">Privacy</a>
                            </p>

                            <p style="margin: 0; color: #ababab; font-size: 10px; line-height: 1.4; font-weight: 300;">
                                This action guide was generated based on your quiz responses.<br>
                                &copy; 2025 FCI London. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>

</html>