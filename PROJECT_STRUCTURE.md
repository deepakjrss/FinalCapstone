# 📁 Complete Project Structure

```
Final capstone/
│
├── 📄 README.md                    ← START HERE - Main project guide
├── 📄 SETUP_GUIDE.md               ← Quick setup & troubleshooting
├── 📄 COMPLETION_SUMMARY.md        ← What was created & features
│
├── 📁 backend/                     ← Node.js + Express Server
│   │
│   ├── 📁 config/
│   │   └── db.js                   # MongoDB connection setup
│   │
│   ├── 📁 models/
│   │   └── User.js                 # User schema & validation
│   │
│   ├── 📁 controllers/
│   │   └── authController.js       # Register & Login logic
│   │
│   ├── 📁 middleware/
│   │   └── auth.js                 # JWT verify & RBAC middleware
│   │
│   ├── 📁 routes/
│   │   └── auth.js                 # API endpoints: /api/auth/*
│   │
│   ├── 📁 utils/
│   │   └── errorHandler.js         # Error handling utility
│   │
│   ├── 📄 server.js                # Express app & server startup
│   ├── 📄 package.json             # Dependencies
│   ├── 📄 .env.example             # Environment template
│   ├── 📄 .gitignore               # Git ignore rules
│   └── 📄 README.md                # Backend documentation
│
└── 📁 frontend/                    ← React App
    │
    ├── 📁 public/
    │   └── index.html              # HTML entry point
    │
    ├── 📁 src/
    │   │
    │   ├── 📁 context/
    │   │   └── AuthContext.js       # Auth state & custom hook
    │   │
    │   ├── 📁 components/
    │   │   └── PrivateRoute.js      # Route protection component
    │   │
    │   ├── 📁 pages/
    │   │   ├── Login.js             # Login page
    │   │   ├── Register.js          # Registration page
    │   │   ├── NotFound.js          # 404 error page
    │   │   ├── Unauthorized.js      # 401 error page
    │   │   │
    │   │   └── 📁 Dashboard/
    │   │       ├── StudentDashboard.js    # Student dashboard
    │   │       ├── TeacherDashboard.js    # Teacher dashboard
    │   │       └── AdminDashboard.js      # Admin dashboard
    │   │
    │   ├── 📄 App.js                # Main routing setup
    │   ├── 📄 index.js              # React entry point
    │   └── 📄 index.css             # Global styles (TailwindCSS)
    │
    ├── 📄 package.json             # Dependencies
    ├── 📄 .env.example             # Environment template
    ├── 📄 .gitignore               # Git ignore rules
    ├── 📄 tailwind.config.js       # TailwindCSS configuration
    ├── 📄 postcss.config.js        # PostCSS configuration
    └── 📄 README.md                # Frontend documentation
```

---

## 📊 Quick File Reference

### 🔧 Configuration Files
| File | Purpose | Location |
|------|---------|----------|
| `.env.example` | Environment template | Both folders |
| `.gitignore` | Git ignore rules | Both folders |
| `package.json` | Dependencies | Both folders |
| `tailwind.config.js` | TailwindCSS setup | Frontend |
| `postcss.config.js` | PostCSS setup | Frontend |

### 📝 Documentation Files
| File | Purpose | Location |
|------|---------|----------|
| `README.md` | Main project overview | Root, backend, frontend |
| `SETUP_GUIDE.md` | Setup & troubleshooting | Root |
| `COMPLETION_SUMMARY.md` | What was created | Root |

### 🔐 Authentication Files
| File | Purpose | Location |
|------|---------|----------|
| `User.js` | Database schema | Backend `/models` |
| `authController.js` | Login/Register logic | Backend `/controllers` |
| `auth.js (middleware)` | JWT & RBAC | Backend `/middleware` |
| `auth.js (routes)` | API endpoints | Backend `/routes` |
| `AuthContext.js` | State management | Frontend `/context` |
| `PrivateRoute.js` | Route protection | Frontend `/components` |

