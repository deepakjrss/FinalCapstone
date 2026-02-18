# EcoVerse Frontend
## MERN Stack - Module 1: Authentication & Role-Based Access Control

### Technology Stack
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Context API** - State management

### Project Structure
```
frontend/src/
├── context/
│   └── AuthContext.js           # Authentication context & custom hook
├── components/
│   └── PrivateRoute.js          # Protected routes component
├── pages/
│   ├── Login.js                 # Login page
│   ├── Register.js              # Registration page
│   ├── NotFound.js              # 404 page
│   ├── Unauthorized.js          # 401 page
│   └── Dashboard/
│       ├── StudentDashboard.js  # Student dashboard
│       ├── TeacherDashboard.js  # Teacher dashboard
│       └── AdminDashboard.js    # Admin dashboard
├── App.js                       # Main app component with routing
├── index.js                     # React entry point
├── index.css                    # Global styles
└── package.json                 # Dependencies
```

### Installation & Setup

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Update `.env` with your backend API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3. Install TailwindCSS (if not already done)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 4. Start the Development Server
```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## Features

### Authentication
✅ User registration with role selection  
✅ Email login  
✅ JWT token management  
✅ Token storage in localStorage  
✅ Automatic token refresh on app load  
✅ Logout functionality  

### Authorization
✅ Role-based dashboard access  
✅ Private route protection  
✅ Unauthorized access handling  
✅ Redirects based on user role  

### UI/UX
✅ Beautiful TailwindCSS styling  
✅ Responsive design  
✅ Loading states  
✅ Error messages  
✅ Form validation  

---

## Page Components

### Login Page
- Email and password input fields
- Error message display
- Loading state
- Link to registration
- Demo credentials display
- Gradient background

### Register Page
- Name, email, password input fields
- Role selection (student/teacher/admin)
- Conditional className field for students
- Form validation
- Error message display
- Loading state
- Password length requirement (6 characters)

### Student Dashboard
- Welcome message with student name
- Profile information display
- Feature cards (Courses, Assignments, Progress)
- Statistics (Active Courses, Pending Assignments, etc.)
- Logout button

### Teacher Dashboard
- Welcome message with teacher name
- Profile information display
- Feature cards (Manage Courses, Students, Grading)
- Statistics (Courses, Total Students, Pending Grading, etc.)
- Logout button

### Admin Dashboard
- Welcome message with admin name
- Profile information display
- Feature cards (User Management, System Settings, Reports)
- Statistics (Total Users, Active Sessions, System Health, etc.)
- Recent activities section
- System status monitoring

---

## Context API - AuthContext

### State
```javascript
{
  user: {
    _id: string,
    name: string,
    email: string,
    role: 'student' | 'teacher' | 'admin',
    className: string (only for students)
  },
  token: string | null,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```

### Methods
```javascript
login(email, password)           // Login user
register(userData)               // Register new user
logout()                         // Logout user
```

### Usage
```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, token, loading, error, login, logout, isAuthenticated } = useAuth();
  
  // Use auth state and methods
}
```

---

## PrivateRoute Component

Protects routes that require authentication and optionally validates user role.

### Props
- `children` - Component to render if authorized
- `requiredRole` (optional) - Role required to access the route

### Usage
```javascript
<PrivateRoute requiredRole="admin">
  <AdminDashboard />
</PrivateRoute>
```

### Behavior
- Redirects unauthenticated users to `/login`
- Redirects unauthorized users (wrong role) to `/unauthorized`
- Shows loading spinner while checking authentication

---

## Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes
- `/student-dashboard` - Student dashboard (requires `student` role)
- `/teacher-dashboard` - Teacher dashboard (requires `teacher` role)
- `/admin-dashboard` - Admin dashboard (requires `admin` role)

### Error Routes
- `/unauthorized` - 401 Unauthorized access page
- `/404` - 404 Not Found page
- `/` - Redirects to login
- `*` - All other routes redirect to 404

---

## Form Validation

### Login Form
- Email: required, valid email format
- Password: required

### Register Form
- Name: required, minimum 2 characters
- Email: required, valid email format
- Password: required, minimum 6 characters
- Role: required (student/teacher/admin)
- ClassName: required only if role is student

---

## Styling

### Color Scheme
- **Blues**: Login and student-related pages
- **Greens**: Register and student elements
- **Ambers/Oranges**: Teacher-related pages
- **Dark Grays**: Admin dashboard

### Responsive Design
- Mobile-first approach
- Grid layouts for different screen sizes
- Touchscreen-friendly buttons and inputs
- Full-height viewport handling

---

## Error Handling

### Network Errors
- Displays error message from backend
- Shows input validation messages
- Clears error messages on new input

### Authentication Errors
- Invalid credentials
- Expired tokens
- Missing authorization header

### Authorization Errors
- User logged in but role doesn't match route
- Redirects to unauthorized page

---

## Token Management

### Storage
- JWT tokens stored in `localStorage` as `token`
- Persists across browser sessions

### Auto-refresh
- Token loaded from localStorage on app mount
- User profile fetched automatically with stored token
- No manual login required if token is valid

### Clearing
- Token removed from localStorage on logout
- Also removed on token expiration
- Also removed if user is disabled

---

## Demo Credentials

For testing, use these credentials (you'll need to create these first):

**Student:**
- Email: `student@example.com`
- Password: `password123`

**Teacher:**
- Email: `teacher@example.com`
- Password: `password123`

**Admin:**
- Email: `admin@example.com`
- Password: `password123`

---

## Common Issues & Solutions

### CORS Errors
- Ensure backend CORS is configured correctly
- Check `CLIENT_URL` in backend `.env` matches frontend URL

### Token Not Working
- Clear localStorage and login again
- Check token expiration in backend `.env`
- Verify JWT_SECRET matches between frontend and backend

### Routes Not Working
- Ensure React Router is properly wrapped in BrowserRouter
- Check route paths match exactly
- Verify PrivateRoute is wrapping protected components

---

## Testing Workflow

1. **Register**
   - Go to `/register`
   - Fill in form with valid data
   - Choose your role
   - Submit form

2. **Login**
   - Go to `/login`
   - Enter email and password
   - Should redirect to appropriate dashboard

3. **Access Control**
   - Try accessing a dashboard with wrong role in URL
   - Should redirect to unauthorized page

4. **Logout**
   - Click logout button on dashboard
   - Should return to login page
   - localStorage token should be cleared

---

## Next Steps

For Module 2, you can extend this with:
- Profile editing page
- Password change functionality
- Email verification
- Two-factor authentication
- Profile picture upload
- User preferences/settings
- Notifications system
