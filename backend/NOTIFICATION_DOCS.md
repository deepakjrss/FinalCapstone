# EcoVerse Notification System - API Documentation

## Overview
The Notification System is the final module of EcoVerse backend that manages user notifications for task reviews, badge achievements, and system messages.

## Features
- ✅ Automatic notifications for approved/rejected tasks
- ✅ Badge earned notifications
- ✅ Task submission notifications for teachers
- ✅ Pagination support
- ✅ Unread notification tracking
- ✅ Bulk operations (mark all as read, delete all)
- ✅ Statistics and analytics
- ✅ Fully protected routes (authentication required)

---

## Database Model

### Notification Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),          // Recipient user
  message: String,                      // Notification message
  type: String,                         // 'task', 'badge', or 'system'
  isRead: Boolean,                      // Default: false
  relatedId: ObjectId,                  // Reference to task/badge
  createdAt: Date,                      // Auto-generated
  updatedAt: Date                       // Auto-generated
}
```

---

## API Endpoints

### 1. GET /api/notifications
**Get all notifications with pagination**

- **Authentication**: Required ✅
- **Method**: GET
- **Query Parameters**:
  - `page` (optional): Page number, default 1
  - `limit` (optional): Items per page, default 20

- **Example Request**:
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/notifications?page=1&limit=20"
```

- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "64f5a2c3e1f4d8b7c9e3f2a1",
        "user": "64f5a2c3e1f4d8b7c9e3f2a0",
        "message": "Congratulations! You've earned the 'Green Guardian' badge! 🏆",
        "type": "badge",
        "isRead": false,
        "relatedId": "64f5a2c3e1f4d8b7c9e3f2a2",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "_id": "64f5a2c3e1f4d8b7c9e3f2a3",
        "user": "64f5a2c3e1f4d8b7c9e3f2a0",
        "message": "Your task submission 'Plant Trees' has been approved! ✓",
        "type": "task",
        "isRead": true,
        "createdAt": "2024-01-14T15:20:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalNotifications": 50,
      "unreadCount": 12
    }
  },
  "message": "Notifications retrieved successfully"
}
```

---

### 2. GET /api/notifications/unread
**Get only unread notifications**

- **Authentication**: Required ✅
- **Method**: GET
- **Query Parameters**: None

- **Example Request**:
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/notifications/unread"
```

- **Success Response** (200):
```json
{
  "success": true,
  "count": 5,
  "notifications": [
    {
      "_id": "64f5a2c3e1f4d8b7c9e3f2a1",
      "user": "64f5a2c3e1f4d8b7c9e3f2a0",
      "message": "Your task submission 'Water Plants' was rejected. Please review the feedback.",
      "type": "task",
      "isRead": false,
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ],
  "message": "Unread notifications retrieved successfully"
}
```

---

### 3. GET /api/notifications/stats
**Get notification statistics**

- **Authentication**: Required ✅
- **Method**: GET
- **Query Parameters**: None

- **Example Request**:
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/notifications/stats"
```

- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "totalNotifications": 50,
    "unreadNotifications": 12,
    "readNotifications": 38,
    "byType": {
      "task": 20,
      "badge": 15,
      "system": 15
    }
  },
  "message": "Notification statistics retrieved successfully"
}
```

---

### 4. PUT /api/notifications/:id/read
**Mark a single notification as read**

- **Authentication**: Required ✅
- **Method**: PUT
- **URL Parameters**:
  - `id` (required): Notification ID

- **Example Request**:
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/notifications/64f5a2c3e1f4d8b7c9e3f2a1/read"
```

- **Success Response** (200):
```json
{
  "success": true,
  "notification": {
    "_id": "64f5a2c3e1f4d8b7c9e3f2a1",
    "user": "64f5a2c3e1f4d8b7c9e3f2a0",
    "message": "Your task submission 'Clean Beach' has been approved! ✓",
    "type": "task",
    "isRead": true,
    "createdAt": "2024-01-15T08:30:00Z"
  },
  "message": "Notification marked as read"
}
```

- **Error Response** (403 - Not owned by user):
```json
{
  "success": false,
  "message": "Unauthorized to update this notification"
}
```

---

### 5. PUT /api/notifications/read
**Mark ALL notifications as read (bulk operation)**

- **Authentication**: Required ✅
- **Method**: PUT
- **Body**: Empty

- **Example Request**:
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/notifications/read"
```

- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "modifiedCount": 12
  },
  "message": "12 notifications marked as read"
}
```

---

### 6. DELETE /api/notifications/:id
**Delete a single notification**

- **Authentication**: Required ✅
- **Method**: DELETE
- **URL Parameters**:
  - `id` (required): Notification ID

- **Example Request**:
```bash
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/notifications/64f5a2c3e1f4d8b7c9e3f2a1"
```

- **Success Response** (200):
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

### 7. DELETE /api/notifications
**Delete ALL notifications (bulk delete)**

- **Authentication**: Required ✅
- **Method**: DELETE
- **Body**: Empty

- **Example Request**:
```bash
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/notifications"
```

- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "deletedCount": 30
  },
  "message": "30 notifications deleted"
}
```

---

## Automatic Notification Triggers

### 1. Task Approved/Rejected
- **When**: Teacher reviews and approves/rejects a task submission
- **Recipient**: Student who submitted
- **Type**: `task`
- **Message Examples**:
  - ✅ Approved: "Your task submission 'Plant Trees' has been approved! ✓"
  - ❌ Rejected: "Your task submission 'Plant Trees' was rejected. Please review the feedback."

### 2. Badge Earned
- **When**: Student reaches badge threshold
- **Recipient**: Student
- **Type**: `badge`
- **Message**: "Congratulations! You've earned the '[Badge Name]' badge! 🏆"

### 3. Task Submission (Teacher Notification)
- **When**: Student submits a task
- **Recipient**: Teacher who created the task
- **Type**: `task`
- **Message**: "[Student Name] has submitted a task: '[Task Title]'. Please review their submission."

---

## Error Responses

### 401 - Unauthorized (No Token)
```json
{
  "success": false,
  "message": "No token provided. Please log in first."
}
```

### 403 - Forbidden (Not Owner)
```json
{
  "success": false,
  "message": "Unauthorized to update this notification"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Notification not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## Frontend Integration

### Using with Fetch API
```javascript
// Get unread notifications
const getUnreadNotifications = async (token) => {
  const response = await fetch('http://localhost:5000/api/notifications/unread', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
};

// Mark notification as read
const markAsRead = async (token, notificationId) => {
  const response = await fetch(
    `http://localhost:5000/api/notifications/${notificationId}/read`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return await response.json();
};

// Mark all as read
const markAllAsRead = async (token) => {
  const response = await fetch('http://localhost:5000/api/notifications/read', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
};
```

---

## Testing

### Using Postman

1. **Import Headers** (all requests):
   - `Authorization`: `Bearer <your_jwt_token>`
   - `Content-Type`: `application/json`

2. **Test Unread Notifications**:
   - GET: `http://localhost:5000/api/notifications/unread`

3. **Test Statistics**:
   - GET: `http://localhost:5000/api/notifications/stats`

4. **Test Mark as Read**:
   - PUT: `http://localhost:5000/api/notifications/64f5a2c3e1f4d8b7c9e3f2a1/read`

### Using cURL
```bash
# Get all notifications
curl -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:5000/api/notifications

# Get unread only
curl -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:5000/api/notifications/unread

# Mark notification as read
curl -X PUT \
  -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:5000/api/notifications/NOTIFICATION_ID/read
```

---

## Best Practices

1. **Always include Authorization header** with Bearer token
2. **Use pagination** for large notification lists (page & limit params)
3. **Check unread count** first before fetching all notifications
4. **Clean up old notifications** periodically with bulk delete
5. **Handle errors gracefully** - always check `success` field
6. **Cache notification stats** to reduce server load
7. **Implement real-time updates** with WebSocket for live notifications (future enhancement)

---

## Database Indexes
```javascript
// For optimized queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
```

---

## Summary

✅ **Complete Notification System**
- 7 fully functional endpoints
- Automatic triggers on task reviews and badge earning
- Teacher notifications for task submissions
- Pagination and statistics
- Bulk operations support
- Role-based access control
- Production-ready error handling

**All endpoints are protected with JWT authentication!**
