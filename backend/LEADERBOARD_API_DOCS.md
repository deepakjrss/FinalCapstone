# Module 5: Class vs Class Leaderboard API

## Overview
The Leaderboard module provides APIs to compare classes based on their environmental scores (ecoScore) and forest states. This allows students and teachers to see how their class is performing environmentally compared to others.

## Database Model
Using the existing **Forest** model with:
- `className` (string, unique, uppercase)
- `ecoScore` (number, auto-updated from student activities)
- `forestState` (enum: 'polluted' | 'growing' | 'healthy')
- `lastUpdated` (date)
- `timestamps` (createdAt, updatedAt)

## API Endpoints

### 1. Get Complete Leaderboard
**Endpoint:** `GET /api/leaderboard`

**Access:** Protected (Student, Teacher)

**Description:** Retrieve all classes ranked by ecoScore in descending order

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "className": "CLASS 10A",
      "ecoScore": 450,
      "forestState": "healthy",
      "lastUpdated": "2026-02-17T10:30:00Z"
    },
    {
      "rank": 2,
      "className": "CLASS 10B",
      "ecoScore": 380,
      "forestState": "growing",
      "lastUpdated": "2026-02-17T09:15:00Z"
    },
    {
      "rank": 3,
      "className": "CLASS 9A",
      "ecoScore": 150,
      "forestState": "polluted",
      "lastUpdated": "2026-02-17T08:00:00Z"
    }
  ],
  "totalClasses": 3,
  "topClass": {
    "rank": 1,
    "className": "CLASS 10A",
    "ecoScore": 450,
    "forestState": "healthy",
    "lastUpdated": "2026-02-17T10:30:00Z"
  },
  "message": "Leaderboard retrieved successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - No token provided or invalid token
- `403 Forbidden` - User role not authorized
- `500 Internal Server Error` - Server error

---

### 2. Get Leaderboard by Forest State
**Endpoint:** `GET /api/leaderboard/state/:state`

**Access:** Protected (Student, Teacher)

**Description:** Filter leaderboard by forest state (polluted, growing, healthy)

**Parameters:**
- `state` (string): 'polluted', 'growing', or 'healthy'

**Request Example:**
```
GET /api/leaderboard/state/healthy
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "className": "CLASS 10A",
      "ecoScore": 450,
      "forestState": "healthy",
      "lastUpdated": "2026-02-17T10:30:00Z"
    },
    {
      "rank": 2,
      "className": "CLASS 8B",
      "ecoScore": 350,
      "forestState": "healthy",
      "lastUpdated": "2026-02-17T07:45:00Z"
    }
  ],
  "state": "healthy",
  "count": 2,
  "message": "Leaderboard retrieved for 'healthy' forest state"
}
```

**Bad Request (400):**
```json
{
  "success": false,
  "message": "Invalid forest state. Valid states are: polluted, growing, healthy"
}
```

---

### 3. Get Top N Classes
**Endpoint:** `GET /api/leaderboard/top/:limit`

**Access:** Protected (Student, Teacher)

**Description:** Get top N classes by ecoScore

**Parameters:**
- `limit` (number): Integer between 1 and 100

**Request Example:**
```
GET /api/leaderboard/top/5
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "className": "CLASS 10A",
      "ecoScore": 450,
      "forestState": "healthy",
      "lastUpdated": "2026-02-17T10:30:00Z"
    },
    {
      "rank": 2,
      "className": "CLASS 10B",
      "ecoScore": 380,
      "forestState": "growing",
      "lastUpdated": "2026-02-17T09:15:00Z"
    },
    {
      "rank": 3,
      "className": "CLASS 9A",
      "ecoScore": 150,
      "forestState": "polluted",
      "lastUpdated": "2026-02-17T08:00:00Z"
    }
  ],
  "limit": 5,
  "count": 3,
  "message": "Top 5 classes retrieved successfully"
}
```

**Bad Request (400):**
```json
{
  "success": false,
  "message": "Limit must be a number between 1 and 100"
}
```

---

### 4. Get Specific Class Rank
**Endpoint:** `GET /api/leaderboard/rank/:className`

**Access:** Protected (Student, Teacher)

**Description:** Get rank and details for a specific class

**Parameters:**
- `className` (string): Class name (case-insensitive, stored as uppercase)

**Request Example:**
```
GET /api/leaderboard/rank/10A
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "class": {
    "rank": 2,
    "className": "CLASS 10A",
    "ecoScore": 450,
    "forestState": "healthy",
    "lastUpdated": "2026-02-17T10:30:00Z"
  },
  "totalClasses": 15,
  "message": "Rank retrieved for class 10A"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "No forest data found for class 10A"
}
```

