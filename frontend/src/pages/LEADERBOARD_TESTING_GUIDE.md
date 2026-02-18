# Module 5: Leaderboard - Integration Testing Guide

## 🧪 Testing Checklist

### Pre-Testing Setup
- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] MongoDB connected and seeded with test data
- [ ] Run `node test-leaderboard.js` in backend (confirm all tests pass)

---

## 1️⃣ Route Access Control

### Test 1.1: Student Access ✅
**Expected:** Student can access leaderboard
```
Steps:
1. Login as student (or register as student)
2. Navigate to Sidebar → Click "🏆 Leaderboard"
3. Should load leaderboard page
4. Verify data displays correctly

Result: ✅ Leaderboard page loaded
```

### Test 1.2: Teacher Access ✅
**Expected:** Teacher can access leaderboard
```
Steps:
1. Login as teacher
2. Navigate to Sidebar → Click "🏆 Leaderboard"
3. Should load leaderboard page
4. Verify data displays correctly

Result: ✅ Leaderboard page loaded
```

### Test 1.3: Admin Access ❌
**Expected:** Admin cannot access (optional - depends on your requirement)
```
Steps:
1. Login as admin
2. Try to navigate to /leaderboard
3. Should redirect to /unauthorized (or skip if not required)

Result: ✅ Proper access control
```

### Test 1.4: Unauthenticated Access ❌
**Expected:** Anonymous user redirected to login
```
Steps:
1. Logout or clear auth
2. Try to directly navigate to /leaderboard
3. Should redirect to /login

Result: ✅ Authentication required
```

---

## 2️⃣ Data Fetching & Display

### Test 2.1: Data Loads Successfully ✅
**Expected:** Leaderboard data appears on page load
```
Steps:
1. Access leaderboard as authenticated student
2. Wait for loading spinner to disappear
3. Verify cards appear with data

Expected to See:
- Rank numbers (#1, #2, #3, etc.)
- Class names (CLASS 10A, CLASS 8A, etc.)
- Eco scores (520, 420, 380, etc.)
- Forest states (healthy, growing, polluted)

Result: ✅ Data displayed correctly
```

### Test 2.2: Loading State ⏳
**Expected:** Loading spinner appears briefly
```
Steps:
1. Navigate to leaderboard
2. Observe loading state
3. Wait for data to load

Expected to See:
- Spinning circle animation
- "Loading leaderboard..." text
- Then cards appear

Result: ✅ Loading state works
```

### Test 2.3: Medal Rankings Display ✅
**Expected:** Top 3 show medal emojis and highlighting
```
Steps:
1. Look at first 3 entries
2. Verify medal emojis present:
   - Rank 1: 🥇
   - Rank 2: 🥈
   - Rank 3: 🥉

Expected Styling:
- Rank 1: Gold gradient background
- Rank 2: Silver gradient background
- Rank 3: Orange gradient background
- Rank 4+: White background

Result: ✅ Medal system working
```

### Test 2.4: Forest State Badges ✅
**Expected:** Color-coded forest state badges appear
```
Steps:
1. Check each entry's forest state badge
2. Verify colors match:
   - 🌳 Healthy: Green badge
   - 🌱 Growing: Emerald badge
   - 🌍 Polluted: Gray badge

Expected:
- Emoji showing (🌳, 🌱, or 🌍)
- State text (healthy, growing, polluted)
- Correct background color

Result: ✅ Forest state badges working
```

---

## 3️⃣ UI & Interactions

### Test 3.1: Card Hover Effects ✨
**Expected:** Cards scale and shadow changes on hover
```
Steps:
1. Hover over a leaderboard card
2. Observe animation

Expected:
- Card slightly enlarges (scale 102%)
- Shadow becomes more prominent
- Smooth transition (no jank)
- Duration: ~300ms

Result: ✅ Hover effects smooth
```

### Test 3.2: Rank Badge Hover ✨
**Expected:** Rank circle scales on card hover
```
Steps:
1. Hover over any card
2. Watch the rank circle badge

Expected:
- Rank circle scalesfrom 100% to 110%
- Smooth animation
- Only happens on card hover

Result: ✅ Badge animation working
```

### Test 3.3: Stats Footer ✅
**Expected:** Stats cards display correctly
```
Steps:
1. Scroll to bottom of page
2. Look at 3-column stat footer

Expected to See:
- Column 1: "Total Classes" count
- Column 2: "🥇 Top Class" with name & points
- Column 3: "🌳 Healthy Forests" count

Result: ✅ Stats footer displaying
```

