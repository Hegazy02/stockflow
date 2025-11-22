# Sidebar Component Usage

## Overview

The sidebar component is a fully-featured navigation sidebar matching the Quantora dashboard design, built with the extracted color palette.

## Features

✅ **Logo Section** - Quantora branding with gradient icon
✅ **Welcome Message** - Personalized greeting with last update timestamp
✅ **Navigation Menu** - Active state highlighting with smooth transitions
✅ **Action Buttons** - Quick access buttons (notifications, messages, add new)
✅ **User Profile** - Avatar, name, location display
✅ **User Actions** - Settings and logout buttons
✅ **Responsive Design** - Mobile-friendly layout
✅ **Smooth Animations** - Hover effects and transitions

## Installation

The sidebar is already created in your project at:
- `src/app/core/components/sidebar/`

## Usage

### Option 1: Use with Layout Component

```typescript
// In your app.component.ts or main route
import { LayoutComponent } from './core/components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: '<app-layout></app-layout>'
})
export class AppComponent {}
```

### Option 2: Use Sidebar Directly

```typescript
import { SidebarComponent } from './core/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}
```

## Customization

### Update Menu Items

Edit the `menuItems` array in `sidebar.component.ts`:

```typescript
menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: '📊', route: '/dashboard', active: true },
  { label: 'Products', icon: '📦', route: '/products', active: false },
  { label: 'Stock Levels', icon: '📈', route: '/stock', active: false },
  { label: 'Orders', icon: '🛒', route: '/orders', active: false },
  { label: 'Reports', icon: '📋', route: '/reports', active: false }
];
```

### Update User Information

Modify the user properties in `sidebar.component.ts`:

```typescript
userName = 'Your Name';
userLocation = 'Your Location';
lastUpdate = 'Date';
```

### Change Avatar

Update the image URL in `sidebar.component.html`:

```html
<img src="your-avatar-url.jpg" alt="{{ userName }}">
```

## Color Palette Used

The sidebar uses the extracted Quantora color palette:

- **Primary**: `#6366f1` (Indigo/Purple)
- **Success**: `#3dd598` (Green)
- **Danger**: `#ff6b6b` (Coral)
- **Warning**: `#ffa94d` (Orange)
- **Background**: `#f8fafc` (Light Gray)
- **Text**: `#1e293b` (Dark)

## Styling

All styles use CSS variables from `src/styles/variables.scss`:

```scss
// Example usage
.nav-item {
  color: var(--color-text-secondary);
  background: var(--color-background);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}
```

## Responsive Behavior

- **Desktop** (>768px): Fixed sidebar at 260px width
- **Mobile** (≤768px): Full-width sidebar, stacks vertically

## Events

### Navigation

```typescript
navigateTo(route: string): void {
  this.menuItems.forEach(item => item.active = item.route === route);
  this.router.navigate([route]);
}
```

### Logout

```typescript
logout(): void {
  // Implement your logout logic
  console.log('Logging out...');
}
```

### Settings

```typescript
openSettings(): void {
  this.router.navigate(['/settings']);
}
```

## Integration with App Routes

Update your `app.routes.ts` to include the layout:

```typescript
import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component') },
      { path: 'products', loadComponent: () => import('./features/products/product-list.component') },
      // ... other routes
    ]
  }
];
```

## Accessibility

- Semantic HTML structure
- ARIA labels on buttons
- Keyboard navigation support
- Focus states on interactive elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Screenshots

The sidebar includes:
1. Gradient logo icon
2. Welcome section with rounded background
3. Active navigation item with gradient background
4. Circular action buttons
5. User profile card
6. Settings and logout buttons

## Icon Library

The sidebar uses **Lucide Angular** for icons. Lucide is a modern, clean icon library with over 1000+ icons.

### Available Icons

Current icons used:
- `LayoutDashboard` - Dashboard
- `Package` - Products
- `TrendingUp` - Stock Levels
- `ShoppingCart` - Orders
- `FileText` - Reports
- `Bell` - Notifications
- `Mail` - Messages
- `Plus` - Add New
- `Settings` - Settings
- `LogOut` - Log Out
- `ChevronRight` - Active indicator

### Adding New Icons

1. Import the icon in `sidebar.component.ts`:
```typescript
import { Home, Users, Database } from 'lucide-angular';
```

2. Add to component properties:
```typescript
readonly Home = Home;
readonly Users = Users;
```

3. Use in template:
```html
<lucide-icon [img]="Home" [size]="20"></lucide-icon>
```

### Browse All Icons

Visit: https://lucide.dev/icons/

## Tips

1. **Icons**: Lucide provides 1000+ icons - browse at https://lucide.dev
2. **Avatar**: Use a service like Gravatar or upload user avatars
3. **Notifications**: Add badge counts to action buttons
4. **Theme**: Extend with dark mode support using CSS variables
5. **Animation**: Customize transition speeds in variables.scss
6. **Icon Size**: Adjust icon sizes using the `[size]` attribute (default: 20)
