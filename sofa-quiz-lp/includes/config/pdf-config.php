<?php
/*
 * PDF Generator API Configuration
 * 
 * Store your API credentials securely
 * DO NOT commit this file to version control
 * Add to .gitignore
 */

return [

    'pdf_generator' => [

        'api_key' => '412642f7af19e9bce0fbf140b0bc3aa488227908ec2d0b9ce161ee56d0c0818b',
        'api_secret' => '2f49f895491315141caaa5b18b066e8f8d8715ec0c914e1e0499079945718f9c',

        'use_dynamic_jwt' => true,

        'jwt_expiry' => 31536000,

        'workspace' => '',


        'storage_path' => __DIR__ . '/../../../uploads/newsletters/',

        'options' => [
            'paper_size' => 'a4',
            'landscape' => false,
            'margin_top' => '10mm',
            'margin_right' => '10mm',
            'margin_bottom' => '10mm',
            'margin_left' => '10mm',
            'filename' => 'newsletter',
        ],

        'filename_pattern' => 'newsletter_{email}_{timestamp}.pdf',


        'delete_after_send' => false,

        'continue_without_pdf' => true,
    ],

    'email' => [
        'pdf_attachment_name' => 'FCI_London_Personalized_Selection.pdf',

        'max_attachment_size' => 25 * 1024 * 1024,
    ]
];
