# Leaderboard Page - Visual Reference Guide

## 🎨 UI Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🏆  CLASS LEADERBOARD  🏆                             │
│  See how your class is performing in the eco-challenge! 🌍 │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🥇  │  CLASS 10A         │ 520   │  🌳 Healthy         │
│ #1  │                   │  pts  │                     │
│     │ 🎯 Eco Champions! │       │                     │
├─────────────────────────────────────────────────────────┤
│ 🥈  │  CLASS 8A          │ 420   │  🌳 Healthy         │
│ #2  │                   │  pts  │                     │
│     │ 🌟 Strong Perf.    │       │                     │
├─────────────────────────────────────────────────────────┤
│ 🥉  │  CLASS 10B         │ 380   │  🌳 Healthy         │
│ #3  │                   │  pts  │                     │
│     │ ⭐ Rising Stars    │       │                     │
├─────────────────────────────────────────────────────────┤
│ 4   │  CLASS 7A          │ 350   │  🌱 Growing         │
│     │                   │  pts  │                     │
│     │ #4 in rankings    │       │                     │
├─────────────────────────────────────────────────────────┤
│ 5   │  CLASS 9B          │ 280   │  🌱 Growing         │
│     │                   │  pts  │                     │
│     │ #5 in rankings    │       │                     │
└─────────────────────────────────────────────────────────┘

┌───────────────────────┬───────────────────────┬───────────────────────┐
│   Total Classes       │    🥇 Top Class       │  🌳 Healthy Forests   │
│                       │                       │                       │
│         5             │    CLASS 10A          │         4             │
│                       │    520 points         │                       │
└───────────────────────┴───────────────────────┴───────────────────────┘
```

---

## 🎯 Color Scheme

### Top 3 Rankings
```
🥇 Rank 1 - GOLD
┌──────────────────────────┐
│ Background: from-yellow-300 to-yellow-500
│ Text: yellow-900
│ Badge: Yellow Gradient
│ Border: yellow-200
└──────────────────────────┘

🥈 Rank 2 - SILVER
┌──────────────────────────┐
│ Background: from-gray-300 to-gray-400
│ Text: gray-900
│ Badge: Gray Gradient
│ Border: yellow-200 (same as gold for top 3)
└──────────────────────────┘

🥉 Rank 3 - BRONZE
┌──────────────────────────┐
│ Background: from-orange-300 to-orange-500
│ Text: orange-900
│ Badge: Orange Gradient
│ Border: yellow-200 (same as gold for top 3)
└──────────────────────────┘

#4+ - DEFAULT
┌──────────────────────────┐
│ Background: white
│ Text: green-800
│ Badge: green-100 to green-100
│ Border: gray-200 (hover: green-300)
└──────────────────────────┘
```

### Forest States
```
🌳 HEALTHY (300+)
┌──────────────────────────┐
│ Background: bg-green-100
│ Text: text-green-800
│ Badge: bg-green-200
│ Emoji: 🌳
└──────────────────────────┘

🌱 GROWING (101-300)
┌──────────────────────────┐
│ Background: bg-emerald-100
│ Text: text-emerald-800
│ Badge: bg-emerald-200
│ Emoji: 🌱
└──────────────────────────┘

🌍 POLLUTED (0-100)
┌──────────────────────────┐
│ Background: bg-gray-100
│ Text: text-gray-800
│ Badge: bg-gray-200
│ Emoji: 🌍
└──────────────────────────┘
```

---

## 🎬 Animation & Interactions

### Card Hover Effects
```
BEFORE HOVER:          AFTER HOVER:
┌──────────────────┐  ┌──────────────────┐
│ Regular shadow   │  │ Larger shadow    │
│ Scale: 100%      │  │ Scale: 102%      │
│ Opacity: 100%    │  │ Opacity: 100%    │
└──────────────────┘  └──────────────────┘
  transition-all duration-300

transform scale-102 
hover:shadow-xl
```

### Rank Badge Hover
```
Rank Circle:
- Scale: 100% → 110% on card hover
- Smooth transition (300ms)
- Stays centered
```

### Stats Cards Footer
```
Each stat card on hover:
- shadow-md → shadow-lg
- Smooth color transitions
- Duration: 300ms
```

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)
```
┌───────────────────────────────┐
│ Single Column Layout          │
│                               │
│ ┌─────────────────────────┐  │
│ │ Rank │ Name │ Score     │  │
│ │      │      │ State     │  │
│ └─────────────────────────┘  │
│                               │
│ ┌─────────────────────────┐  │
│ │ Stats Stacked Vertically│  │
│ │ (1 per row)             │  │
│ └─────────────────────────┘  │
└───────────────────────────────┘

