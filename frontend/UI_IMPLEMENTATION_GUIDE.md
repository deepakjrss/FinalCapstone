# EcoVerse Frontend UI - Implementation Quick Reference

## 🚀 Common Patterns

### Pattern 1: Fetch with Loading/Empty/Error

```jsx
import { useState, useEffect } from 'react';
import { LoadingSkeleton, EmptyState, ErrorState } from './components/UIComponents';
import { useToast } from './components/ToastNotification';

function MyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/data');
        setData(response);
      } catch (err) {
        setError(err.message);
        showError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton variant="card" count={3} />;
  if (error) return <ErrorState onRetry={fetchData} />;
  if (!data?.length) return <EmptyState title="No data found" />;

  return <div>{/* Render data */}</div>;
}
```

### Pattern 2: Form Submission with Toast

```jsx
import { LoadingButton } from './components/UIComponents';
import { useToast } from './components/ToastNotification';

function FormComponent() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await api.post('/submit', formData);
      showSuccess('Submission successful!');
      // Reset or navigate
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      isLoading={loading}
      loadingText="Submitting..."
      onClick={handleSubmit}
    >
      Submit
    </LoadingButton>
  );
}
```

### Pattern 3: Data Grid with Skeletons

```jsx
import { LoadingSkeleton, EmptyState, Badge } from './components/UIComponents';

function DataTable({ data, loading }) {
  if (loading) {
    return <LoadingSkeleton variant="line" count={5} />;
  }

  if (!data?.length) {
    return <EmptyState icon="📭" title="No records" />;
  }

  return (
    <div className="space-y-2">
      {data.map(item => (
        <div key={item.id} className="flex justify-between p-4 border rounded-lg hover-lift">
          <span>{item.name}</span>
          <Badge variant={item.status === 'active' ? 'success' : 'warning'}>
            {item.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 Component Usage Snippets

### Alert Component
```jsx
import { Alert } from './components/UIComponents';

// Info Alert
<Alert variant="info">
  This is an informational message
</Alert>

// Success Alert (non-closable)
<Alert variant="success" closable={false}>
  ✨ Operation completed successfully!
</Alert>

// Warning Alert
<Alert variant="warning" icon="⚡">
  Please review before proceeding
</Alert>

// Error Alert with close callback
<Alert
  variant="error"
  onClose={() => console.log('Dismissed')}
>
  An error occurred, please try again
</Alert>
```

### Badge Component
```jsx
import { Badge } from './components/UIComponents';

// Different variants
<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Rejected</Badge>

// With dot indicator
<Badge variant="success" dot>Active</Badge>

// Different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### ProgressBar Component
```jsx
import { ProgressBar } from './components/UIComponents';

// Basic progress
<ProgressBar value={65} max={100} />

// Success variant
<ProgressBar value={100} max={100} variant="success" />

// With custom styling
<ProgressBar
  value={45}
  max={100}
  variant="warning"
  showLabel={true}
  className="mb-4"
/>
```

### LoadingButton Component
```jsx
import { LoadingButton } from './components/UIComponents';

function MyPage() {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingButton
      isLoading={loading}
      loadingText="Processing..."
      onClick={() => {
        setLoading(true);
        // Do something
      }}
      variant="primary"
    >
      Click Me
    </LoadingButton>
  );
}
```

---

## 📦 Import Quick Reference

```jsx
// Toast notifications (App-wide)
import { useToast } from './components/ToastNotification';
const { showSuccess, showError, showWarning, showInfo } = useToast();

// Notification Service (API calls)
import notificationService from './services/notificationService';
const unread = await notificationService.getUnreadNotifications();

// UI Components
import {
  LoadingSkeleton,
  EmptyState,
  ErrorState,
  Badge,
  Alert,
  ProgressBar,
  Spinner,
  LoadingButton,
  EnhancedStatCard
} from './components/UIComponents';

// Notification Bell (already in navbar)
import NotificationBell from './components/NotificationBell';
```

---

## 🎯 Real-World Examples

### Example 1: Task List Page

