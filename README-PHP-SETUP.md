# PHP Backend Setup Guide

This guide will help you set up the PHP backend with MySQL database for the Quiz Management System.

## Prerequisites

1. **Web Server with PHP** (XAMPP, WAMP, MAMP, or live server)
   - PHP 7.4 or higher
   - MySQL 5.7 or higher
   - PDO MySQL extension enabled

## Installation Steps

### 1. Database Setup

1. Start your MySQL server
2. Open phpMyAdmin or MySQL command line
3. Run the SQL script in `database/schema.sql`:
   ```sql
   -- Either copy and paste the entire contents of database/schema.sql
   -- Or run: source /path/to/database/schema.sql
   ```

### 2. Database Configuration

1. Open `api/config/database.php`
2. Update the database credentials:
   ```php
   private $host = 'localhost';
   private $db_name = 'automated_quiz';
   private $username = 'your_mysql_username'; // Usually 'root' for local
   private $password = 'your_mysql_password'; // Your MySQL password
   ```

### 3. Web Server Setup

1. **For XAMPP/WAMP/MAMP:**
   - Copy the entire project folder to your `htdocs` directory
   - Access via `http://localhost/sofa-quiz-lp/`

2. **For Live Server:**
   - Upload all files to your web root
   - Ensure PHP and MySQL are properly configured
   - Update database credentials accordingly

### 4. API Endpoints

The following API endpoints are available:

- **Products:** `api/products.php`
  - GET: Get all products
  - POST: Create new product
  - PUT: Update product
  - DELETE: Delete product

- **Content:** `api/content.php`
  - GET: Get content for a product
  - POST/PUT: Save content

- **Settings:** `api/settings.php`
  - GET: Get system settings
  - POST/PUT: Update settings

### 5. Testing the Setup

1. Open `dashboard.html` in your browser
2. You should see the dashboard load without localStorage warnings
3. Try creating a new product quiz
4. Switch between products and verify the index.html updates

## Features

### What Changed from localStorage

1. **Data Storage:** All data now stored in MySQL database
2. **Real-time Updates:** Changes in dashboard immediately reflect on frontend
3. **Multiple Products:** Full support for multiple product quizzes
4. **Persistent Data:** Data survives browser restarts and clears
5. **Scalability:** Can handle multiple users and large datasets

### Database Structure

- **product_quizzes:** Stores product information
- **quiz_content:** Stores content sections (banner, showroom, etc.)
- **quiz_questions:** Stores quiz questions
- **question_options:** Stores question options with images
- **system_settings:** Stores system-wide settings

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check database credentials in `api/config/database.php`
   - Ensure MySQL server is running
   - Verify database exists and is accessible

2. **CORS Errors**
   - Check that your server supports the API endpoints
   - Ensure PHP files are properly configured

3. **API Not Working**
   - Check PHP error logs
   - Verify file permissions
   - Test endpoints directly in browser

### Testing API Endpoints

Test individual endpoints:

```bash
# Get current product
curl http://localhost/sofa-quiz-lp/api/settings.php?key=current_product

# Get all products
curl http://localhost/sofa-quiz-lp/api/products.php

# Get sofa content
curl http://localhost/sofa-quiz-lp/api/content.php?product_key=sofa
```

## Migration from localStorage

If you have existing localStorage data, you can:

1. Export it using the dashboard's Export JSON feature
2. Import it back after setting up the database
3. The system will automatically save it to the database

## Security Notes

For production deployment:

1. Change default database credentials
2. Restrict API access if needed
3. Enable HTTPS
4. Validate and sanitize all inputs
5. Implement proper authentication if required

## Support

If you encounter issues:

1. Check PHP error logs
2. Verify database connections
3. Test API endpoints individually
4. Ensure all file permissions are correct