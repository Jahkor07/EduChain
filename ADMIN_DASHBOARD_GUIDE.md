# 🛡️ Admin Dashboard - Complete Guide

## Overview

The Admin Dashboard is now fully functional with comprehensive management capabilities for the entire EduChain platform.

---

## 🚀 How to Access Admin Dashboard

### 1. Create Admin User (First Time Only)

Run this command in the backend directory:
```bash
cd backend
node scripts/createAdmin.js
```

You'll get:
```
✅ Admin user created successfully!
📧 Email:    admin@educhain.com
🔑 Password: admin123
```

### 2. Login as Admin

Go to: `http://localhost:3000/login`

**Credentials:**
- Email: `admin@educhain.com`
- Password: `admin123`

You'll be automatically redirected to `/admin-dashboard`

---

## 🎯 Admin Dashboard Features

### 1. **📊 Overview**
View real-time platform statistics:
- Total Users
- Total Educators
- Total Students
- Pending Educator Verifications
- Total NFTs Minted
- Active Reports
- Total Books in Marketplace
- Active Books

### 2. **👥 User Management**
Complete user administration:

**Add New Users:**
- Click "➕ Add New User" button
- Fill in:
  - First Name
  - Last Name
  - Email
  - Password
  - Role (Student/Educator/Admin)
- Click "Create User"

**Delete Users:**
- View all users in the system
- Each user shows:
  - Name and email
  - Role badge (color-coded)
  - Join date
- Click "🗑️ Delete" to remove user
- Admin users cannot be deleted (protected)

**User List Features:**
- Color-coded role badges:
  - 🔴 Admin (Red)
  - 🟣 Educator (Purple)
  - 🔵 Student (Blue)
- Avatar with initials
- Full user details
- One-click deletion

### 3. **👨‍🏫 Educator Verification**
Approve or reject educator applications:

**Process:**
1. View all pending educator applications
2. See educator details:
   - Name and email
   - Institution
   - Subject area
   - Application date
3. Take action:
   - **✅ Approve** - Educator gets verified status
   - **❌ Reject** - Application is rejected and removed

**Verification Flow:**
- New educators register → Appear in pending list
- Admin reviews → Approves or rejects
- Approved educators can add books to marketplace
- Rejected educators are removed from system

### 4. **🏪 Marketplace Monitor**
Monitor and moderate all marketplace items:

**Features:**
- **Filter Options:**
  - All - Show all books
  - Active - Show only active books
  - Inactive - Show only inactive books

- **Summary Stats:**
  - Total Books
  - Active Books
  - Inactive Books

- **Book Management:**
  - View book cover, title, author
  - See educator who added it
  - See price and add date
  - Status indicator (Active/Inactive)

- **Actions:**
  - **✅ Activate** - Make book visible in marketplace
  - **⏸️ Deactivate** - Hide book from marketplace
  - **🗑️ Delete** - Permanently remove book

### 5. **⚙️ Platform Configuration**
Configure platform-wide settings:

**Settings Available:**
- Minting Fee (ETH)
- Max File Size (MB)
- Plagiarism Threshold (%)
- Allowed File Types
- Auto-approve Educators (checkbox)

Click "💾 Save Configuration" to apply changes.

### 6. **🚨 Reports**
Handle user reports and issues:
- View all active reports
- Resolve reports with notes
- Track resolution history

---

## 🔔 Recent Activity Sidebar

The sidebar shows the last 5 admin activities:

**Activity Types:**
- 👤 User Created
- 🗑️ User Deleted
- ✅ Educator Verified
- ❌ Educator Rejected
- 🛡️ Item Moderated
- ✔️ Report Resolved

**Features:**
- Auto-refreshes
- Shows timestamp
- Color-coded icons
- Scrollable list

---

## 🔒 Security Features

1. **Role-Based Access:**
   - Only admin users can access admin dashboard
   - Protected routes with authentication
   - JWT token verification

2. **Self-Protection:**
   - Admins cannot delete their own account
   - Prevents accidental lockout

3. **Audit Trail:**
   - All actions logged to console
   - Activity tracking in sidebar
   - Timestamp on all actions

---

## 🎨 UI Features

