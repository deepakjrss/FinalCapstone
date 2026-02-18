# EcoVerse UI Component Library Documentation

## Overview

This is a comprehensive, production-ready component library for the EcoVerse application. All components follow consistent design principles and use TailwindCSS with a centralized design system.

---

## Core UI Components

### Button

Reusable button component with multiple variants and sizes.

```jsx
import { Button } from '@/components';

// Default usage
<Button onClick={() => console.log('clicked')}>Click me</Button>

// Variants: primary (default), secondary, danger, ghost
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Cancel</Button>

// Sizes: sm, md (default), lg
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With loading state
<Button disabled loading>Loading...</Button>

// Full width
<Button fullWidth>Full Width</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean
- `fullWidth`: boolean
- `onClick`: function
- `children`: ReactNode

---

### Card

Glassmorphic card component with optional hover effects.

```jsx
import { Card } from '@/components';

// Basic card
<Card>
  <p>Card content</p>
</Card>

// Clickable card with hover effect
<Card clickable onClick={() => navigate('/path')}>
  <p>Click to navigate</p>
</Card>

// With custom classes
<Card className="p-8">Custom padding</Card>
```

**Props:**
- `children`: ReactNode
- `clickable`: boolean
- `onClick`: function
- `className`: string

---

### Container

Max-width wrapper component for consistent page width.

```jsx
import { Container } from '@/components';

<Container>
  {/* Content with max-width constraint */}
</Container>

<Container fluid>
  {/* Full width container */}
</Container>
```

**Props:**
- `children`: ReactNode
- `fluid`: boolean
- `className`: string

---

### PageHeader

Standardized page title, subtitle, and optional icon.

```jsx
import { PageHeader, SearchIcon } from '@/components';

<PageHeader
  icon={SearchIcon}
  title="Find Games"
  subtitle="Search and filter available games"
/>
```

**Props:**
- `icon`: Component
- `title`: string
- `subtitle`: string

---

### StatsCard

Display statistics with colored values.

```jsx
import { StatsCard } from '@/components';

<StatsCard
  label="Total Eco Points"
  value={1250}
  color="emerald"
/>

// Color options: emerald, teal, blue, purple
<StatsCard label="Rank" value={5} color="teal" />
```

**Props:**
- `label`: string
- `value`: number | string
- `color`: 'emerald' | 'teal' | 'blue' | 'purple'

---

### LoadingSpinner

Animated loading state indicator.

```jsx
import { LoadingSpinner } from '@/components';

<LoadingSpinner />
<LoadingSpinner message="Loading badges..." />
```

**Props:**
- `message`: string

---

### EmptyState

Display when no content is available.

```jsx
import { EmptyState, Button } from '@/components';

<EmptyState
  icon="🎮"
  title="No Games Found"
  message="Try adjusting your search filters"
  action={<Button>Reset Filters</Button>}
/>
```

**Props:**
- `icon`: string (emoji)
- `title`: string
- `message`: string
- `action`: ReactNode (button)

---

### ErrorAlert

Display error messages with retry capability.

```jsx
import { ErrorAlert } from '@/components';

<ErrorAlert
  message="Failed to load badges"
  onRetry={() => fetchBadges()}
/>
```

**Props:**
- `message`: string
- `onRetry`: function

---

### Badge

Tag/label component.

```jsx
import { Badge } from '@/components';

<Badge>New</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="danger">Failed</Badge>
```

**Props:**
- `children`: ReactNode
- `variant`: 'default' | 'success' | 'warning' | 'danger'

---

### Section

Content grouping with optional title.

```jsx
import { Section } from '@/components';

<Section title="Achievements" subtitle="Your badges">
  {/* Content inside section */}
</Section>

<Section>
  {/* Without title */}
</Section>
```

**Props:**
- `title`: string
- `subtitle`: string
- `children`: ReactNode

---

### Grid

Responsive grid layout (1-4 columns).

```jsx
import { Grid } from '@/components';

// Auto-responsive grid
<Grid cols={3}>
  {/* 3 columns on desktop, adapts to mobile */}
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</Grid>

<Grid cols={2} gap="lg">
  {/* 2 columns with large gap */}
</Grid>
```

**Props:**
- `cols`: 1 | 2 | 3 | 4
- `gap`: 'sm' | 'md' | 'lg' | 'xl'
- `children`: ReactNode

---

## Form Components

### FormInput

Text input field with validation and help text.

```jsx
import { FormInput, SearchIcon } from '@/components';

const [email, setEmail] = useState('');
const [error, setError] = useState('');

<FormInput
  label="Email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  icon={SearchIcon}
  error={error}
  helpText="We'll never share your email"
  required
/>
```

**Props:**
- `label`: string
- `type`: 'text' | 'email' | 'password'
- `placeholder`: string
- `value`: string
- `onChange`: function
- `error`: string
- `helpText`: string
- `required`: boolean
- `disabled`: boolean
- `icon`: Component

---

### FormTextarea

Multi-line text input with auto-resize.

```jsx
import { FormTextarea } from '@/components';

