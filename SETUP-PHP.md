# PHP Setup Troubleshooting Guide

## Why PHP Isn't Working

The issue is that you're running on **Live Server (port 5500)** which is a static file server that **doesn't execute PHP**. Here's how to fix it:

## 🔧 **Solution Options**

### **Option 1: Use XAMPP (Recommended)**

1. **Download XAMPP:**
   - Go to https://www.apachefriends.org/
   - Download and install XAMPP

2. **Start Services:**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL**

3. **Move Project:**
   ```
   Copy your entire project folder to:
   C:\xampp\htdocs\sofa-quiz-lp\
   ```

4. **Access via:**
   ```
   http://localhost/sofa-quiz-lp/dashboard.html
   ```

### **Option 2: Use WAMP**

1. **Download WAMP:**
   - Go to http://www.wampserver.com/
   - Download and install

2. **Start Services:**
   - Start WAMP server
   - Ensure Apache and MySQL are running

3. **Move Project:**
   ```
   Copy to: C:\wamp64\www\sofa-quiz-lp\
   ```

4. **Access via:**
   ```
   http://localhost/sofa-quiz-lp/dashboard.html
   ```

### **Option 3: Use PHP Built-in Server**

1. **Check PHP Installation:**
   ```bash
   php --version
   ```

2. **Navigate to Project:**
   ```bash
   cd "C:\Users\ChrisLorence\Dropbox\My PC (ChrisLorence-PC)\Desktop\Work\sofa-quiz-lp"
   ```

3. **Start PHP Server:**
   ```bash
   php -S localhost:8000
   ```

4. **Access via:**
   ```
   http://localhost:8000/dashboard.html
   ```

## 🔍 **Diagnostic Steps**

### **Step 1: Test PHP Basic Functionality**

Once you have a PHP server running, test:
```
http://localhost/sofa-quiz-lp/api/test.php
```

**Expected response:**
```json
{
  "status": "success",
  "message": "PHP is working!",
  "method": "GET",
  "time": "2024-01-XX XX:XX:XX",
  "php_version": "8.x.x"
}
```

### **Step 2: Test Database Connection**

Test database connectivity:
```
http://localhost/sofa-quiz-lp/api/debug.php
```

**Expected response should show:**
- PHP version
- Database connection status
- Table existence status

### **Step 3: Setup Database**

1. **Open phpMyAdmin:**
   ```
   http://localhost/phpmyadmin
   ```

2. **Create Database:**
   - Click "New"
   - Database name: `automated_quiz`
   - Click "Create"

3. **Import Schema:**
   - Select `automated_quiz` database
   - Click "Import"
   - Choose file: `database/schema.sql`
   - Click "Go"

### **Step 4: Update Database Config**

Edit `api/config/database.php`:
```php
private $host = 'localhost';
private $db_name = 'automated_quiz';
private $username = 'root';        // Your MySQL username
private $password = '';            // Your MySQL password (usually empty for XAMPP)
```

## 🎯 **Quick Fix for Current Setup**

If you want to **keep using Live Server** for now, the fallback system will work perfectly with localStorage. The current setup should work without PHP.

### **Verify Fallback is Working:**

1. Open browser console in dashboard
2. You should see: `"PHP backend not available, using localStorage fallback"`
3. All functionality should work normally

## 🚨 **Common Issues & Solutions**

### **Issue 1: Port 5500 (Live Server)**
- **Problem:** Live Server doesn't execute PHP
- **Solution:** Use XAMPP/WAMP or PHP built-in server

### **Issue 2: Database Connection Fails**
- **Problem:** MySQL not running or wrong credentials
- **Solution:** Start MySQL service, check credentials

### **Issue 3: CORS Errors**
- **Problem:** Browser blocking requests
- **Solution:** PHP files include proper CORS headers

### **Issue 4: File Permissions**
- **Problem:** PHP can't access files
- **Solution:** Check folder permissions

## 🔧 **Testing Commands**

Run these in your project directory:

```bash
# Test if PHP is installed
php --version

# Start PHP server
php -S localhost:8000

# Test API endpoint
curl http://localhost:8000/api/test.php

# Test database debug
curl http://localhost:8000/api/debug.php
```

## ✅ **Success Checklist**

- [ ] PHP server running (XAMPP/WAMP/built-in)
- [ ] MySQL service started
- [ ] Database `automated_quiz` created
- [ ] Tables imported from schema.sql
- [ ] test.php returns success JSON
- [ ] debug.php shows database connected
- [ ] Dashboard loads without localStorage warnings

## 📞 **Need Help?**

If you're still having issues:

1. **Share the output** of `api/debug.php`
2. **Check console errors** in browser
3. **Verify which PHP server** you're using
4. **Confirm MySQL** is running

The fallback system ensures everything works regardless, but PHP gives you the full database functionality! 🚀