### Header:
- ✅ No "Connect Wallet" button (removed as requested)
- ✅ Logout button matches student/educator style
- ✅ Shows admin name
- ✅ Gradient logo

### Sidebar:
- ✅ 6 main sections
- ✅ Recent Activity at bottom
- ✅ Fully responsive
- ✅ Smooth animations
- ✅ Space fully utilized

### Design:
- Dark theme with purple/blue gradients
- Glass-morphism effects
- Smooth animations (framer-motion)
- Responsive grid layouts
- Color-coded status indicators

---

## 📡 Backend API Endpoints

All admin routes are protected with `auth` and `requireRole(["admin"])`:

### User Management:
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `POST /api/admin/users/create` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Statistics:
- `GET /api/admin/stats` - Get platform statistics

### Educator Verification:
- `GET /api/admin/educators/pending` - Get pending educators
- `POST /api/admin/educators/:id/verify` - Approve/reject educator

### Marketplace:
- `GET /api/admin/marketplace/all` - Get all marketplace items
- `POST /api/admin/marketplace/:id/moderate` - Moderate item (activate/deactivate/delete)

### Configuration:
- `GET /api/admin/config` - Get platform config
- `PUT /api/admin/config` - Update platform config

### Reports:
- `GET /api/admin/reports` - Get all reports
- `POST /api/admin/reports/:id/resolve` - Resolve report

---

## 🔄 How Educator Verification Works

### Step-by-Step Process:

1. **Educator Registers:**
   - New educator signs up through signup page
   - Account created with `verified: false`

2. **Admin Reviews:**
   - Go to "Educator Verification" section
   - See all pending educators
   - Review their information:
     - Name, email
     - Institution, subject
     - Application date

3. **Admin Takes Action:**
   
   **Option A - Approve:**
   - Click "✅ Approve"
   - Educator's `verified` field set to `true`
   - Educator can now add books to marketplace
   - Success message shown
   
   **Option B - Reject:**
   - Click "❌ Reject"
   - Educator account is deleted
   - They cannot access the platform
   - Success message shown

4. **Result:**
   - Approved educators appear in "User Management"
   - They can access Educator Dashboard
   - They can add books to marketplace
   - Rejected educators are removed completely

---

## 💡 Tips & Best Practices

### User Management:
- Always verify email before creating users
- Use strong passwords
- Assign appropriate roles
- Review users regularly

### Educator Verification:
- Check institution and subject area
- Verify credentials if possible
- Reject suspicious applications
- Keep track of approval/rejection reasons

### Marketplace Monitoring:
- Review new books regularly
- Deactivate inappropriate content
- Monitor pricing
- Check for duplicate listings

### Platform Configuration:
- Set reasonable plagiarism thresholds
- Adjust file size limits based on server capacity
- Review auto-approve settings carefully
- Test changes before deploying

---

## 🐛 Troubleshooting

### "Cannot access admin dashboard"
- Make sure you're logged in as admin
- Check user role in database
- Verify token is valid

### "No pending educators"
- Create test educator account
- They'll appear in pending list
- Test approval/rejection flow

### "Marketplace items not loading"
- Check backend is running
- Verify Book model exists
- Check educator has added books

### "Stats showing 0"
- Refresh the page
- Check database has data
- Verify API routes are working

---

## 📝 Development Notes

### Activity Logging:
All admin actions are logged to:
- Browser console (for debugging)
- localStorage: `adminActivity` (for sidebar)
- Backend console (for audit trail)

### Data Storage:
- User data: MongoDB
- Activity logs: localStorage
- Platform config: In-memory (can be moved to DB)

### Future Enhancements:
- Email notifications for verifications
- Detailed audit logs
- Export user data
- Bulk actions
- Advanced filtering
- Analytics dashboard

---

## ✅ Summary

The Admin Dashboard is now **fully functional** with:

✅ User Management (Add/Delete)
✅ Educator Verification (Approve/Reject)
✅ Marketplace Monitoring (Activate/Deactivate/Delete)
✅ Platform Configuration
✅ Reports Handling
✅ Recent Activity Tracking
✅ Real-time Statistics
✅ Responsive Design
✅ Secure Authentication
✅ Clean UI matching other dashboards

All requested features have been implemented! 🎉