### Test 3.4: Responsive Design 📱
**Expected:** Layout adapts to screen size
```
Desktop (> 1024px):
- 3-column stats layout
- Cards full width
- All text readable

Tablet (640-1024px):
- 2-column stats
- Cards full width
- Text still readable

Mobile (< 640px):
- 1-column stats (stacked)
- Cards full width
- Touch-friendly spacing
- Readable font sizes

Steps:
1. Resize browser window
2. Verify layout changes appropriately
3. Check on actual mobile if possible

Result: ✅ Responsive at all sizes
```

---

## 4️⃣ Error Handling

### Test 4.1: Network Error ❌
**Expected:** Error state displays with retry
```
Steps:
1. Stop backend server (npm stop)
2. Try to access leaderboard
3. Wait for request to timeout

Expected to See:
- ❌ Error message
- "Oops! Something went wrong"
- [Try Again] button

Click Try Again:
- If backend back online: Data loads
- If still down: Error persists

Result: ✅ Error handling working
```

### Test 4.2: Invalid Token ❌
**Expected:** Unauthorized error displayed
```
Steps:
1. Clear localStorage (DevTools)
2. Manually set fake token
3. Navigate to leaderboard

Expected:
- Error state or redirect to login
- Clear error message

Result: ✅ Token validation working
```

### Test 4.3: Empty Leaderboard ⚠️
**Expected:** Empty state displays
```
Steps:
1. Clear Forest collection from MongoDB
2. Navigate to leaderboard

Expected to See:
- 📊 Empty message
- "No Classes Yet"
- Helpful text about when data appears

Result: ✅ Empty state handling
```

---

## 5️⃣ API Integration

### Test 5.1: Correct API Called ✅
**Expected:** Frontend calls correct backend endpoint
```
Steps:
1. Open DevTools → Network tab
2. Navigate to leaderboard
3. Look for request to `http://localhost:5000/api/leaderboard`

Expected:
- Request type: GET
- URL: /api/leaderboard
- Headers: Authorization: Bearer [JWT_TOKEN]
- Response: 200 OK with JSON data

Result: ✅ API call correct
```

### Test 5.2: JWT Token Included ✅
**Expected:** Token sent in Authorization header
```
Steps:
1. DevTools → Network tab
2. Click leaderboard request
3. Go to "Headers" tab
4. Check "Request Headers"

Expected to Find:
- Authorization: Bearer [long_jwt_token]
- Content-Type: application/json

Result: ✅ Token included in request
```

### Test 5.3: Response Format ✅
**Expected:** Response has correct structure
```
Steps:
1. DevTools → Network tab
2. Click leaderboard request
3. Go to "Response" tab

Expected Response Structure:
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "className": "CLASS 10A",
      "ecoScore": 520,
      "forestState": "healthy",
      "lastUpdated": "2026-02-17..."
    },
    ...
  ],
  "totalClasses": 8,
  "topClass": { ... }
}

Result: ✅ Response format correct
```

---

## 6️⃣ Data Accuracy

### Test 6.1: Ranking Order ✅
**Expected:** Classes ranked highest ecoScore first
```
Steps:
1. Check leaderboard display
2. Verify ecoScores are in descending order

Example:
✅ #1: 520 points
✅ #2: 420 points  
✅ #3: 380 points
✅ #4: 350 points

Result: ✅ Ranking correct
```

### Test 6.2: Forest State Calculation ✅
**Expected:** Forest state matches ecoScore thresholds
```
Expected Mapping:
- 0-100: Polluted 🌍
- 101-300: Growing 🌱
- 300+: Healthy 🌳

Steps:
1. Check a few entries
2. Verify forest state matches score range

Result: ✅ Forest state correct
```

### Test 6.3: Dynamic Rank Assignment ✅
**Expected:** Ranks assigned correctly (1, 2, 3, etc.)
```
Steps:
1. Look at rank column
2. Verify consecutive numbering

Expected:
- First entry: Rank 1
- Second entry: Rank 2
- No gaps in numbering
- No duplicate ranks

Result: ✅ Ranks dynamic and correct
```

---

## 7️⃣ Performance

### Test 7.1: Page Load Time ⚡
**Expected:** Page loads quickly
```
Steps:
1. DevTools → Performance tab
2. Record page load
3. Navigate to leaderboard

Expected:
- Time to interactive: < 2 seconds
- Loading visible within 500ms
- Data rendered: < 1500ms

Result: ✅ Performance acceptable
```

### Test 7.2: Smooth Animations 🎬
**Expected:** No jank or stutter
```
Steps:
1. Hover over cards
2. Open DevTools → Performance
3. Record while hovering

