# EcoVerse - Full Stack MERN Application
## Module 1: Authentication & Role-Based Access Control (RBAC)

## 📋 Project Overview

EcoVerse is a full-stack educational platform built with the MERN stack (MongoDB, Express, React, Node). Module 1 implements a complete authentication system with role-based access control.

### Features Implemented
✅ User registration and login  
✅ JWT token-based authentication  
✅ Role-based access control (RBAC)  
✅ Three user roles: Student, Teacher, Admin  
✅ Protected routes and APIs  
✅ Beautiful, responsive UI with TailwindCSS  
✅ Production-ready code structure  

---

## 📁 Project Structure

```
Final capstone/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # Database connection
│   ├── middleware/
│   │   └── auth.js                  # JWT & RBAC middleware
│   ├── models/
│   │   └── User.js                  # User schema
│   ├── controllers/
│   │   └── authController.js        # Auth business logic
│   ├── routes/
│   │   └── auth.js                  # Auth endpoints
│   ├── utils/
│   │   └── errorHandler.js          # Error utilities
│   ├── server.js                    # Express server
│   ├── package.json                 # Backend dependencies
│   ├── .env.example                 # Config template
│   └── README.md                    # Backend documentation
│
└── frontend/
    ├── public/
    │   └── index.html               # HTML template
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js       # Auth state management
    │   ├── components/
    │   │   └── PrivateRoute.js      # Protected routes
    │   ├── pages/
    │   │   ├── Login.js             # Login page
    │   │   ├── Register.js          # Register page
    │   │   ├── NotFound.js          # 404 page
    │   │   ├── Unauthorized.js      # 401 page
    │   │   └── Dashboard/
    │   │       ├── StudentDashboard.js
    │   │       ├── TeacherDashboard.js
    │   │       └── AdminDashboard.js
    │   ├── App.js                   # Main app routing
    │   ├── index.js                 # React entry point
    │   └── index.css                # Global styles
    ├── package.json                 # Frontend dependencies
    ├── tailwind.config.js           # TailwindCSS config
    ├── postcss.config.js            # PostCSS config
    ├── .env.example                 # Config template
    └── README.md                    # Frontend documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend folder**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Update environment variables**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecoverse
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

5. **Start MongoDB** (if running locally)
```bash
mongod
```

6. **Run the server**
```bash
npm run dev    # With auto-reload (requires nodemon)
npm start      # Standard start
```

✅ Backend running on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Update environment variables**
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. **Start development server**
```bash
npm start
```

✅ Frontend running on `http://localhost:3000`

---

## 📊 Database Models

### User Model
```javascript
{
  name: String (required, min 2 chars),
  email: String (required, unique),
  password: String (required, hashed with bcrypt, min 6 chars),
  role: Enum['student', 'teacher', 'admin'] (default: 'student'),
  className: String (required if role is 'student'),
  isActive: Boolean (default: true),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🔐 Authentication Flow

### Registration
1. User fills registration form
2. Data sent to `POST /api/auth/register`
3. Backend validates data
4. Password hashed with bcryptjs
5. User saved to MongoDB
6. JWT token generated
7. Token returned and stored in localStorage
8. User redirected to appropriate dashboard

### Login
1. User enters email and password
2. Data sent to `POST /api/auth/login`
3. Backend finds user by email
4. Password compared using bcryptjs
5. JWT token generated
6. Token returned and stored in localStorage
7. User redirected to appropriate dashboard

### Protected Routes
1. Auth context checks for token in localStorage
2. If no token, redirect to login
3. If token exists, fetch user profile via `GET /api/auth/me`
4. PrivateRoute component checks user role
5. If role doesn't match, redirect to unauthorized
6. If all checks pass, show dashboard

---

## 🛡️ Authorization & Roles

### Student Role
- Can access `/student-dashboard`
- View courses, assignments, progress
- Cannot access teacher or admin areas

### Teacher Role
- Can access `/teacher-dashboard`
- Manage courses and students
- Grade assignments
- Cannot access admin panel

### Admin Role
- Can access `/admin-dashboard`
- Manage all users
- Configure system settings
- View system analytics

---

## 📡 API Endpoints

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "className": "Class 10-A"
}

Response 201:
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": { ... }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "Logged in successfully",
  "token": "jwt_token",
  "user": { ... }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "user": { ... }
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🧪 Testing

### Test Accounts (Create these first)

**Student Account**
- Email: student@example.com
- Password: password123
- Class: Class 10-A

**Teacher Account**
- Email: teacher@example.com
- Password: password123

**Admin Account**
- Email: admin@example.com
- Password: password123

### Testing Steps

1. **Test Registration**
   - Go to http://localhost:3000/register
   - Fill in form with your details
   - Select role "Student" and enter class
   - Click Register

2. **Test Login**
   - Go to http://localhost:3000/login
   - Enter registered email and password
   - Click Login
   - Should redirect to student dashboard

3. **Test Role-Based Access**
   - Try accessing `/teacher-dashboard` as student
   - Should redirect to unauthorized page
   - Logout and login as teacher
   - Should access teacher dashboard

4. **Test Protected Routes**
   - Remove token from localStorage (DevTools)
   - Try accessing any dashboard
   - Should be redirected to login

---

## 🔧 Configuration Files

### Backend .env
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecoverse
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Frontend .env
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📦 Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT tokens
- **cors**: Cross-origin requests
- **express-validator**: Input validation
- **dotenv**: Environment variables

### Frontend
- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **tailwindcss**: Styling

---

## ✨ Key Features

### Security
✅ Passwords hashed with bcrypt (10 rounds)  
✅ JWT token-based authentication  
✅ CORS protection  
✅ Input validation  
✅ Role-based access control  
✅ Token expiration  
✅ Secure password comparison  

### Code Quality
✅ Clean, modular code structure  
✅ Separation of concerns  
✅ Error handling  
✅ Input validation  
✅ Reusable components  
✅ Production-ready code  

### User Experience
✅ Beautiful, responsive UI  
✅ Loading states  
✅ Error messages  
✅ Form validation  
✅ Smooth redirects  
✅ Persistent authentication  

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, ensure IP is whitelisted

### CORS Errors
- Verify `CLIENT_URL` in backend `.env`
- Check frontend `REACT_APP_API_URL`
- Should match exactly

### Token Not Persisting
- Check local storage in DevTools
- Clear localStorage and login again
- Check JWT_SECRET matches between frontend/backend

### Routes Not Working
- Clear browser cache
- Restart development servers
- Check route paths in App.js

---

## 📈 Next Steps

After completing Module 1, you can extend the application with:

- **Module 2**: User profiles and preferences
- **Module 3**: Course management
- **Module 4**: Assignment system
- **Module 5**: Grading and evaluation
- **Module 6**: Notifications
- **Module 7**: File uploads
- **Module 8**: Real-time features (WebSockets)

---

## 📝 Notes

- Change `JWT_SECRET` and `MONGODB_URI` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Set proper CORS origins
- Use secure session storage
- Implement rate limiting
- Add logging and monitoring
- Set up database backups

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [JWT.io](https://jwt.io/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)

---

## 📄 License

This project is open source and available under the MIT License.

---

## ⭐ Support

If you find this project helpful, please consider giving it a star!

For issues or questions, please open an issue in the repository.

---

**Created:** February 16, 2026  
**Status:** Module 1 Complete ✅  
**Version:** 1.0.0
