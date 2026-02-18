# 🚀 EcoVerse - Quick Setup & Reference Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecoverse
JWT_SECRET=dev-secret-key-change-in-production
CLIENT_URL=http://localhost:3000
```

Start MongoDB (if local):
```bash
mongod
```

Start backend:
```bash
npm run dev    # Auto-reload with nodemon
```

✅ Backend ready on `http://localhost:5000`

---

### Step 2: Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

✅ Frontend ready on `http://localhost:3000`

---

## 📱 Using the Application

### 1. Register First Time
- Go to `http://localhost:3000/register`
- Fill in form:
  - **Name**: Your name
  - **Email**: your@email.com
  - **Password**: At least 6 characters
  - **Role**: Student / Teacher / Admin
  - **Class** (Students only): Your class name
- Click Register
- Will auto-login and redirect to dashboard

### 2. Login
- Go to `http://localhost:3000/login`
- Enter email and password
- Click Login
- Redirected to appropriate dashboard

### 3. View Dashboards
- **Student**: View courses, assignments, progress
- **Teacher**: Manage courses and students
- **Admin**: Manage users and system settings

### 4. Logout
- Click Logout button on any dashboard
- Returns to login page

---

## 🧪 Test Users

Create these via registration first:

| Role | Email | Password | Class |
|------|-------|----------|-------|
| Student | student@example.com | password123 | Class 10-A |
| Teacher | teacher@example.com | password123 | - |
| Admin | admin@example.com | password123 | - |

---

## 📡 API Routes (Backend)

### Authentication Endpoints

**Register**  
`POST /api/auth/register`

**Login**  
`POST /api/auth/login`

**Get Current User**  
`GET /api/auth/me` (Requires token)

**Logout**  
`POST /api/auth/logout` (Requires token)

---

## 🌐 UI Routes (Frontend)

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes
- `/student-dashboard` - Student dashboard
- `/teacher-dashboard` - Teacher dashboard
- `/admin-dashboard` - Admin dashboard

### Error Pages
- `/unauthorized` - 401 page
- `/404` - 404 page

---

## 🔐 Authentication Details

### How It Works
1. User registers → Password hashed with bcrypt
2. Login → JWT token generated and returned
3. Token stored in localStorage
4. All API requests include token in header: `Authorization: Bearer <token>`
5. Backend verifies token on protected routes
6. Frontend passes token in Context API state

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📂 File Organization

### Backend Structure
```
backend/
├── server.js              ← Start here
├── config/db.js          ← Database connection
├── models/User.js        ← User schema
├── controllers/           ← Business logic
├── routes/auth.js        ← API endpoints
├── middleware/auth.js    ← JWT & RBAC
└── package.json          ← Dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── App.js            ← Main routing
│   ├── index.js          ← Entry point
│   ├── context/
│   │   └── AuthContext.js ← Auth state
│   ├── components/
│   │   └── PrivateRoute.js ← Route protection
│   └── pages/
│       ├── Login.js
│       ├── Register.js
│       └── Dashboard/
└── package.json          ← Dependencies
```

---

## 🛠️ Common Commands

### Backend
```bash
npm install              # Install dependencies
npm start               # Start production
npm run dev             # Start with auto-reload
npm run build           # Build for production
```

### Frontend
```bash
npm install             # Install dependencies
npm start              # Start development
npm build              # Build for production
npm test               # Run tests
```

---

## 🔍 Debugging Tips

### Check Backend Logs
- Look for errors in terminal where `npm run dev` runs
- Check MongoDB connection status

### Check Frontend Errors
- Open DevTools (F12)
- Console tab shows JavaScript errors
- Network tab shows API requests
- Application → LocalStorage shows token

### Test API with cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"test123","role":"student","className":"Class A"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'

# Get user (replace TOKEN with actual JWT)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## ⚠️ Common Issues & Fixes

### Issue: "Cannot POST /api/auth/register"
**Fix**: Ensure backend is running on port 5000

### Issue: "CORS error" or "blocked by CORS policy"
**Fix**: Check `CLIENT_URL` in backend `.env` matches frontend URL

### Issue: "Invalid token" error
**Fix**: 
1. Clear localStorage: `localStorage.clear()`
2. Login again
3. Or restart both servers