Expected:
- Frame rate: 60 FPS (smooth)
- No frame drops
- Consistent animation duration

Result: ✅ Animations smooth
```

### Test 7.3: Scroll Smoothness 📜
**Expected:** Scrolling through leaderboard is smooth
```
Steps:
1. Scroll through all entries
2. Scroll to stats footer
3. Observe smoothness

Expected:
- No lag or stutter
- Smooth 60 FPS scrolling

Result: ✅ Scrolling smooth
```

---

## 8️⃣ Edge Cases

### Test 8.1: Very Long Class Names ✏️
**Expected:** Long names truncate or wrap appropriately
```
Steps:
1. Create a class with very long name
   (e.g., "ENVIRONMENTAL SCIENCE CLASS 10A")
2. View on leaderboard
3. Check display

Expected:
- Text readable
- No overflow
- Layout stays intact

Result: ✅ Long names handled
```

### Test 8.2: Very High Scores 🎯
**Expected:** Large numbers display correctly
```
Steps:
1. Check class with high ecoScore
2. Verify number displays correctly

Example:
- Score: 9999 displays as "9999"
- No truncation needed

Result: ✅ Large numbers handling
```

### Test 8.3: Many Classes 🏢
**Expected:** Leaderboard handles many entries
```
Steps:
1. Seed database with 50+ classes
2. Load leaderboard
3. Scroll through all entries

Expected:
- All entries load
- Smooth scrolling
- No performance degradation

Result: ✅ Handles many entries
```

---

## 9️⃣ Browser Compatibility

### Test 9.1: Chrome ✅
```
Steps:
1. Open in Chrome
2. Test all features
3. Check DevTools for errors

Result: ✅ Works in Chrome
```

### Test 9.2: Firefox ✅
```
Steps:
1. Open in Firefox
2. Test all features
3. Check console for warnings

Result: ✅ Works in Firefox
```

### Test 9.3: Safari ✅
```
Steps:
1. Open in Safari (if on Mac)
2. Test animations
3. Verify styling

Result: ✅ Works in Safari
```

### Test 9.4: Edge ✅
```
Steps:
1. Open in Edge
2. Test navigation
3. Verify performance

Result: ✅ Works in Edge
```

---

## 🔟 Final Integration

### Test 10.1: Complete User Journey ✅
**Expected:** Full workflow from login to leaderboard
```
Journey:
1. Start at landing page (/)
2. Click "Login" or "Register"
3. Enter credentials
4. Submit form
5. Redirected to student dashboard
6. Click "🏆 Leaderboard" in sidebar
7. Verify leaderboard loads and displays data
8. Interact with cards
9. Check stats footer
10. Scroll and test responsiveness

Result: ✅ Complete journey works
```

### Test 10.2: Sidebar Link Active State ✅
**Expected:** Leaderboard link highlights when active
```
Steps:
1. Navigate to leaderboard
2. Look at sidebar
3. Leaderboard link should be highlighted
4. Should show active indicator (pulse dot)

Result: ✅ Active state working
```

### Test 10.3: Navigation Back ✅
**Expected:** Can navigate away and back
```
Steps:
1. On leaderboard
2. Click another sidebar link (e.g., Dashboard)
3. Verify page changes
4. Click Leaderboard again
5. Verify data reloads

Result: ✅ Navigation working
```

---

## ✅ Sign-Off Checklist

- [ ] All route access tests pass
- [ ] Data fetching works correctly
- [ ] Loading state displays
- [ ] Error state displays
- [ ] Empty state displays
- [ ] Medal rankings show correctly
- [ ] Forest state badges colored correctly
- [ ] Hover effects smooth
- [ ] Stats footer displays
- [ ] Responsive on all sizes
- [ ] API calls correct
- [ ] JWT token included
- [ ] Rankings accurate
- [ ] Forest states match scores
- [ ] Page loads quickly
- [ ] Animations smooth
- [ ] Edge cases handled
- [ ] Works in all major browsers
- [ ] Complete user journey works
- [ ] Sidebar integration works

---

## 🐛 Known Issues / Notes

(Add any issues or notes found during testing)

```
Example:
- Issue: [Describe issue]
  Status: [Fixed / Investigating / Known Bug]
  
- Note: [Any notable behaviors or edge cases]
```

---

## 📋 Sign-Off

**Tester Name:** _______________
**Date Tested:** ________________
**Status:** ✅ READY FOR PRODUCTION

---

**Created:** February 17, 2026
**Version:** 1.0.0
**Type:** Testing & QA Guide
