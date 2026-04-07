# Notification System - Quick Reference

## 📋 What's Implemented

### ✅ Notification Model
```
Notification Schema Fields:
├─ user (ObjectId, ref: User)
├─ message (String, max 500 chars)
├─ type (String: 'task', 'badge', 'system')
├─ isRead (Boolean, default: false)
├─ relatedId (ObjectId, optional link to task/badge)
├─ createdAt (Auto-generated)
└─ updatedAt (Auto-generated)
```

### ✅ API Endpoints (7 total)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/notifications` | Get all with pagination |
| GET | `/api/notifications/unread` | Get unread only |
| GET | `/api/notifications/stats` | Get statistics |
| PUT | `/notifications/:id/read` | Mark single as read |
| PUT | `/notifications/read` | Mark all as read |
| DELETE | `/notifications/:id` | Delete single |
| DELETE | `/notifications` | Delete all |

### ✅ Automatic Triggers

#### 1. Task Approved/Rejected ✓
- **When**: Teacher reviews task submission
- **Message**: Notification sent to student
- **Integration**: taskController.js → reviewSubmission()

#### 2. Badge Earned ✓
- **When**: Student reaches badge threshold
- **Message**: Sent to student automatically
- **Integration**: badgeController.js → checkAndAwardBadges()

#### 3. Task Submitted ✓
- **When**: Student submits task
- **Message**: Sent to teacher for review
- **Integration**: taskController.js → submitTask()

---

## 🚀 Quick Start

### 1. Test Notifications
```bash
# Run from backend directory
node test-notifications.js
```

### 2. Get Unread Notifications
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/notifications/unread
```

### 3. Mark All as Read
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/notifications/read
```

### 4. Get Statistics
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/notifications/stats
```

---

## 📁 Files Created

```
backend/
├─ models/
│  └─ Notification.js ✨ NEW
├─ controllers/
│  ├─ notificationController.js ✨ NEW
│  ├─ taskController.js (UPDATED)
│  └─ badgeController.js (UPDATED)
├─ routes/
│  └─ notifications.js ✨ NEW
├─ NOTIFICATION_DOCS.md ✨ NEW (Full API Docs)
├─ test-notifications.js ✨ NEW (Test Suite)
└─ server.js (UPDATED with route)
```

---

## 🔒 Security Features

✅ **JWT Authentication** - All endpoints protected
✅ **Authorization Checks** - Users can only access own notifications
✅ **Input Validation** - Message length, type validation
✅ **Error Handling** - Comprehensive error responses
✅ **Database Indexes** - Optimized query performance

---

## 💡 Usage Examples

### JavaScript/Frontend
```javascript
// Get unread count
async function getUnreadCount(token) {
  const response = await fetch('/api/notifications/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { data } = await response.json();
  return data.unreadNotifications;
}

// Mark as read
async function markAsRead(token, notificationId) {
  await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Get all notifications (paginated)
async function getNotifications(token, page = 1) {
  const response = await fetch(
    `/api/notifications?page=${page}&limit=20`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  return await response.json();
}
```

### Error Handling
```javascript
try {
  const response = await fetch('/api/notifications', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired - redirect to login
    } else if (response.status === 403) {
      // Unauthorized - show error
    }
  }
  
  const { success, data, message } = await response.json();
  if (success) {
    // Process notifications
  }
} catch (error) {
  console.error('Failed to fetch notifications:', error);
}
```

---

## 📊 API Response Formats

### Success (200)
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Operation successful"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "No token provided. Please log in first."
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Unauthorized to update this notification"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Notification not found"
}
```

---

## 🧪 Testing Checklist

- [ ] Run `node test-notifications.js`
- [ ] Verify login works
- [ ] Check get all notifications endpoint
- [ ] Check unread notifications endpoint
- [ ] Test mark single as read
- [ ] Test mark all as read
- [ ] Test statistics endpoint
- [ ] Test delete single notification
- [ ] Test unauthorized access (should be blocked)
- [ ] Test task submission notification (manual)
- [ ] Test task approval/rejection notification (manual)
- [ ] Test badge earned notification (manual)

---

## 🔧 Integration Points

### TaskController
```javascript
// When task is submitted - notify teacher
await createTaskSubmissionNotification(teacherId, studentName, taskTitle);

// When task is reviewed - notify student
await createTaskNotification(studentId, taskTitle, 'approved'|'rejected');
```

### BadgeController
```javascript
// When badge is earned - notify student
await createBadgeNotification(studentId, badgeName, badgeId);
```

---

## 📈 Performance Optimizations

✅ Database Indexes on:
- `user + createdAt` (for sorting)
- `user + isRead` (for filtering)

✅ Pagination Support (default 20 per page)

✅ Bulk Operations for efficiency:
- Mark multiple as read in one call
- Delete multiple in one call

✅ Statistics aggregation for quick counts

---

## 🎯 Next Steps for Frontend

1. **Notification Bell Icon**
   - Show unread count badge
   - Display unread notifications in dropdown

2. **Notification Center Page**
   - List all notifications with pagination
   - Basic filters (read/unread, type)
   - Bulk actions (mark all as read, delete)

3. **Real-time Updates** (Future)
   - WebSocket integration for instant notifications
   - Notification sound on new message

4. **Toast/Alert Notifications** (Future)
   - Show toast when new notification arrives
   - Toast for badge awards

---

## 📞 Support

**Full Documentation**: See `NOTIFICATION_DOCS.md`
**Test Suite**: Run `node test-notifications.js`
**API Base**: `http://localhost:5000/api/notifications`

All endpoints require JWT authentication in Authorization header!

---

## ✨ Summary

**EcoVerse Notification System - Complete & Production Ready!**
- ✅ 7 Fully functional endpoints
- ✅ Automatic triggers for tasks, badges, submissions
- ✅ Pagination, statistics, bulk operations
- ✅ Complete test suite
- ✅ Full documentation
- ✅ Security & error handling
- ✅ Database optimization

**Module Status: COMPLETED ✅**
