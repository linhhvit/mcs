# Component Architecture Guide

## Overview

The frontend is structured with **reusable components** and **dynamic pages** for easy customization and updates.

## Directory Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── cameras/
│   │   ├── page.tsx        # List page
│   │   └── [id]/
│   │       └── page.tsx    # Dynamic detail page
│   ├── checklists/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── ...
├── components/
│   ├── common/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Tabs.tsx
│   │   └── PageHeader.tsx
│   ├── cameras/            # Camera-specific components
│   │   ├── CameraCard.tsx
│   │   └── CameraList.tsx
│   ├── checklists/
│   │   └── ChecklistCard.tsx
│   ├── executions/
│   │   └── ExecutionCard.tsx
│   ├── Layout.tsx          # Main layout wrapper
│   └── index.ts            # Component exports
└── lib/
    └── api.ts              # API client
```

## Component Categories

### 1. Common Components (`components/common/`)

Reusable UI building blocks used across the app:

- **Button**: Styled button with variants (primary, secondary, danger, success)
- **Input**: Form input with label, error, and helper text
- **Card**: Container with padding and shadow options
- **Badge**: Status indicator with color variants
- **LoadingSpinner**: Loading indicator with size options
- **EmptyState**: Empty state display with icon and message
- **Tabs**: Tab navigation component
- **PageHeader**: Page title and description

### 2. Feature Components (`components/cameras/`, `components/checklists/`, etc.)

Domain-specific components:

- **CameraCard**: Displays camera information
- **CameraList**: Lists cameras with loading/empty states
- **ChecklistCard**: Displays checklist information
- **ExecutionCard**: Displays execution details

### 3. Pages (`app/*/page.tsx`)

Next.js pages that compose components:

- List pages: Display collections using feature components
- Detail pages: Dynamic routes using `[id]` folder structure

## Dynamic Pages

### How Dynamic Routes Work

Next.js uses folder structure for dynamic routes:

```
app/
├── cameras/
│   ├── page.tsx           # /cameras (list)
│   └── [id]/
│       └── page.tsx      # /cameras/123 (detail)
```

### Example: Camera Detail Page

```tsx
// app/cameras/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'

export default function CameraDetailPage() {
  const params = useParams()
  const cameraId = params.id  // "123"
  
  // Load and display camera details
}
```

## Customization Guide

### 1. Update Component Styles

Edit component files directly:

```tsx
// components/common/Button.tsx
const variantClasses = {
  primary: 'bg-blue-600 ...',  // Change colors here
  // ...
}
```

### 2. Add New Components

1. Create component file:
   ```tsx
   // components/common/NewComponent.tsx
   export default function NewComponent() {
     return <div>...</div>
   }
   ```

2. Export from `components/index.ts`:
   ```tsx
   export { default as NewComponent } from './common/NewComponent'
   ```

3. Use in pages:
   ```tsx
   import { NewComponent } from '@/components'
   ```

### 3. Create New Feature Pages

1. Create page file:
   ```tsx
   // app/new-feature/page.tsx
   'use client'
   import Layout from '@/components/Layout'
   import PageHeader from '@/components/common/PageHeader'
   
   export default function NewFeaturePage() {
     return (
       <Layout>
         <PageHeader title="New Feature" />
         {/* Your content */}
       </Layout>
     )
   }
   ```

2. Add to navigation in `components/Layout.tsx`:
   ```tsx
   const navigation = [
     // ... existing
     { name: 'New Feature', href: '/new-feature', icon: '✨' },
   ]
   ```

### 4. Customize Card Components

Each feature has its own card component:

```tsx
// components/cameras/CameraCard.tsx
export default function CameraCard({ camera, onClick }: CameraCardProps) {
  return (
    <div className="card hover:shadow-lg">
      {/* Customize layout here */}
    </div>
  )
}
```

### 5. Add Dynamic Detail Pages

1. Create `[id]` folder:
   ```
   app/feature/[id]/page.tsx
   ```

2. Use `useParams()` to get ID:
   ```tsx
   const params = useParams()
   const id = params.id
   ```

3. Load data and display:
   ```tsx
   const data = await apiClient.getFeatureById(id)
   ```

## Best Practices

### 1. Component Reusability

- Use common components for UI elements
- Create feature components for domain logic
- Keep components small and focused

### 2. Props Interface

Always define TypeScript interfaces:

```tsx
interface ComponentProps {
  title: string
  description?: string
  onClick?: () => void
}
```

### 3. Loading States

Always handle loading:

```tsx
{loading ? (
  <LoadingSpinner />
) : (
  <ComponentList items={items} />
)}
```

### 4. Empty States

Show helpful empty states:

```tsx
{items.length === 0 ? (
  <EmptyState
    icon="📦"
    title="No items found"
    description="Add your first item to get started."
  />
) : (
  <ItemList items={items} />
)}
```

### 5. Error Handling

Handle errors gracefully:

```tsx
try {
  const data = await apiClient.getData()
} catch (error) {
  // Show error message or redirect
  router.push('/login')
}
```

## Component Props Examples

### Button
```tsx
<Button variant="primary" size="md" loading={isLoading}>
  Submit
</Button>
```

### Input
```tsx
<Input
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  error={errors.username}
  helperText="Enter your username"
/>
```

### Card
```tsx
<Card hover padding="lg">
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

### Badge
```tsx
<Badge variant="success" size="md">
  Active
</Badge>
```

## Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| Button | `components/common/Button.tsx` | Styled buttons |
| Input | `components/common/Input.tsx` | Form inputs |
| Card | `components/common/Card.tsx` | Containers |
| Badge | `components/common/Badge.tsx` | Status indicators |
| LoadingSpinner | `components/common/LoadingSpinner.tsx` | Loading states |
| EmptyState | `components/common/EmptyState.tsx` | Empty states |
| Tabs | `components/common/Tabs.tsx` | Tab navigation |
| PageHeader | `components/common/PageHeader.tsx` | Page headers |
| CameraCard | `components/cameras/CameraCard.tsx` | Camera display |
| ChecklistCard | `components/checklists/ChecklistCard.tsx` | Checklist display |
| ExecutionCard | `components/executions/ExecutionCard.tsx` | Execution display |

## Summary

✅ **Modular**: Components are separated by concern  
✅ **Reusable**: Common components used everywhere  
✅ **Customizable**: Easy to modify styles and behavior  
✅ **Type-safe**: Full TypeScript support  
✅ **Dynamic**: Support for dynamic routes  
✅ **Maintainable**: Clear structure and organization  

This architecture makes it easy to:
- Add new features
- Customize existing components
- Update styles globally
- Maintain consistency
- Scale the application