### 🌐 UI Pages
| File | Purpose | Location |
|------|---------|----------|
| `Login.js` | Login page | Frontend `/pages` |
| `Register.js` | Registration page | Frontend `/pages` |
| `StudentDashboard.js` | Student view | Frontend `/pages/Dashboard` |
| `TeacherDashboard.js` | Teacher view | Frontend `/pages/Dashboard` |
| `AdminDashboard.js` | Admin view | Frontend `/pages/Dashboard` |
| `NotFound.js` | 404 page | Frontend `/pages` |
| `Unauthorized.js` | 401 page | Frontend `/pages` |

---

## 🎯 What Each File Does

### Backend Key Files

**server.js**
- Starts Express server
- Loads environment variables
- Connects to MongoDB
- Sets up CORS middleware
- Registers routes

**config/db.js**
- Connects to MongoDB using Mongoose
- Handles connection errors
- Exits process on failure

**models/User.js**
- Defines user schema
- Adds password hashing middleware (pre-save)
- Provides password comparison method
- Has validations for all fields

**controllers/authController.js**
- `register()` - Creates new user, validates input, hashes password
- `login()` - Verifies credentials, generates JWT token
- `getCurrentUser()` - Returns authenticated user profile
- `logout()` - Client-side logout confirmation

**routes/auth.js**
- Defines `/api/auth/register` endpoint
- Defines `/api/auth/login` endpoint
- Defines `/api/auth/me` endpoint (protected)
- Defines `/api/auth/logout` endpoint (protected)
- Applies validation middlwares

**middleware/auth.js**
- `verifyToken()` - Validates JWT from header
- `authorizeRoles()` - Checks user role for access

---

### Frontend Key Files

**App.js**
- Sets up React Router with all routes
- Wraps app with AuthProvider
- Defines public and protected routes
- Handles redirects

**context/AuthContext.js**
- Creates Auth context with user, token, loading, error
- Provides `login()` function
- Provides `register()` function
- Provides `logout()` function
- Custom hook `useAuth()` for easy access
- Auto-fetches user on app load

**components/PrivateRoute.js**
- Checks if user is authenticated
- Checks if user has required role
- Shows loading spinner while checking
- Redirects if unauthorized

**pages/Login.js**
- Email and password inputs
- Form validation
- Calls `login()` from context
- Shows loading and error states
- Redirects to dashboard based on role

**pages/Register.js**
- Name, email, password, role inputs
- Conditional className field
- Form validation
- Calls `register()` from context
- Shows loading and error states

**pages/Dashboard/StudentDashboard.js**
- Welcome message
- Profile information
- Feature cards
- Statistics
- Logout button

**pages/Dashboard/TeacherDashboard.js**
- Welcome message
- Profile information
- Feature cards
- Statistics
- Logout button

**pages/Dashboard/AdminDashboard.js**
- Welcome message
- Profile information
- Feature cards
- Statistics
- Recent activities
- System status
- Logout button

---

## 🔄 Data Flow Diagrams

### Registration Flow
```
Register.js (Form)
    ↓ (onSubmit)
AuthContext.register()
    ↓ (POST /api/auth/register)
Express Backend
    ↓
authController.register()
    ↓
Validate Input
    ↓
Hash Password (bcrypt)
    ↓
Save to MongoDB
    ↓
Generate JWT Token
    ↓
Return Token + User
    ↓
AuthContext stores token
    ↓
localStorage.setItem('token')
    ↓
Redirect to Dashboard
```

### Login Flow
```
Login.js (Form)
    ↓ (onSubmit)
AuthContext.login()
    ↓ (POST /api/auth/login)
Express Backend
    ↓
authController.login()
    ↓
Find User by Email
    ↓
Compare Password (bcrypt)
    ↓
Generate JWT Token
    ↓
Return Token + User
    ↓
AuthContext stores token
    ↓
localStorage.setItem('token')
    ↓
Redirect to Correct Dashboard
```

### Protected Route Flow
```
User Visits /teacher-dashboard
    ↓
PrivateRoute Component
    ↓
Check isAuthenticated (has token + user)
    ↓ (No)
Redirect to /login
    ↓ (Yes)
Check requiredRole
    ↓ (No match)
Redirect to /unauthorized
    ↓ (Match)
Show TeacherDashboard
```

---

## 🔗 File Dependencies

### Backend Dependencies
```
server.js
  ├── config/db.js
  ├── routes/auth.js
  │   ├── controllers/authController.js
  │   │   └── models/User.js
  │   └── middleware/auth.js
  └── middleware/auth.js
```

