# Module 5: Leaderboard - Quick Reference Guide

## 📖 Quick Start

### What is the Leaderboard Module?
The **Class vs Class Leaderboard** allows students and teachers to view how their class is performing environmentally compared to other classes. Classes are ranked by their ecoScore, which increases as students complete eco-friendly activities.

---

## 🚀 Getting Started

### 1. Test the Module
```bash
cd backend
node test-leaderboard.js
```
Expected output: ✅ All tests passed!

### 2. Start the Backend
```bash
npm start
```
Server runs on `http://localhost:5000`

### 3. Call the API from Frontend
```javascript
const response = await fetch(
  'http://localhost:5000/api/leaderboard',
  {
    headers: {
      Authorization: `Bearer YOUR_JWT_TOKEN`
    }
  }
);
const data = await response.json();
console.log(data.leaderboard);
```

---

## 📡 API Endpoints at a Glance

### Endpoint 1: Get All Classes
```
GET /api/leaderboard
Header: Authorization: Bearer <TOKEN>
Response: All classes ranked by ecoScore
```

### Endpoint 2: Filter by Forest State
```
GET /api/leaderboard/state/healthy
Header: Authorization: Bearer <TOKEN>
Response: Only healthy forest classes
```

### Endpoint 3: Top N Classes
```
GET /api/leaderboard/top/5
Header: Authorization: Bearer <TOKEN>
Response: Top 5 classes by ecoScore
```

### Endpoint 4: Check My Class Rank
```
GET /api/leaderboard/rank/10A
Header: Authorization: Bearer <TOKEN>
Response: Class 10A's rank and details
```

---

## 📊 Response Format

All responses follow this structure:
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "className": "CLASS 10A",
      "ecoScore": 520,
      "forestState": "healthy",
      "lastUpdated": "2026-02-17T10:30:00Z"
    }
  ],
  "totalClasses": 8,
  "topClass": { /* ... */ },
  "message": "Leaderboard retrieved successfully"
}
```

---

## 🧬 Data Relationships

```
Student → Attempt → ecoScore Update → Forest ← Leaderboard API
                         ↓
                    Auto-calculates:
                    forestState (polluted/growing/healthy)
                         ↓
                    Returned in Leaderboard
```

### Forest States
- **Polluted** (0-100 ecoScore) 🌍
- **Growing** (101-300 ecoScore) 🌱
- **Healthy** (300+ ecoScore) 🌳

---

## 💻 Usage Examples

### Example 1: Show Leaderboard on Dashboard
```javascript
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

export function LeaderboardComponent() {
  const { token } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setData(d.leaderboard));
  }, [token]);

  return (
    <div>
      {data?.map(entry => (
        <div key={entry.className}>
          <span>#{entry.rank}</span>
          <span>{entry.className}</span>
          <span>{entry.ecoScore}</span>
          <span>{entry.forestState}</span>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Check Your Class Rank
```javascript
async function getMyClassRank(className, token) {
  const res = await fetch(
    `http://localhost:5000/api/leaderboard/rank/${className}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const { class: classData } = await res.json();
  console.log(`Your rank: #${classData.rank}`);
  return classData;
}
```

### Example 3: Top 10 Classes Widget
```javascript
async function getTop10(token) {
  const res = await fetch(
    'http://localhost:5000/api/leaderboard/top/10',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.json();
}
```

---

## 🔒 Security Notes

✅ **All endpoints require JWT token** - Pass in Authorization header
✅ **Role-based access** - Only students and teachers can access
✅ **No sensitive data** - Only public info returned (class name, score, state)
✅ **Input validation** - All parameters checked before processing

---

## 🎨 Frontend Integration Ideas

### Leaderboard Table
Show ranked classes in a sortable table with:
- Rank number
- Class name
- Eco score
- Forest state (with emoji 🌍🌱🌳)
- Comparison to your class

### My Class Card
Display:
- Your class name
- Your current rank
- Your eco score
- Progress to next tier
- Target score

### State Filter Tabs
Buttons to view:
- All Classes
- Polluted Only
- Growing Only
- Healthy Only

### Leaderboard Widget
Small widget showing:
- Top 3 classes
- Your class's rank
- Points to catch up

---

## 🐛 Troubleshooting

### "No token provided" Error
**Problem:** Missing Authorization header
**Solution:** 
```javascript
headers: {
  Authorization: `Bearer ${token}`  // ← Don't forget this!
}
```

### "User role not authorized" Error
**Problem:** Current user role can't access leaderboard
**Solution:** Only students and teachers can access. Check user role.

### "No forest data found" Error
**Problem:** Class doesn't exist in Forest collection
**Solution:** Create a forest for the class using the Forest API first

### Response is empty array
**Problem:** No forests exist yet
**Solution:** Complete activities or seed test data with `node test-leaderboard.js`

---

## 📈 Data Flow Example

1. **Student completes quiz** → Gains 50 ecoPoints
2. **Backend updates Attempt** → Increments ecoScore
3. **Forest model updates** → forestState recalculated
4. **Frontend calls leaderboard API** → Data is fresh
5. **Leaderboard ranks** → Dynamically calculated
6. **UI displays** → User sees their class rank

---

## 🧪 Testing Commands (cURL)

Get leaderboard:
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/leaderboard
```

Get healthy forests:
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/leaderboard/state/healthy
```

Get top 5:
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/leaderboard/top/5
```

Check class rank:
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/leaderboard/rank/10A
```

---

## 📁 File Locations

| File | Path | Purpose |
|------|------|---------|
| Controller | `backend/controllers/leaderboardController.js` | Business logic |
| Routes | `backend/routes/leaderboard.js` | API endpoints |
| Tests | `backend/test-leaderboard.js` | Test suite |
| Docs | `backend/LEADERBOARD_API_DOCS.md` | Full documentation |
| Summary | `backend/MODULE_5_SUMMARY.md` | Implementation summary |

---

## ✅ Verification Checklist

- [ ] Run `node test-leaderboard.js` → All tests pass
- [ ] Start backend with `npm start` → No errors
- [ ] Call `/api/leaderboard` → Returns valid JSON
- [ ] Check token required → 401 without token
- [ ] Check role-based → 403 if not student/teacher
- [ ] Filter by state → Returns only that state
- [ ] Get top N → Returns correct number
- [ ] Get class rank → Returns correct rank

---

## 🎯 Common Use Cases

### Use Case 1: Show Leaderboard Tab
```
Dashboard → Tabs [Overview] [Leaderboard] [My Forest]
              ↓
         Call GET /api/leaderboard
              ↓
         Display ranked table
```

### Use Case 2: My Class Rank Widget
```
Dashboard → Info Panel showing:
  - "Your class rank: #3 of 25"
  - "+200 points to catch rank #2"
```

### Use Case 3: Achievement Notification
```
When user's class moves up:
  ✨ Your class moved up 2 ranks!
  Now: #5 (was #7)
```

---

## 🚀 Next Steps

1. ✅ Test module: `node test-leaderboard.js`
2. ✅ Review API docs: `LEADERBOARD_API_DOCS.md`
3. ✅ Integrate into frontend components
4. ✅ Add leaderboard page/tab
5. ✅ Style with Tailwind CSS
6. ✅ Add real-time updates (optional)

---

**Created:** February 17, 2026
**Version:** 1.0.0
**Status:** ✅ Ready to Use

For detailed API documentation, see [LEADERBOARD_API_DOCS.md](./LEADERBOARD_API_DOCS.md)