const [bio, setBio] = useState('');

<FormTextarea
  label="Bio"
  placeholder="Tell us about yourself"
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  rows={4}
  required
/>
```

**Props:**
- `label`: string
- `placeholder`: string
- `value`: string
- `onChange`: function
- `rows`: number
- `error`: string
- `helpText`: string
- `required`: boolean
- `disabled`: boolean

---

### FormSelect

Dropdown select input.

```jsx
import { FormSelect } from '@/components';

const [role, setRole] = useState('');

<FormSelect
  label="Role"
  options={[
    { label: 'Student', value: 'student' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Admin', value: 'admin' },
  ]}
  value={role}
  onChange={(e) => setRole(e.target.value)}
  required
/>
```

**Props:**
- `label`: string
- `options`: Array<{ label, value }>
- `value`: string
- `onChange`: function
- `placeholder`: string
- `error`: string
- `helpText`: string
- `required`: boolean
- `disabled`: boolean

---

### FormCheckbox

Checkbox input.

```jsx
import { FormCheckbox } from '@/components';

const [agreed, setAgreed] = useState(false);

<FormCheckbox
  label="I agree to terms and conditions"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

**Props:**
- `label`: string
- `checked`: boolean
- `onChange`: function
- `error`: string
- `disabled`: boolean

---

### FormRadio

Radio button group.

```jsx
import { FormRadio } from '@/components';

const [category, setCategory] = useState('');

<FormRadio
  label="Category"
  name="category"
  options={[
    { label: 'Science', value: 'science' },
    { label: 'History', value: 'history' },
  ]}
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  direction="horizontal"
/>
```

**Props:**
- `label`: string
- `name`: string
- `options`: Array<{ label, value }>
- `value`: string
- `onChange`: function
- `direction`: 'vertical' | 'horizontal'
- `error`: string
- `disabled`: boolean

---

### Form

Form wrapper with consistent spacing.

```jsx
import { Form, FormInput, FormSelect, Button } from '@/components';

<Form onSubmit={handleSubmit}>
  <FormInput
    label="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <FormSelect
    label="Category"
    options={categories}
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  />
  <Button onClick={() => console.log('submit')}>Submit</Button>
</Form>
```

**Props:**
- `onSubmit`: function
- `children`: ReactNode
- `loading`: boolean

---

### Alert

Alert message with multiple variants.

```jsx
import { Alert, CheckIcon } from '@/components';

<Alert
  variant="success"
  title="Success!"
  message="Your changes have been saved"
  icon={CheckIcon}
/>

// Variants: success, error, warning, info
```

**Props:**
- `variant`: 'success' | 'error' | 'warning' | 'info'
- `title`: string
- `message`: string
- `icon`: Component
- `onClose`: function
- `action`: ReactNode

---

### ProgressBar

Progress indicator.

```jsx
import { ProgressBar } from '@/components';

<ProgressBar
  value={75}
  max={100}
  label="Profile Completion"
  showPercentage
  variant="default"
/>

// Variants: default, success, warning, danger, info
```

**Props:**
- `value`: number
- `max`: number
- `label`: string
- `showPercentage`: boolean
- `variant`: string

---

### Tooltip

Hover tooltip component.

```jsx
import { Tooltip } from '@/components';

<Tooltip content="Click to learn more" position="top">
  <button>Hover me</button>
</Tooltip>

// Positions: top, bottom, left, right
```

**Props:**
- `content`: string
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `children`: ReactNode

---

## Modal & Dialog Components

### Modal

Main modal/dialog component.

```jsx
import { Modal, Button } from '@/components';
import { InfoIcon } from '@/components';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  subtitle="Are you sure?"
  icon={InfoIcon}
  size="md"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <p>This action cannot be undone.</p>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `subtitle`: string
- `children`: ReactNode
- `footer`: ReactNode
- `size`: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `icon`: Component
- `showHeader`: boolean
- `closeOnBackdrop`: boolean
- `closeOnEscape`: boolean

---

### ConfirmModal

Simplified confirmation dialog.

```jsx
import { ConfirmModal } from '@/components';

<ConfirmModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Badge?"
  message="This action cannot be undone."
  confirmText="Delete"
  variant="danger"
/>

// Variants: default, danger, warning, success
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `onConfirm`: function
- `title`: string
- `message`: string
- `confirmText`: string
- `cancelText`: string
- `variant`: string
- `loading`: boolean

---

### Toast

Notification toast component.

```jsx
import { Toast, CheckIcon } from '@/components';

<Toast
  message="Changes saved successfully!"
  type="success"
  icon={CheckIcon}
  duration={4000}
  onClose={() => setToast(null)}
/>

// Types: success, error, warning, info
```

**Props:**
- `message`: string
- `type`: 'success' | 'error' | 'warning' | 'info'
- `duration`: number (milliseconds)
- `icon`: Component
- `onClose`: function

---

### useToast Hook

Manage toasts from anywhere.

```jsx
import { useToast, ToastContainer } from '@/components';

function MyComponent() {
  const { toasts, addToast, removeToast, success, error } = useToast();

  return (
    <>
      <button onClick={() => success('Saved!')}>Save</button>
      <button onClick={() => error('Failed to save')}>Fail</button>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
```

**Methods:**
- `addToast(message, type, duration)`
- `removeToast(id)`
- `success(message)`
- `error(message)`
- `warning(message)`
- `info(message)`

---

### Dropdown

Dropdown menu component.

```jsx
import { Dropdown, DropdownItem, SettingsIcon } from '@/components';

<Dropdown
  trigger={<button>⋮ Menu</button>}
  align="right"
>
  <DropdownItem onClick={() => handleEdit()}>Edit</DropdownItem>
  <DropdownItem onClick={() => handleDelete()} danger>Delete</DropdownItem>
</Dropdown>
```

**Props:**
- `trigger`: ReactNode
- `align`: 'left' | 'right'
- `closeOnClick`: boolean
- `children`: ReactNode

---

### HoverCard

Hover-triggered card component.

```jsx
import { HoverCard } from '@/components';

<HoverCard
  trigger={<span>Hover me</span>}
  position="top"
>
  <p>Additional information here</p>
</HoverCard>

// Positions: top, bottom, left, right
```

**Props:**
- `trigger`: ReactNode
- `width`: string (TailwindCSS class)
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `children`: ReactNode

---

## Icon Components

Full set of SVG icons with customizable sizing.

```jsx
import { CheckIcon, TrashIcon, Icons } from '@/components';

// Individual import
<CheckIcon className="w-5 h-5 text-green-600" />
<TrashIcon className="w-4 h-4" />

// From Icons object
<Icons.Edit className="w-6 h-6" />
<Icons.Download className="w-6 h-6" />
```

**Available Icons:**
- `CheckIcon` - Success indicator
- `CloseIcon` - Close/dismiss
- `ChevronDownIcon` - Dropdown indicator
- `ChevronUpIcon` - Up indicator
- `ArrowRightIcon` - Right navigation
- `ArrowLeftIcon` - Left navigation
- `EditIcon` - Edit action
- `TrashIcon` - Delete action
- `DownloadIcon` - Download
- `UploadIcon` - Upload
- `SearchIcon` - Search
- `MenuIcon` - Menu toggle
- `BellIcon` - Notifications
- `UserIcon` - User profile
- `SettingsIcon` - Settings
- `StarIcon` - Rating/favorite
- `HeartIcon` - Like/favorite
- `EyeIcon` - View/visibility
- `EyeOffIcon` - Hide
- `SpinnerIcon` - Loading
- `AlertIcon` - Alert/warning
- `InfoIcon` - Information
- `PlusIcon` - Add
- `MinusIcon` - Remove
- `LogoutIcon` - Logout
- `LoginIcon` - Login
- `GlobeIcon` - Global/world

---

## Design System

Access centralized design tokens:

```jsx
import { designSystem, ecoTheme, cn } from '@/theme/designSystem';

// Typography
const h1 = designSystem.typography.h1;
const body = designSystem.typography.body;

// Colors
const emerald600 = designSystem.colors.emerald[600];

// Spacing
const padding = designSystem.spacing.md;

// Class name combining
const classes = cn('p-4', error && 'border-red-500');

// Eco-specific theme
const badgeEmojis = ecoTheme.badgeEmojis;
const statusColors = ecoTheme.statusColors;
```

---

## Best Practices

1. **Always use components**: Don't create inline styles; use reusable components.
2. **Leverage design system**: Use `designSystem` tokens for consistency.
3. **Responsive by default**: All components are responsive out of the box.
4. **Accessibility**: All components include proper ARIA labels and keyboard support.
5. **Type safety**: Use PropTypes for component prop validation.
6. **Performance**: Components use React.memo where appropriate.
7. **Error handling**: Always provide error states and retry mechanisms.
8. **Loading states**: Always show loading indicators for async operations.

---

## File Structure

```
src/
├── components/
│   ├── UIComponents.jsx       # Core UI components
│   ├── FormComponents.jsx      # Form inputs and controls
│   ├── ModalComponents.jsx     # Modals and dialogs
│   ├── Icons.jsx               # SVG icons
│   └── index.js                # Component exports
├── theme/
│   └── designSystem.js         # Design tokens and utilities
├── styles/
│   └── global.css              # Global styles and animations
└── pages/
    └── *.jsx                   # Page components using library
```

---

## Color Palette

- **Primary**: Emerald-600 (#059669)
- **Secondary**: Teal-600 (#0d9488)
- **Success**: Green-600 (#16a34a)
- **Warning**: Yellow-600 (#ca8a04)
- **Danger**: Red-600 (#dc2626)
- **Info**: Blue-600 (#2563eb)

---

## Animation Library

- `animate-fade-in` - Fade in effect
- `animate-slide-up` - Slide up effect
- `animate-bounce-gentle` - Gentle bounce
- `animate-pulse-glow` - Pulsing glow
- `hover-lift` - Lift on hover

---

## Support

For issues or feature requests, please create an issue in the project repository.
