# How to Clear Old Static Data from Student Dashboard

If you're still seeing static/hardcoded certificates and courses, it means your browser has old mock data stored in localStorage. Here's how to clear it:

## Method 1: Use the Developer Tools in the Dashboard (Easiest)

1. Go to your Student Dashboard
2. On the Home page, look for **"🛠️ Developer Tools"** section (it appears as a collapsible section if you have any data)
3. Click to expand it
4. Click the **"Clear All Data"** button
5. Confirm the action
6. Refresh the page

Your library and certificates sections should now be empty!

---

## Method 2: Use Browser Developer Console

1. Open your browser's Developer Console:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)

2. Copy and paste this code into the console and press Enter:

```javascript
// Clear all student data
localStorage.removeItem('purchasedBooks');
localStorage.removeItem('studentCertificates');
localStorage.removeItem('studentActivity');

// Initialize empty arrays
localStorage.setItem('purchasedBooks', JSON.stringify([]));
localStorage.setItem('studentCertificates', JSON.stringify([]));
localStorage.setItem('studentActivity', JSON.stringify([]));

console.log('✅ All student data cleared!');
console.log('Please refresh the page.');
```

3. Refresh the page (`F5` or `Ctrl+R`)

---

## Method 3: Clear All Browser Data (Nuclear Option)

1. Open Developer Tools (`F12`)
2. Go to the **Application** tab (Chrome/Edge) or **Storage** tab (Firefox)
3. In the left sidebar, find **Local Storage**
4. Click on your website's domain
5. Right-click and select **"Clear"** or delete the following keys:
   - `purchasedBooks`
   - `studentCertificates`
   - `studentActivity`
6. Refresh the page

---

## Verify It Worked

After clearing the data:

1. Go to **My Library** - Should show: "No books in your library yet"
2. Go to **Certificates** - Should show: "No certificates yet"
3. The Home page should show **0 Books in Library**

---

## How to Test with Real Data

1. Go to the **Marketplace**
2. Add some books to your cart
3. Go to **Checkout**
4. Complete payment with any method (MetaMask, Stripe, or Zynle)
5. Return to **Student Dashboard**
6. Check **My Library** - Your purchased books should appear!

---

## Technical Details

The application now uses **real data flow**:
- Purchased books are stored in `localStorage: purchasedBooks`
- Certificates are stored in `localStorage: studentCertificates`
- All mock/hardcoded data has been removed
- Data persists across browser sessions
- Empty arrays are initialized on first load

---

## Need Help?

If you're still seeing static data after following these steps:
1. Make sure you've refreshed the page after clearing data
2. Check the browser console for any errors
3. Try clearing your browser cache completely
4. Make sure you're using the latest version of the code




