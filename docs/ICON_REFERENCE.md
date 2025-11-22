# Lucide Icons Reference

## Installation

Lucide Angular is already installed in the project:

```bash
npm install lucide-angular
```

## Usage in Components

### 1. Import Icons

```typescript
import { LucideAngularModule, Home, User, Settings } from 'lucide-angular';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="Home" [size]="24"></lucide-icon>`
})
export class ExampleComponent {
  readonly Home = Home;
  readonly User = User;
  readonly Settings = Settings;
}
```

### 2. Use in Template

```html
<!-- Basic usage -->
<lucide-icon [img]="Home"></lucide-icon>

<!-- With custom size -->
<lucide-icon [img]="User" [size]="32"></lucide-icon>

<!-- With custom color (uses currentColor) -->
<lucide-icon [img]="Settings" [size]="20" style="color: #6366f1;"></lucide-icon>

<!-- With stroke width -->
<lucide-icon [img]="Home" [size]="24" [strokeWidth]="2"></lucide-icon>
```

## Icons Used in Sidebar

| Icon | Import Name | Usage |
|------|-------------|-------|
| 📊 Dashboard | `LayoutDashboard` | Main dashboard navigation |
| 📦 Products | `Package` | Products section |
| 📈 Stock | `TrendingUp` | Stock levels tracking |
| 🛒 Orders | `ShoppingCart` | Orders management |
| 📋 Reports | `FileText` | Reports and analytics |
| 🔔 Notifications | `Bell` | Notification center |
| ✉️ Messages | `Mail` | Messaging system |
| ➕ Add | `Plus` | Create new items |
| ⚙️ Settings | `Settings` | User settings |
| 🚪 Logout | `LogOut` | Sign out |
| ▶️ Arrow | `ChevronRight` | Active indicator |

## Common Icons for Inventory Management

### Navigation & UI
```typescript
import {
  Home, Menu, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Search, Filter, MoreVertical, MoreHorizontal
} from 'lucide-angular';
```

### Products & Inventory
```typescript
import {
  Package, PackageCheck, PackageX, PackagePlus, PackageMinus,
  Box, Boxes, Archive, Warehouse, Truck, ShoppingCart, ShoppingBag
} from 'lucide-angular';
```

### Data & Analytics
```typescript
import {
  TrendingUp, TrendingDown, BarChart, LineChart, PieChart,
  Activity, FileText, ClipboardList, FileSpreadsheet
} from 'lucide-angular';
```

### Actions
```typescript
import {
  Plus, Minus, Edit, Trash2, Save, Download, Upload, RefreshCw,
  Check, X, AlertCircle, Info, HelpCircle
} from 'lucide-angular';
```

### Users & Settings
```typescript
import {
  User, Users, UserPlus, Settings, Lock, Unlock, Eye, EyeOff,
  Bell, BellOff, Mail, Phone, MapPin
} from 'lucide-angular';
```

### Status Indicators
```typescript
import {
  CheckCircle, XCircle, AlertTriangle, AlertCircle, Info,
  Clock, Calendar, Tag, Star, Heart
} from 'lucide-angular';
```

## Styling Icons

### CSS Variables
```scss
lucide-icon {
  color: var(--color-primary);
  transition: color var(--transition-base);
  
  &:hover {
    color: var(--color-primary-dark);
  }
}
```

### Size Classes
```scss
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }
```

### Color Classes
```scss
.icon-primary { color: var(--color-primary); }
.icon-success { color: var(--color-success); }
.icon-warning { color: var(--color-warning); }
.icon-danger { color: var(--color-danger); }
```

## Examples

### Button with Icon
```html
<button class="btn btn-primary">
  <lucide-icon [img]="Plus" [size]="16"></lucide-icon>
  <span>Add Product</span>
</button>
```

### Icon Button
```html
<button class="icon-btn">
  <lucide-icon [img]="Edit" [size]="18"></lucide-icon>
</button>
```

### Status Badge with Icon
```html
<div class="badge badge-success">
  <lucide-icon [img]="CheckCircle" [size]="14"></lucide-icon>
  <span>In Stock</span>
</div>
```

### List Item with Icon
```html
<li class="list-item">
  <lucide-icon [img]="Package" [size]="20"></lucide-icon>
  <span>Product Name</span>
</li>
```

## Performance Tips

1. **Import only what you need** - Don't import all icons
2. **Use consistent sizes** - Stick to 16, 20, 24, 32px
3. **Leverage CSS** - Use currentColor for dynamic theming
4. **Cache icon components** - Store as readonly properties

## Resources

- **Official Docs**: https://lucide.dev/guide/packages/lucide-angular
- **Icon Browser**: https://lucide.dev/icons/
- **GitHub**: https://github.com/lucide-icons/lucide
- **NPM**: https://www.npmjs.com/package/lucide-angular

## Migration from Emoji

Before (Emoji):
```typescript
menuItems = [
  { label: 'Dashboard', icon: '📊', route: '/dashboard' }
];
```

After (Lucide):
```typescript
import { LayoutDashboard } from 'lucide-angular';

readonly LayoutDashboard = LayoutDashboard;

menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' }
];
```

Template:
```html
<lucide-icon [img]="item.icon" [size]="20"></lucide-icon>
```
