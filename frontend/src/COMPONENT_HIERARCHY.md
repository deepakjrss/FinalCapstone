# EcoVerse UI System - Component Hierarchy & Architecture

## 📊 Complete Component Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    EcoVerse UI Component Library                 │
│                         (30+ Components)                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 🎨 DESIGN SYSTEM FOUNDATION                                      │
├─────────────────────────────────────────────────────────────────┤
│
│ designSystem.js
│ ├─ 📐 Colors (12 families × 9 shades = 108 colors)
│ ├─ 📏 Spacing (8pt grid: xs, sm, md, lg, xl, 2xl, 3xl, 4xl)
│ ├─ 🔤 Typography (h1, h2, h3, body, small)
│ ├─ 💫 Shadows (sm, md, lg, xl, 2xl)
│ ├─ ⚡ Transitions (default fast, slow)
│ ├─ 🌈 Gradients (6+ preset gradients)
│ ├─ 🔲 Border Radius (sm, md, lg, xl, 2xl)
│ ├─ ecoTheme (Badge emojis, status colors, breakpoints)
│ ├─ pageStyles (Pre-composed classes)
│ └─ cn() utility (Class name combining)
│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 🧩 COMPONENT LIBRARIES                                           │
├─────────────────────────────────────────────────────────────────┤

│ 📦 UIComponents.jsx (11 Core Components)
│ ├─ Button
│ │  ├─ Variants: primary, secondary, danger, ghost
│ │  ├─ Sizes: sm, md, lg
│ │  └─ States: default, disabled, loading, fullWidth
│ │
│ ├─ Card
│ │  ├─ Props: clickable, hover effects
│ │  └─ Style: Glassmorphic (glass effect)
│ │
│ ├─ Container
│ │  ├─ Props: max-width wrapper
│ │  └─ Options: fluid (fill width)
│ │
│ ├─ PageHeader
│ │  ├─ Props: icon, title, subtitle
│ │  └─ Use: Page section headers
│ │
│ ├─ StatsCard
│ │  ├─ Props: label, value, color
│ │  └─ Colors: emerald, teal, blue, purple
│ │
│ ├─ LoadingSpinner
│ │  ├─ Props: message, custom animation
│ │  └─ Use: Async operation feedback
│ │
│ ├─ EmptyState
│ │  ├─ Props: icon, title, message, action
│ │  └─ Use: No-data display
│ │
│ ├─ ErrorAlert
│ │  ├─ Props: message, onRetry
│ │  └─ Use: Error messages with recovery
│ │
│ ├─ Badge
│ │  ├─ Variants: default, success, warning, danger
│ │  └─ Use: Tags and labels
│ │
│ ├─ Section
│ │  ├─ Props: title, subtitle, children
│ │  └─ Use: Content grouping
│ │
│ └─ Grid
│    ├─ Props: cols (1-4), gap (sm-xl)
│    └─ Use: Responsive layout

│ 📋 FormComponents.jsx (12 Form Components)
│ ├─ FormInput
│ │  ├─ Features: Label, validation, help text, icon support
│ │  └─ Types: text, email, password
│ │
│ ├─ FormTextarea
│ │  ├─ Features: Auto-resize, rows configurable
│ │  └─ Validation: Error states
│ │
│ ├─ FormSelect
│ │  ├─ Features: Options array, placeholder
│ │  └─ Hooks: onChange, value binding
│ │
│ ├─ FormCheckbox
│ │  ├─ Features: Label, checked state
│ │  └─ Validation: Error handling
│ │
│ ├─ FormRadio
│ │  ├─ Features: Option array, direction (vertical/horizontal)
│ │  └─ Name: Group identification
│ │
│ ├─ FormGroup
│ │  ├─ Use: Wrapper for multiple inputs
│ │  └─ Spacing: Consistent gap between fields
│ │
│ ├─ Form
│ │  ├─ Props: onSubmit, loading
│ │  └─ Use: Form wrapper
│ │
│ ├─ Alert
│ │  ├─ Variants: success, error, warning, info
│ │  └─ Props: icon, title, message, action
│ │
│ ├─ ProgressBar
│ │  ├─ Props: value, max, variant
│ │  └─ Display: Percentage optional
│ │
│ ├─ Tooltip
│ │  ├─ Props: content, position (top/bottom/left/right)
│ │  └─ Trigger: Hover
│ │
│ ├─ BadgeComponent
│ │  ├─ Variants: 6 color options
│ │  └─ Sizes: sm, md, lg
│ │
│ └─ Icon support across all form components