### Issue: "400 Validation failed"
**Fix**: 
- Check password is at least 6 characters
- Check email format is valid
- Check all required fields filled

### Issue: MongoDB connection error
**Fix**:
1. Ensure MongoDB is running: `mongod`
2. Check connection string in `.env`
3. For MongoDB Atlas, whitelist your IP

### Issue: "Password must be at least 6 characters"
**Fix**: Use a password with 6+ characters

### Issue: Can't access dashboard after login
**Fix**:
1. Clear browser cache
2. Check user role matches route
3. Check token in localStorage (F12 → Application)

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random key
- [ ] Change `MONGODB_URI` to production database
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Set proper CORS origins (not `*`)
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Enable password reset
- [ ] Add email verification
- [ ] Enable 2FA
- [ ] Set up database backups
- [ ] Add monitoring and alerts

---

## 📊 Technology Versions

**Backend:**
- Node.js 14+
- Express 4.18+
- MongoDB 4.0+
- Mongoose 7.0+

**Frontend:**
- React 18+
- React Router 6+
- TailwindCSS 3+
- Axios 1.3+

---

## 📖 File Reference

### Key Backend Files
- [Backend README](./backend/README.md) - Full backend docs
- [User Model](./backend/models/User.js) - Database schema
- [Auth Controller](./backend/controllers/authController.js) - Login/Register logic
- [Auth Middleware](./backend/middleware/auth.js) - Token verification
- [Auth Routes](./backend/routes/auth.js) - API endpoints

### Key Frontend Files
- [Frontend README](./frontend/README.md) - Full frontend docs
- [AuthContext](./frontend/src/context/AuthContext.js) - State management
- [PrivateRoute](./frontend/src/components/PrivateRoute.js) - Route protection
- [App.js](./frontend/src/App.js) - Main routing
- [Login Page](./frontend/src/pages/Login.js) - Login component

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              React Frontend (3000)                  │
│  ┌────────────────────────────────────────────────┐ │
│  │ Auth Context (manages user, token, login)      │ │
│  │ PrivateRoute (protected routes)                 │ │
│  │ Pages: Login, Register, Dashboards            │ │
│  └────────────────────────────────────────────────┘ │
└────────────┬─────────────────────────────┬──────────┘
             │                             │
          JWT Token              HTTP Requests
             │                             │
┌────────────▼───────────────────────────▼──────────┐
│          Express Backend (5000)                    │
│  ┌────────────────────────────────────────────────┐ │
│  │ verifyToken Middleware (JWT validation)        │ │
│  │ authorizeRoles Middleware (RBAC)              │ │
│  │ Auth Routes (register, login)                  │ │
│  │ Auth Controller (business logic)               │ │
│  └────────────────────────────────────────────────┘ │
└────────────┬─────────────────────────────────────────┘
             │
      MongoDB Query
             │
┌────────────▼──────────────────────────────────────┐
│         MongoDB Database                          │
│  ┌────────────────────────────────────────────────┐ │
│  │ users collection:                              │ │
│  │ {name, email, password, role, className,...}  │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Tips (Optional)

### Heroku Deployment
1. Both apps can be deployed separately
2. Set environment variables in Heroku dashboard
3. Connect GitHub repo for auto-deploy

### Docker
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables (Production)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecoverse
JWT_SECRET=<strong-random-key>
CLIENT_URL=https://yourdomain.com
```

---

## 📞 Support Resources

- **Backend Issues**: Check [backend README](./backend/README.md)
- **Frontend Issues**: Check [frontend README](./frontend/README.md)
- **MongoDB Issues**: [MongoDB Docs](https://docs.mongodb.com/)
- **Express Issues**: [Express Docs](https://expressjs.com/)
- **React Issues**: [React Docs](https://react.dev/)

---

## ✅ Verification Checklist

After setup, verify:

- [x] Backend server running on port 5000
- [x] Frontend server running on port 3000
- [x] MongoDB connection successful
- [x] Can register new user
- [x] Can login with registered user
- [x] Token stored in localStorage
- [x] Redirected to correct dashboard based on role
- [x] Can logout successfully
- [x] Cannot access other role dashboards
- [x] API endpoints respond correctly

---

**Last Updated:** February 16, 2026  
**Version:** 1.0.0 - Module 1 Complete
