import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import {
  LucideAngularModule,
  LayoutDashboard,
  Package,
  TrendingUp,
  Warehouse,
  Shapes,
  ArrowLeftRight,
  FileText,
  Bell,
  Mail,
  Plus,
  UsersRound,
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
export class SidebarComponent implements OnInit, OnDestroy {
  userName = 'Jane Cooper';
  userLocation = 'New York, NY';
  lastUpdate = '8 Apr 2025';
  private destroy$ = new Subject<void>();

  // Lucide icons
  readonly LayoutDashboard = LayoutDashboard;
  readonly Package = Package;
  readonly TrendingUp = TrendingUp;
  readonly Warehouse = Warehouse;
  readonly Shapes = Shapes;
  readonly UsersRound = UsersRound;
  readonly ArrowLeftRight = ArrowLeftRight;
  readonly FileText = FileText;
  readonly Bell = Bell;
  readonly Mail = Mail;
  readonly Plus = Plus;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly ChevronRight = ChevronRight;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard', active: false },
    { label: 'Stock', icon: TrendingUp, route: '/stock-levels', active: false },
    { label: 'Stock transfer', icon: ArrowLeftRight, route: '/Stock-transfer', active: false },
    { label: 'Reports', icon: FileText, route: '/reports', active: false },
    { label: 'Partners', icon: UsersRound, route: '/partners', active: false },
    { label: 'Products', icon: Package, route: '/products', active: false },
    { label: 'Categories', icon: Shapes, route: '/categories', active: false },
    { label: 'Warehouses', icon: Warehouse, route: '/warehouses', active: false },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set initial active state based on current route
    this.updateActiveMenuItem(this.router.url);

    // Listen to route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateActiveMenuItem(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateActiveMenuItem(url: string): void {
    this.menuItems.forEach((item) => {
      // Check if the current URL starts with the menu item route
      item.active = url.startsWith(item.route);
    });
  }

  navigateTo(route: string): void {
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
