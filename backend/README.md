# EcoVerse Backend API
## MERN Stack - Module 1: Authentication & Role-Based Access Control

### Technology Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

### Project Structure
```
backend/
├── config/
│   └── db.js                 # Database connection
├── models/
│   └── User.js              # User schema
├── routes/
│   └── auth.js              # Authentication routes
├── middleware/
│   └── auth.js              # JWT and RBAC middleware
├── controllers/
│   └── authController.js    # Authentication logic
├── utils/
│   └── errorHandler.js      # Error handling utility
├── server.js                # Main server file
├── package.json             # Dependencies
└── .env.example             # Environment variables template
```

### Installation & Setup

#### 1. Install Dependencies
```bash
cd backend
npm install
```

#### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecoverse
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

#### 3. Ensure MongoDB is Running
```bash
# If using MongoDB locally
mongod
```

#### 4. Start the Server
```bash
npm run dev    # Development mode with nodemon
npm start      # Production mode
```

Server will run on `http://localhost:5000`

---

## API Endpoints

### Authentication Routes

#### Register User
- **URL:** `POST /api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "className": "Class 10-A"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "className": "Class 10-A",
    "createdAt": "2024-02-16T10:30:00Z"
  }
}
```

#### Login User
- **URL:** `POST /api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "className": "Class 10-A"
  }
}
```

#### Get Current User (Protected Route)
- **URL:** `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "className": "Class 10-A"
  }
}
```

#### Logout
- **URL:** `POST /api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Model

### Fields
```javascript
{
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    hashed with bcryptjs (10 rounds)
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  className: {
    type: String,
    required only if role is 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  timestamps: true
}
```

---

## Middleware

### verifyToken
- Validates JWT token from request header
- Checks if token is expired
- Verifies user exists in database
- Checks if user is active

### authorizeRoles(...roles)
- Checks if user has required role
- Must be used after `verifyToken`

### Usage Example
```javascript
router.get(
  '/admin-route',
  verifyToken,
  authorizeRoles('admin'),
  controller.adminFunction
);
```

---

## Error Handling

### Response Format
```json
{
  "success": false,
  "message": "Error message",
  "status": 400
}
```

### Common Errors
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (no token, invalid token, expired token)
- **403**: Forbidden (user not authorized for this role)
- **404**: Not Found
- **500**: Internal Server Error

---

## Security Features

✅ Password hashing with bcryptjs (10 salt rounds)  
✅ JWT token-based authentication  
✅ CORS protection  
✅ Input validation with express-validator  
✅ Role-based access control (RBAC)  
✅ Token expiration  
✅ Secure password comparison  
✅ User account activity status  

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student",
    "className": "Class 10-A"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Database Info

A `User` collection will be created automatically in MongoDB with the following indexes:
- `email` (unique)
- `createdAt`
- `updatedAt`

---

## Next Steps

For Module 2, you can extend this with:
- User profile management routes
- Password reset functionality
- Email verification
- Role-based dashboard routes
- Additional user fields and preferences