Card Adjustments:
- Padding: p-4 (reduced)
- Font: sm (smaller)
- Layout: Flex column on smallest
```

### Tablet (640px - 1024px)
```
┌────────────────────────────────────────┐
│ Full Width Cards                       │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Rank │ Class │ Score │ State      │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌─────────────────────┬──────────────┐ │
│ │ Stats (2 columns)   │              │ │
│ ├─────────────────────┼──────────────┤ │
│ │                     │              │ │
│ └─────────────────────┴──────────────┘ │
└────────────────────────────────────────┘
```

### Desktop (> 1024px)
```
┌──────────────────────────────────────────────────────┐
│ Optimized 3-column Stats                            │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Full Info Card Layout                          │ │
│ │ ┌──────────────────────────────────────────────┐ │ │
│ │ │ #  | Class | Score | Forest State           │ │ │
│ │ └──────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ ┌────────────┬────────────┬────────────────────────┐ │
│ │ Total      │ Top Class  │ Healthy Forests       │ │
│ │ Classes    │            │                       │ │
│ │    5       │ CLASS 10A  │          4            │ │
│ │            │ 520 points │                       │ │
│ └────────────┴────────────┴────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 State Management

### Loading State
```
┌─────────────────────────────────────────┐
│                                         │
│              ◐ Spinning                 │
│                                         │
│    Loading leaderboard...               │
│                                         │
└─────────────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────────────┐
│              ❌                          │
│  Oops! Something went wrong             │
│                                         │
│  Failed to fetch leaderboard            │
│                                         │
│      [Try Again]                        │
└─────────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────────┐
│             📊                           │
│                                         │
│      No Classes Yet                     │
│                                         │
│  Classes will appear here once they     │
│  complete eco-activities.               │
└─────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
User Visits /leaderboard
        ↓
[PrivateRoute Check]
        ↓
        ├─ Authenticated? No → Redirect to /login
        │
        └─ Is student or teacher? Yes ↓
          ├─ Not authorized → Redirect to /unauthorized
          │
          └─ Authorized ↓
            Leaderboard Component Mounts
                    ↓
            useEffect Hook Triggers
                    ↓
            Fetch from GET /api/leaderboard
            (with JWT token in header)
                    ↓
            [Loading State Shown]
                    ↓
            Backend Processes Request
            ├─ Query Forest collection
            ├─ Sort by ecoScore descending
            ├─ Add ranks dynamically
            └─ Return JSON response
                    ↓
            Frontend Receives Data
                    ↓
            setLeaderboard(data)
                    ↓
            [Loading False, Data Rendered]
                    ↓
            Render Card for Each Entry:
            ├─ Medal emoji for top 3
            ├─ Class name
            ├─ Eco score with gradient
            ├─ Forest state badge
            └─ Rank position text
                    ↓
            Render Stats Footer:
            ├─ Total classes
            ├─ Top class card
            └─ Healthy forests count
                    ↓
            User Interacts:
            ├─ Hover over cards → Scale & shadow
            ├─ Try again button (if error)
            └─ Refresh page to reload
```

---

## 🎯 Certificate States (Example)

### Rank 1 - Eco Champions! 🎯
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🥇 CLASS 10A
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Eco Score: 520 ⭐⭐⭐
  Forest State: 🌳 Healthy
  
  Status: 🎯 Eco Champions!
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Rank 2 - Strong Performers 🌟
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🥈 CLASS 8A
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Eco Score: 420 ⭐⭐
  Forest State: 🌳 Healthy
  
  Status: 🌟 Strong Performers
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Rank 3 - Rising Stars ⭐
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🥉 CLASS 10B
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Eco Score: 380
  Forest State: 🌳 Healthy
  
  Status: ⭐ Rising Stars
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📐 Spacing & Typography

### Typography
```
Header:
  Title: text-4xl md:text-5xl font-bold
  Subtitle: text-lg
  
Card Title:
  Class Name: text-xl font-bold
  Rank Label: text-sm text-gray-600
  
Badges:
  Font Size: text-sm
  Font Weight: font-semibold
  
Score Display:
  Font Size: text-3xl
  Font Weight: font-bold
```

### Spacing
```
Container Padding: px-4 sm:px-6 lg:px-8
Section Margin: mb-12
Card Padding: p-6
Gap Between Cards: gap-4
Gap Inside Card: gap-6

Stats Cards Gap: gap-4
Stats Footer Margin: mt-12
```

---

## ✨ CSS Classes Used

```
Layout:
  min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50
  max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

Cards:
  rounded-xl border-2 overflow-hidden cursor-pointer group
  transform transition-all duration-300 hover:scale-102 hover:shadow-xl

Badges:
  px-4 py-2 rounded-full font-semibold flex items-center gap-2
  transition-all duration-300 group-hover:scale-105

States:
  Loading: animate-spin rounded-full
  Error: bg-red-50 border-2 border-red-200
  Empty: bg-white rounded-2xl shadow-lg p-12 border border-gray-100
```

---

**Created:** February 17, 2026
**Version:** 1.0.0
**Type:** Visual Reference Guide