### Frontend Dependencies
```
App.js
  ├── context/AuthContext.js
  │   └── axios (HTTP client)
  ├── components/PrivateRoute.js
  │   └── context/AuthContext.js
  ├── pages/Login.js
  │   └── context/AuthContext.js
  ├── pages/Register.js
  │   └── context/AuthContext.js
  ├── pages/Dashboard/StudentDashboard.js
  │   └── context/AuthContext.js
  ├── pages/Dashboard/TeacherDashboard.js
  │   └── context/AuthContext.js
  └── pages/Dashboard/AdminDashboard.js
      └── context/AuthContext.js
```

---

## 🧩 Component Hierarchy

### Frontend Component Tree
```
<App>
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/student-dashboard">
          <PrivateRoute requiredRole="student">
            <StudentDashboard />
          </PrivateRoute>
        </Route>
        <Route path="/teacher-dashboard">
          <PrivateRoute requiredRole="teacher">
            <TeacherDashboard />
          </PrivateRoute>
        </Route>
        <Route path="/admin-dashboard">
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        </Route>
        <Route path="/unauthorized">
          <Unauthorized />
        </Route>
        <Route path="/404">
          <NotFound />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
</App>
```

---

## 📱 UI Pages Breakdown

### Public Pages (No Login Required)
1. **Login Page** - `Login.js`
   - Input: Email, Password
   - Action: POST /api/auth/login
   - Redirect: Dashboard (based on role)

2. **Register Page** - `Register.js`
   - Input: Name, Email, Password, Role, Class (conditional)
   - Action: POST /api/auth/register
   - Redirect: Dashboard (based on role)

### Protected Pages (Login Required)
3. **Student Dashboard** - `StudentDashboard.js`
   - Requires: Role = "student"
   - Shows: Profile, courses, assignments, progress

4. **Teacher Dashboard** - `TeacherDashboard.js`
   - Requires: Role = "teacher"
   - Shows: Profile, students, grading, courses

5. **Admin Dashboard** - `AdminDashboard.js`
   - Requires: Role = "admin"
   - Shows: Profile, users, system status, analytics

### Error Pages
6. **404 Page** - `NotFound.js`
   - Shows: Resource not found
   - Links: Back to login

7. **401 Page** - `Unauthorized.js`
   - Shows: Unauthorized access
   - Links: Back to login

---

## 🚀 Environment Setup

### Backend .env Variables
```
PORT=5000                    # Server port
NODE_ENV=development         # Node environment
MONGODB_URI=...             # MongoDB connection
JWT_SECRET=...              # JWT signing key
JWT_EXPIRE=7d               # Token expiration
CLIENT_URL=...              # Frontend URL
```

### Frontend .env Variables
```
REACT_APP_API_URL=...       # Backend API URL
```

---

## 💾 Database Structure

### MongoDB Collections
```
ecoverse
└── users (collection)
    ├── _id: ObjectId
    ├── name: String
    ├── email: String (unique)
    ├── password: String (hashed)
    ├── role: String (student|teacher|admin)
    ├── className: String (if student)
    ├── isActive: Boolean
    ├── createdAt: Date
    └── updatedAt: Date
```

---

## 🎯 Key Implementation Points

### Security
- ✅ Passwords hashed before saving
- ✅ JWT verification on protected routes
- ✅ CORS enabled
- ✅ Input validation on backend
- ✅ Role checking on protected routes

### State Management
- ✅ Context API for global auth state
- ✅ localStorage for token persistence
- ✅ useAuth() custom hook
- ✅ Loading and error states

### Routing
- ✅ React Router v6
- ✅ Private route wrapper
- ✅ Role-based redirects
- ✅ 404 page handling

### UI/UX
- ✅ TailwindCSS for styling
- ✅ Responsive design
- ✅ Form validation feedback
- ✅ Loading indicators
- ✅ Error messages

---

## ✅ Ready to Use!

Everything is set up and ready to go. Follow the [SETUP_GUIDE.md](./SETUP_GUIDE.md) to:

1. Install dependencies
2. Configure environment
3. Start servers
4. Register & login
5. Explore the application

---

**Last Updated**: February 16, 2026  
**Status**: ✅ Complete & Ready to Use