---

## Architecture

### Directory Structure
```
backend/
├── controllers/
│   └── leaderboardController.js    # Business logic
├── routes/
│   └── leaderboard.js              # API routes
├── middleware/
│   └── auth.js                     # Token verification & role-based access
├── models/
│   └── Forest.js                   # Database schema
└── server.js                       # Route registration
```

### Code Quality Features
✅ **Async/Await:** All database operations use async/await pattern
✅ **Error Handling:** Comprehensive try-catch blocks with meaningful error messages
✅ **Input Validation:** Request parameters validated before processing
✅ **Clean Code:** Separated concerns (controllers, routes, rules)
✅ **Security:** JWT token verification & role-based authorization
✅ **Performance:** Using `.lean()` for read-only queries
✅ **Documentation:** JSDoc comments with endpoint details

### Middleware Usage
- **verifyToken:** Authenticates JWT tokens from Authorization header
- **authorizeRoles('student', 'teacher'):** Ensures only students and teachers can access leaderboard

## Implementation Details

### Controller: leaderboardController.js
Contains 4 exported async functions:

1. **getLeaderboard**
   - Fetches all forests
   - Sorts by ecoScore descending
   - Adds dynamic rank (index + 1)
   - Returns full leaderboard with metadata

2. **getLeaderboardByState**
   - Validates forest state parameter
   - Filters forests by state
   - Adds ranks
   - Returns filtered leaderboard

3. **getTopClasses**
   - Validates limit (1-100)
   - Retrieves top N forests
   - Adds ranks
   - Returns top classes

4. **getClassRank**
   - Finds specific class
   - Calculates rank by comparing ecoScores
   - Returns class details with rank

### Route: leaderboard.js
Registers 4 GET endpoints with:
- Token verification middleware
- Role-based authorization
- Controller imports and references
- Clear documentation

### Server Integration: server.js
Added route at line: `app.use('/api/leaderboard', require('./routes/leaderboard'));`

## Usage Examples

### Example 1: Get Leaderboard in React Component
```javascript
import { useAuth } from './context/AuthContext';

function Leaderboard() {
  const { user, token } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await fetch('http://localhost:5000/api/leaderboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    };

    if (token) fetchLeaderboard();
  }, [token]);

  return (
    <div>
      {leaderboard.map((entry) => (
        <div key={entry.className}>
          <span>#{entry.rank}</span>
          <span>{entry.className}</span>
          <span>{entry.ecoScore} pts</span>
          <span>{entry.forestState}</span>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Fetch Top 10 Classes
```javascript
const response = await fetch(
  'http://localhost:5000/api/leaderboard/top/10',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
const { leaderboard } = await response.json();
```

### Example 3: Check Your Class Rank
```javascript
const response = await fetch(
  `http://localhost:5000/api/leaderboard/rank/${userClass}`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
const { class: classData } = await response.json();
console.log(`Your class rank: ${classData.rank}`);
```

## Testing with cURL

### Test 1: Get Full Leaderboard
```bash
curl -X GET http://localhost:5000/api/leaderboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test 2: Get Healthy Forest Classes
```bash
curl -X GET http://localhost:5000/api/leaderboard/state/healthy \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test 3: Get Top 5 Classes
```bash
curl -X GET http://localhost:5000/api/leaderboard/top/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test 4: Get Class Rank
```bash
curl -X GET http://localhost:5000/api/leaderboard/rank/10A \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Considerations
- ✅ All endpoints require valid JWT token
- ✅ Role-based authorization (student, teacher only)
- ✅ No sensitive data exposed in responses
- ✅ Input validation prevents injection attacks
- ✅ Error messages don't leak system details
- ✅ Database queries use parameterized methods

## Performance Optimizations
- ✅ `.lean()` queries for read-only operations
- ✅ Efficient sorting on database level (MongoDB)
- ✅ Direct index access instead of full array iteration (where possible)
- ✅ Minimal data transfer in response

## Status Codes Used
- **200 OK** - Request successful
- **400 Bad Request** - Invalid parameters
- **401 Unauthorized** - Missing/invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

## Future Enhancements
- Pagination support for large leaderboards
- Historical leaderboard tracking
- Leaderboard grouping by grade/section
- Achievements for top performers
- Real-time updates via WebSocket
- Monthly/yearly leaderboard archive

---

**Last Updated:** February 17, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