```jsx
function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await taskService.getTasks();
      setTasks(response.tasks);
    } catch (error) {
      showError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      showSuccess('Task deleted successfully');
    } catch (error) {
      showError('Failed to delete task');
    }
  };

  if (loading) return <LoadingSkeleton count={3} />;
  if (!tasks.length) return <EmptyState title="No tasks yet" />;

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <div key={task.id} className="bg-white p-6 rounded-lg hover-lift">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{task.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
              <Badge 
                variant={task.status === 'completed' ? 'success' : 'warning'}
                className="mt-3"
              >
                {task.status}
              </Badge>
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Dashboard with Stats

```jsx
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticService.getStats()
      .then(setStats)
      .catch(() => showError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : (
        <>
          <EnhancedStatCard
            label="Total Tasks"
            value={stats.totalTasks}
            icon="✓"
            trend="↑ 12%"
            trendType="positive"
            bgVariant="green"
          />
          <EnhancedStatCard
            label="Completed"
            value={stats.completed}
            icon="✅"
            bgVariant="blue"
          />
          <EnhancedStatCard
            label="Pending"
            value={stats.pending}
            icon="⏳"
            bgVariant="amber"
          />
        </>
      )}
    </div>
  );
}
```

### Example 3: Notifications Page (Future)

```jsx
function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showSuccess } = useToast();

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(response.data.notifications);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    showSuccess('All marked as read');
    loadNotifications();
  };

  if (loading) return <LoadingSkeleton count={5} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={handleMarkAllAsRead}
          className="text-sm text-green-600 hover:text-green-700"
        >
          Mark all as read
        </button>
      </div>

      {!notifications.length ? (
        <EmptyState 
          icon="🔔" 
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className="bg-white p-4 rounded-lg border-l-4 border-green-500 hover-lift"
            >
              <p className="text-gray-900 font-medium">{notif.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(notif.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Migration Guide

### Before (Old):
```jsx
// No loading state
// No error state
// No empty state
function OldComponent() {
  return <div>{data?.map(item => <div>{item}</div>)}</div>;
}
```

### After (New):
```jsx
// With proper states
function NewComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useToast();

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(err => {
        setError(err);
        showError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={() => fetchData()} />;
  if (!data?.length) return <EmptyState />;

  return <div>{data.map(item => <div>{item}</div>)}</div>;
}
```

---

## 💡 Best Practices

1. **Always show loading skeleton**
2. **Always handle empty states**
3. **Always show error messages**
4. **Use toast for temporary notifications**
5. **Use Badge for status indicators**
6. **Use LoadingButton for form submissions**
7. **Use ProgressBar for progress tracking**
8. **Use Alert for important information**
9. **Use EnhancedStatCard for metrics**
10. **Memoize expensive components**

---

## 🧪 Testing Checklist

- [ ] Loading state shows skeleton
- [ ] Empty state displays with icon
- [ ] Error state shows with retry button
- [ ] Toast notifications appear & disappear
- [ ] Notification bell shows unread count
- [ ] Notification dropdown works
- [ ] All buttons have hover effects
- [ ] Animations are smooth
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop

---

## 📚 Component Reference

| Component | Purpose | Example |
|-----------|---------|---------|
| `LoadingSkeleton` | Show while loading | `<LoadingSkeleton count={3} />` |
| `EmptyState` | Show when no data | `<EmptyState title="No data" />` |
| `ErrorState` | Show on error | `<ErrorState onRetry={retry} />` |
| `Badge` | Status indicator | `<Badge variant="success">Active</Badge>` |
| `Alert` | Information message | `<Alert variant="info">Message</Alert>` |
| `ProgressBar` | Progress indicator | `<ProgressBar value={50} max={100} />` |
| `Spinner` | Loading indicator | `<Spinner text="Loading..." />` |
| `LoadingButton` | Button with loading | `<LoadingButton isLoading={loading}>Submit</LoadingButton>` |
| `EnhancedStatCard` | Statistics display | `<EnhancedStatCard label="Tasks" value="24" />` |

---

## 🎉 You're Ready!

All components are production-ready and can be used immediately across the application!

Start with one page, then gradually migrate others to the new UI system.