│ 🗂️  ModalComponents.jsx (8 Modal/Dialog Components)
│ ├─ Modal
│ │  ├─ Features: Full-featured dialog with backdrop
│ │  ├─ Sizes: sm, md, lg, xl, 2xl
│ │  └─ Keyboard: ESC to close
│ │
│ ├─ ConfirmModal
│ │  ├─ Variants: default, danger, warning, success
│ │  └─ Use: Yes/no confirmations
│ │
│ ├─ Toast
│ │  ├─ Types: success, error, warning, info
│ │  └─ Auto-dismiss: Configurable duration
│ │
│ ├─ ToastContainer
│ │  ├─ Use: Toast list manager
│ │  └─ Position: Bottom-right
│ │
│ ├─ useToast Hook
│ │  ├─ Methods: success(), error(), warning(), info()
│ │  └─ Management: addToast(), removeToast()
│ │
│ ├─ Dropdown
│ │  ├─ Props: trigger, align (left/right)
│ │  └─ Behavior: Click-outside to close
│ │
│ ├─ DropdownItem
│ │  ├─ Props: onClick, danger variant
│ │  └─ Use: Menu items inside Dropdown
│ │
│ └─ HoverCard
│    ├─ Props: trigger, position, width
│    └─ Trigger: Hover

│ 🎯 Icons.jsx (25+ SVG Icons)
│ ├─ Navigation Icons
│ │  ├─ ChevronDownIcon, ChevronUpIcon
│ │  ├─ ArrowRightIcon, ArrowLeftIcon
│ │  └─ MenuIcon
│ │
│ ├─ Action Icons
│ │  ├─ EditIcon, TrashIcon
│ │  ├─ DownloadIcon, UploadIcon
│ │  ├─ SearchIcon, PlusIcon, MinusIcon
│ │  └─ LogoutIcon, LoginIcon
│ │
│ ├─ Status Icons
│ │  ├─ CheckIcon
│ │  ├─ AlertIcon, InfoIcon
│ │  ├─ SpinnerIcon (animated)
│ │  └─ CloseIcon
│ │
│ ├─ Utility Icons
│ │  ├─ BellIcon (notifications)
│ │  ├─ UserIcon, SettingsIcon
│ │  ├─ StarIcon, HeartIcon
│ │  ├─ EyeIcon, EyeOffIcon
│ │  └─ GlobeIcon
│ │
│ └─ Icons Object (collection export)

└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 🌍 GLOBAL RESOURCES                                              │
├─────────────────────────────────────────────────────────────────┤
│
│ global.css
│ ├─ Smooth Transitions (300ms default)
│ ├─ Gradient Text (emerald→teal)
│ ├─ Glassmorphism Classes (glass, glass-dark)
│ ├─ Custom Scrollbar (emerald theme)
│ ├─ Animations
│ │  ├─ Fade-in (0.5s ease-in-out)
│ │  ├─ Slide-up (0.6s ease-out)
│ │  ├─ Bounce (gentle 2s infinite)
│ │  └─ Pulse-glow (2s infinite)
│ ├─ Hover Effects
│ │  └─ hover-lift (smooth 300ms)
│ ├─ Form Styling
│ │  ├─ Focus states (emerald ring)
│ │  └─ Disabled states (opacity 50%)
│ ├─ Messages
│ │  ├─ success-message (green)
│ │  ├─ error-message (red)
│ │  ├─ warning-message (yellow)
│ │  └─ info-message (blue)
│ └─ Accessibility
│    └─ Focus-visible states

└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Usage Architecture

```
Application
│
├─ Layout Level
│  ├─ Container (max-width wrapper)
│  ├─ Sidebar (navigation)
│  └─ main (page content)
│
├─ Page Level
│  ├─ PageHeader (title section)
│  └─ Section (content grouping)
│
├─ Component Level
│  ├─ Grid (responsive layout)
│  │  └─ Card (content container)
│  │     ├─ StatsCard (statistics)
│  │     ├─ Button (actions)
│  │     └─ [Custom content]
│  │
│  └─ Forms
│     ├─ Form (wrapper)
│     │  ├─ FormInput (text fields)
│     │  ├─ FormSelect (dropdowns)
│     │  ├─ FormCheckbox (checkboxes)
│     │  └─ Button (submit)
│     │
│     └─ Modals
│        ├─ Modal (custom dialogs)
│        ├─ ConfirmModal (confirmations)
│        ├─ Toast (notifications)
│        └─ Dropdown (menus)
│
└─ Styling Level
   ├─ designSystem (tokens)
   ├─ designSystem.colors (palette)
   ├─ designSystem.spacing (grid)
   ├─ designSystem.typography (scale)
   └─ global.css (animations)
```

---

## 📦 Component Dependency Map

```
UIComponents.jsx
├─ designSystem (colors, spacing, typography)
├─ cn utility (class combining)
└─ TailwindCSS classes

FormComponents.jsx
├─ designSystem
├─ cn utility
└─ Icons.jsx (optional icons)

ModalComponents.jsx
├─ designSystem
├─ cn utility
└─ React.useEffect (keyboard handling)

Icons.jsx
└─ cn utility

global.css
└─ TailwindCSS (extends with animations)
```

---

## 🔄 Data Flow for Components

### Button Component Flow
```
Props (variant, size, disabled, onClick)
  ↓
Determine CSS classes
  ↓
Combine with cn()
  ↓
Render <button>
  ↓
Handle onClick
```

