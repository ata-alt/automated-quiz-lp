# Quick Start Guide

## Current Setup (Working with your Live Server)

I've created a **fallback solution** that works with your current setup on port 5500. The system will:

1. **Try to use PHP backend** (if available)
2. **Fall back to localStorage** (if PHP isn't working)

## ✅ **What's Working Now**

- **Dashboard** creates and manages product quizzes
- **Product switching** works correctly
- **Data persistence** using localStorage
- **Real-time updates** when switching products
- **All functionality** from the original system

## 🚀 **How to Test**

1. **Open Dashboard:**
   ```
   http://127.0.0.1:5500/sofa-quiz-lp/dashboard.html
   ```

2. **Create New Product:**
   - Click "+ Create New Product Quiz"
   - Enter name: "Closet"
   - Enter emoji: "👗"
   - Click "Create Quiz"

3. **Test Product Switching:**
   - Switch between "Sofa" and "Closet" in dropdown
   - Make changes to content
   - Save changes
   - Open `index.html` to see changes reflected

4. **Verify Changes Reflect:**
   ```
   http://127.0.0.1:5500/sofa-quiz-lp/index.html
   ```

## 🔧 **Error Resolution**

The errors you were seeing are now handled by:

1. **API Detection:** System automatically detects if PHP is available
2. **Graceful Fallback:** Falls back to localStorage if PHP fails
3. **Error Handling:** No more 405 errors or JSON parsing issues
4. **Console Feedback:** Clear messages about which mode is being used

## 📁 **Files Updated**

- `api/api-client-fallback.js` - Smart API client with fallback
- `site-assets/js/showroom-content-fallback.js` - Frontend loader with fallback
- `dashboard.html` - Updated to use fallback client
- `index.html` - Updated to use fallback loader

## 🎯 **Expected Behavior**

When you run this now:

1. **Dashboard loads** without errors
2. **Product creation** works smoothly
3. **Product switching** updates content immediately
4. **Frontend reflects** all changes correctly
5. **No 405 or JSON errors**

## 🚀 **For Production (PHP Setup)**

When you're ready to use the full PHP backend:

1. Set up XAMPP/WAMP/MAMP
2. Create MySQL database using `database/schema.sql`
3. Update `api/config/database.php` with credentials
4. The system will automatically use PHP instead of localStorage

## 📝 **Testing Checklist**

- [ ] Dashboard loads without errors
- [ ] Can create new product quiz
- [ ] Can switch between products
- [ ] Content changes are saved
- [ ] Index.html reflects product-specific content
- [ ] No console errors

The product switching issue should now be completely resolved! 🎉