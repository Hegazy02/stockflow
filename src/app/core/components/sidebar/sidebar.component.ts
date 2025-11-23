import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  Package,
  TrendingUp,
  Warehouse,
  ArrowLeftRight,
  FileText,
  Bell,
  Mail,
  Plus,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-angular';

interface MenuItem {
  label: string;
  icon: any;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  userName = 'Jane Cooper';
  userLocation = 'New York, NY';
  lastUpdate = '8 Apr 2025';

  // Lucide icons
  readonly LayoutDashboard = LayoutDashboard;
  readonly Package = Package;
  readonly TrendingUp = TrendingUp;
  readonly Warehouse = Warehouse;
  readonly ArrowLeftRight = ArrowLeftRight;
  readonly FileText = FileText;
  readonly Bell = Bell;
  readonly Mail = Mail;
  readonly Plus = Plus;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly ChevronRight = ChevronRight;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard', active: true },
    { label: 'Products', icon: Package, route: '/products', active: false },
    { label: 'Warehouses', icon: Warehouse, route: '/warehouses', active: false },
    { label: 'Stock Levels', icon: TrendingUp, route: '/stock-levels', active: false },
    { label: 'Stock Transfer', icon: ArrowLeftRight, route: '/Stock-transfer', active: false },
    { label: 'Reports', icon: FileText, route: '/reports', active: false },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.menuItems.forEach((item) => (item.active = item.route === route));
    this.router.navigate([route]);
  }

  logout(): void {
    // Implement logout logic
    console.log('Logging out...');
  }

  openSettings(): void {
    this.router.navigate(['/settings']);
  }
}