### FormInput Component Flow
```
Props (value, onChange, validation)
  ↓
Determine error state
  ↓
Apply appropriate styles
  ↓
Render <input> with error feedback
  ↓
Handle onChange event
```

### Modal Component Flow
```
Props (isOpen, onClose, title)
  ↓
Setup keyboard listener (ESC key)
  ↓
Prevent body scroll
  ↓
Render backdrop + modal content
  ↓
On close: Remove listeners, allow body scroll
```

---

## 🎯 Component Selection Guide

### For Page Layout
```
Use → Container (wrapper)
Use → PageHeader (title)
Use → Section (grouping)
Use → Grid (responsive layout)
```

### For Data Display
```
Use → Card (containers)
Use → StatsCard (numbers)
Use → Table (list data)
Use → Grid (responsive grid)
```

### For User Input
```
Use → FormInput (text)
Use → FormSelect (options)
Use → FormCheckbox (boolean)
Use → FormRadio (single choice)
Use → Button (submit)
```

### For Feedback
```
Use → LoadingSpinner (async)
Use → ErrorAlert (errors)
Use → EmptyState (no data)
Use → Toast (notifications)
```

### For Interactions
```
Use → Modal (dialogs)
Use → ConfirmModal (confirmations)
Use → Dropdown (menus)
Use → Button (actions)
```

---

## 🛠️ Component Extension Patterns

### Adding New Variant to Button
```javascript
// In UIComponents.jsx
const variants = {
  primary: '...',
  secondary: '...',
  danger: '...',
  ghost: '...',
  // NEW:
  outline: 'border-2 border-emerald-600 text-emerald-600',
};
```

### Creating Composite Component
```javascript
const UserCard = ({ user }) => (
  <Card clickable onClick={() => navigate(`/users/${user.id}`)}>
    <PageHeader title={user.name} subtitle={user.role} />
    <Section>
      <p className={designSystem.typography.body}>{user.bio}</p>
    </Section>
    <Button>View Profile</Button>
  </Card>
);
```

### Creating Custom Hook
```javascript
const useUserForm = () => {
  const [form, setForm] = useState({});
  const { success, error } = useToast();
  
  const handleSubmit = async () => {
    try {
      await api.updateUser(form);
      success('Profile updated!');
    } catch (err) {
      error('Update failed');
    }
  };
  
  return { form, setForm, handleSubmit };
};
```

---

## 📊 Import Patterns

### Pattern 1: Specific Imports
```javascript
import { Button, Card, Container } from '../components';
import { FormInput } from '../components';
import { CheckIcon } from '../components';
```

### Pattern 2: Namespace Import
```javascript
import * as Components from '../components';
import * as Icons from '../components';

<Components.Button />
<Icons.CheckIcon />
```

### Pattern 3: Design System
```javascript
import { designSystem, cn } from '../theme/designSystem';

const className = cn(designSystem.spacing.md, 'p-4');
```

### Pattern 4: All from Index
```javascript
import { Button, Card, FormInput, Modal, useToast } from '../components/index.js';
```

---

## ✅ Quality Checklist

### Component Completeness
- ✓ Props documented
- ✓ Error states handled
- ✓ Loading states shown
- ✓ Empty states provided
- ✓ Accessibility features
- ✓ Responsive design
- ✓ Keyboard support
- ✓ Example usage

### Code Quality
- ✓ Clean, readable code
- ✓ No hardcoded values
- ✓ Uses design system
- ✓ Proper JSX structure
- ✓ Consistent naming
- ✓ Error boundaries ready

### Testing Readiness
- ✓ Testable props
- ✓ Connected to auth
- ✓ API integration ready
- ✓ Form validation ready
- ✓ Modal triggers ready
- ✓ Toast notifications ready

---

## 🚀 Component Adoption Timeline

### Week 1: Core Adoption
- Achievements page ✅ (Already done)
- Dashboard refactor (In Progress)
- GameList refactor (Planned)

### Week 2: Form Integration
- Login/Register (Planned)
- Settings page (Planned)
- Profile page (Planned)

### Week 3: Modal Adoption
- Game results modal (Planned)
- Confirmation dialogs (Planned)
- Error modals (Planned)

### Week 4: Full Integration
- All pages using components
- Consistent styling across app
- Ready for production

---

## 📚 Quick Reference

### Most Used Components
1. Container - Wrapper for every page
2. Button - Every action
3. Card - Every card display
4. Grid - Every list
5. Section - Every section
6. FormInput - Every form
7. Modal - Every dialog
8. Toast - Every notification

### Most Used Colors
1. Emerald-600 - Primary action
2. Teal-600 - Secondary action
3. Gray-700 - Text
4. White/40 - Glassmorphism

### Most Used Animations
1. fade-in - Component appear
2. slide-up - Modal appear
3. pulse - Loading states
4. hover-lift - Card hover

---

*This document serves as the complete architectural reference for the EcoVerse UI System.*
