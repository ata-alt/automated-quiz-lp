<!doctype html>
<html lang="en-gb">

<head>
    <script>
        (function(w, i, g) {
            w[g] = w[g] || [];
            if (typeof w[g].push == 'function') w[g].push(i)
        })
        (window, 'GTM-MHZ76M', 'google_tags_first_party');
    </script>
    <script>
        (function(w, d, s, l) {
            w[l] = w[l] || [];
            (function() {
                w[l].push(arguments);
            })('set', 'developer_id.dYzg1YT', true);
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s);
            j.async = true;
            j.src = '/7b50/';
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer');
    </script>
    <title id="page-title">Luxury Sofa Quiz</title>
    <link rel="canonical" href="https://www.fcilondon.co.uk/sofa-quiz-lp/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="keywords" content="Luxury sofas London, Bespoke sofas showroom, Handcrafted sofas London, Designer sofas London, Luxury furniture London, High-end sofas showroom, Custom sofas London, Luxury living room furniture, Elegant sofas London, Showroom luxury sofas, sofas, sofa, sofa bed, sofa be, sofa b, Sofa pools, Sofa pool, Sofa poo, Sofa po, Sofa p,sofabed, sofabe, sofab,  Italian sofa, Sofas, modular sofa, Full grain leather sofa, 3 and 2 recliner sofas, 3 and 2 reclimer sofas, 3 and 2 reclimer sofa, curved sofa">
    <meta name="description" content="Explore our collection of luxury sofas at FCI London. Discover contemporary and designer sofas, meticulously crafted for your modern living space. Choose from bespoke Italian sofas and elevate your home decor with our premium furniture offerings. Find the perfect blend of style and comfort at FCI London.">
    <link rel="shortcut icon" href="/favicon.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="preconnect" href="https://www.fcilondon.co.uk">
    <link rel="preconnect" href="https://www.googletagmanager.com">
    <link rel="preconnect" href="https://www.googleadservices.com">
    <link rel="preconnect" href="https://www.google-analytics.com">

    <link rel="preload" href="../site-assets/fonts/titillium/titilliumweb-semibold_0-webfont.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="../site-assets/fonts/titillium/titilliumweb-regular_0-webfont.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="../site-assets/fonts/gilroy/348C7F_1_0.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="../site-assets/fonts/gilroy/348C7F_3_0.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="../site-assets/fonts/gilroy/348C7F_4_0.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="../site-assets/font-icons/fonts/icomoon.ttf?uo8nu" as="font" type="font/ttf" crossorigin>



    <link rel="stylesheet" href="../site-assets/css/style.css">
    <link rel="stylesheet" href="../site-assets/css/zaraz-consent.css">

    <script src="../site-assets/js/libs/jquery-3.6.0.min.js"></script>

    <meta name="popup" content="0">
    <meta name="robots" content="noindex, nofollow">
    <link href="../site-assets/css/style-quiz-widget.css?v=13" rel="stylesheet">
    <script src="../api/api-client.js?v=3"></script>
    <script src="../site-assets/js/webhook-handler.js?v=1"></script>
    <script src="../site-assets/js/frame.sofa-quiz.js?v=23"></script>
    <script src="../site-assets/js/showroom-content.js?v=12" defer></script>

    <style>
        .main {
            margin-top: 0px;
        }

        @media only screen and (max-width: 450px) {
            .thick-h3 {
                margin-top: 10px;
            }
        }
    </style>

</head>

<body>

    <main class="main">
        <section class="container" style="padding: 20px 10px;">
            <div class="row text-center" id="productquiz">
                <div class="col col-12">
                    <!-- Quiz Widget Container -->
                    <section class="style-quiz-widget container" data-quiz-type="diningtable"> </section>
                </div>
            </div>
            </div>
        </section>





    </main>
    <!-- Start FOOTER -->

    <!-- Zaraz consent Pop up ends here -->
    <script src="../site-assets/js/showroom-content-fallback.js?v=12" defer></script>
    <script>
        (function() {
            'use strict';

            // Function to update quiz type attribute
            function updateQuizType() {
                const urlParams = new URLSearchParams(window.location.search);
                const productParam = urlParams.get('product');

                if (productParam) {
                    const quizWidget = document.querySelector('.style-quiz-widget');
                    if (quizWidget) {
                        quizWidget.setAttribute('data-quiz-type', productParam);
                    }
                }
            }

            // Run on page load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', updateQuizType);
            } else {
                updateQuizType();
            }
        })();

        // Dynamic Title Management
        (function() {
            'use strict';

            // Function to capitalize first letter of each word
            function capitalize(str) {
                return str.replace(/\b\w/g, l => l.toUpperCase());
            }

            // Function to get product display name
            function getProductDisplayName(productKey) {
                const productNames = {
                    'default': 'Product',
                    'products': 'Product',
                    'wardrobe': 'Wardrobe',
                    'wardrobes': 'Wardrobe',
                    'kitchen': 'Kitchen',
                    'kitchens': 'Kitchen',
                    'bedroom': 'Bedroom',
                    'closet': 'Closet',
                    'table': 'Table',
                    'tables': 'Table'
                };

                // Check if it's a known product key
                if (productNames[productKey?.toLowerCase()]) {
                    return productNames[productKey.toLowerCase()];
                }

                // If not found, capitalize the input
                if (productKey) {
                    return capitalize(productKey.replace(/[_-]/g, ' '));
                }

                return 'Product'; // Default fallback
            }

            // Function to update page title
            async function updatePageTitle() {
                try {
                    // Check if we're in preview mode with a specific product
                    const urlParams = new URLSearchParams(window.location.search);
                    const previewProduct = urlParams.get('product');

                    // Get current product from API or use preview product
                    const currentProduct = previewProduct || await window.apiClient.getCurrentProduct();

                    if (currentProduct && currentProduct !== 'default') {
                        // Get product data to get the actual name
                        try {
                            const productData = await window.apiClient.getContent(currentProduct);
                            let productName = currentProduct;

                            // Try to get the product name from the data
                            if (productData && productData.productName) {
                                productName = productData.productName;
                            } else if (productData && productData.name) {
                                productName = productData.name;
                            }

                            const displayName = getProductDisplayName(productName);
                            const newTitle = `Luxury ${displayName} Quiz`;

                            // Update page title
                            document.title = newTitle;
                            const titleElement = document.getElementById('page-title');
                            if (titleElement) {
                                titleElement.textContent = newTitle;
                            }


                        } catch (error) {
                            // If we can't get product data, use the product key
                            const displayName = getProductDisplayName(currentProduct);
                            const newTitle = `Luxury ${displayName} Quiz`;

                            document.title = newTitle;
                            const titleElement = document.getElementById('page-title');
                            if (titleElement) {
                                titleElement.textContent = newTitle;
                            }

                        }
                    } else {
                        // Default to Product Quiz
                        const defaultTitle = 'Luxury Product Quiz';
                        document.title = defaultTitle;
                        const titleElement = document.getElementById('page-title');
                        if (titleElement) {
                            titleElement.textContent = defaultTitle;
                        }
                    }

                } catch (error) {
                    // Keep default title if API fails
                }
            }

            // Function to listen for product changes
            function setupProductChangeListener() {
                // Check if we're in preview mode with a specific product
                const urlParams = new URLSearchParams(window.location.search);
                const isPreviewMode = urlParams.has('preview') && urlParams.has('product');

                // Only setup listeners if NOT in preview mode
                if (!isPreviewMode) {
                    // Listen for storage changes (when dashboard updates current product)
                    window.addEventListener('storage', function(e) {
                        if (e.key === 'currentProduct' || e.key === 'productQuizzes') {
                            updatePageTitle();
                        }
                    });

                    // Listen for custom events (for real-time updates)
                    window.addEventListener('productChanged', function(e) {
                        updatePageTitle();
                    });
                } else {}
            }

            // Initialize title management
            function initializeTitleManagement() {
                // Wait for API client to be ready
                if (typeof window.apiClient !== 'undefined') {
                    updatePageTitle();
                    setupProductChangeListener();
                } else {
                    // Retry after a short delay if API client not ready
                    setTimeout(initializeTitleManagement, 100);
                }
            }

            // Start when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeTitleManagement);
            } else {
                initializeTitleManagement();
            }

        })();
    </script>
    <script src="../site-assets/js/libs/jquery.fitvids.js" defer></script>
    <script src="../site-assets/js/libs/lightslider.js" defer></script>
    <script src="../site-assets/js/libs/jquery.accordion.js" defer></script>
    <script src="../site-assets/js/libs/jquery-rbox.min.js" defer></script>
    <script src="../site-assets/js/libs/headroom.min.js" defer></script>
    <script src="../site-assets/js/libs/jquery.lazy.min.js" defer></script>
    <script src="../site-assets/js/libs/classie.js" defer></script>
    <script src="../site-assets/js/libs/selectFx.js" defer></script>
    <script src="../main.js?v=35" defer></script>
    <script src="//scripts.iconnode.com/121386.js" defer></script>
    <script src="../site-assets/js/cf-zaraz-init.js" defer></script>
    <script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"rayId":"980ec71b8bcdf881","serverTiming":{"name":{"cfExtPri":true,"cfEdge":true,"cfOrigin":true,"cfL4":true,"cfSpeedBrain":true,"cfCacheStatus":true}},"version":"2025.8.0","token":"84f74e2a1b444425bd5c6e76422307ec"}' crossorigin="anonymous"></script>
</body>

</html>