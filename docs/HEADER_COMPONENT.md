# Header Component Documentation

## Overview

The header component is a sticky top navigation bar matching the Quantora dashboard design, featuring search functionality, date display, and quick action buttons.

## Features

✅ **Search Bar** - Global search with icon and placeholder
✅ **Date Display** - Current date in formatted style
✅ **Action Buttons** - Calendar, Messages, Settings
✅ **Lucide Icons** - Modern, consistent icon library
✅ **Sticky Position** - Stays at top when scrolling
✅ **Responsive Design** - Mobile-friendly layout
✅ **Color Palette** - Uses project colors

## Component Structure

```
src/app/core/components/header/
├── header.component.ts       # Component logic
├── header.component.html     # Template
└── header.component.scss     # Styles
```

## Usage

The header is automatically included in the layout component:

```typescript
// Already integrated in layout.component.ts
import { HeaderComponent } from '../header/header.component';

@Component({
  imports: [HeaderComponent]
})
export class LayoutComponent {}
```

## Features Breakdown

### 1. Search Functionality

```html
<div class="search-box">
  <lucide-icon [img]="Search" [size]="18"></lucide-icon>
  <input 
    type="text" 
    placeholder="Search here..." 
    [(ngModel)]="searchQuery"
    (keyup.enter)="onSearch()"
  />
</div>
```

**Behavior:**
- Type to search
- Press Enter to trigger search
- Focus state with primary color border
- Placeholder text: "Search here..."

### 2. Date Display

```typescript
get formattedDate(): string {
  const options = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  };
  return this.currentDate.toLocaleDateString('en-US', options);
}
```

**Output:** "08 April, 2025"

### 3. Action Buttons

Three quick action buttons:
- **Calendar** - Opens calendar view
- **Messages** - Opens messages/notifications
- **Settings** - Opens settings panel

## Icons Used

| Icon | Import Name | Purpose |
|------|-------------|---------|
| 🔍 | `Search` | Search input |
| 📅 | `Calendar` | Calendar button |
| 💬 | `MessageSquare` | Messages button |
| ⚙️ | `SettingsIcon` | Settings button |

## Styling

### Colors
- Background: `var(--color-white)`
- Search box: `var(--color-background)`
- Text: `var(--color-text-primary)`
- Icons: `var(--color-text-secondary)`
- Hover: `var(--color-primary)`

### Dimensions
- Height: `70px` (desktop), `60px` (mobile)
- Button size: `40px × 40px`
- Border radius: `var(--radius-lg)` for search, `var(--radius-md)` for buttons

### Spacing
- Padding: `var(--spacing-xl)` (desktop), `var(--spacing-md)` (mobile)
- Gap between buttons: `var(--spacing-md)`

## Responsive Behavior

### Desktop (>768px)
- Full search bar (max-width: 400px)
- Date display visible
- All action buttons visible
- 70px height

### Tablet (≤768px)
- Reduced search bar (max-width: 200px)
- Date display hidden
- All action buttons visible
- 60px height

### Mobile (≤480px)
- Minimal search bar (max-width: 150px)
- Date display hidden
- Reduced button spacing
- 60px height

## Customization

### Change Date Format

```typescript
get formattedDate(): string {
  return this.currentDate.toLocaleDateString('en-US', {
    weekday: 'short',  // Add day of week
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
```

### Add More Action Buttons

```typescript
// In component
import { Bell } from 'lucide-angular';
readonly Bell = Bell;

// In template
<button class="header-btn" (click)="openNotifications()">
  <lucide-icon [img]="Bell" [size]="20"></lucide-icon>
</button>
```

### Implement Search Logic

```typescript
onSearch(): void {
  if (this.searchQuery.trim()) {
    // Navigate to search results
    this.router.navigate(['/search'], { 
      queryParams: { q: this.searchQuery } 
    });
    
    // Or emit event
    this.searchEvent.emit(this.searchQuery);
  }
}
```

## Integration with Layout

The header is positioned in a flex layout:

```html
<div class="app-layout">
  <app-sidebar></app-sidebar>
  <div class="content-wrapper">
    <app-header></app-header>  <!-- Sticky header -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
```

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ Sidebar │ Header (sticky)           │
│         ├───────────────────────────┤
│         │ Main Content              │
│         │ (scrollable)              │
│         │                           │
└─────────────────────────────────────┘
```

## Accessibility

- ✅ Semantic HTML (`<header>`, `<button>`)
- ✅ ARIA labels on buttons (title attribute)
- ✅ Keyboard navigation support
- ✅ Focus states on interactive elements
- ✅ Alt text on icons

## Performance

- Sticky positioning with `position: sticky`
- CSS transitions for smooth interactions
- Minimal re-renders with OnPush strategy (can be added)
- Lucide icons are tree-shakeable

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Add notification badge count
- [ ] Implement autocomplete for search
- [ ] Add keyboard shortcuts (Ctrl+K for search)
- [ ] Add user profile dropdown
- [ ] Add theme toggle (dark mode)
- [ ] Add breadcrumb navigation
- [ ] Add quick actions menu

## Examples

### With Notification Badge

```html
<button class="header-btn" style="position: relative;">
  <lucide-icon [img]="MessageSquare" [size]="20"></lucide-icon>
  <span class="badge badge-danger" style="position: absolute; top: -4px; right: -4px;">
    3
  </span>
</button>
```

### With Dropdown Menu

```html
<div class="dropdown">
  <button class="header-btn">
    <lucide-icon [img]="SettingsIcon" [size]="20"></lucide-icon>
  </button>
  <div class="dropdown-menu">
    <!-- Menu items -->
  </div>
</div>
```

---

**Status**: ✅ Complete
**Last Updated**: 2025-04-08
**Version**: 1.0.0
