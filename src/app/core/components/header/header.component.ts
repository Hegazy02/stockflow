import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Bell } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchQuery = '';
  currentDate = new Date();
  
  // Lucide icons
  readonly Search = Search;
  readonly Bell = Bell;

  get formattedDate(): string {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    };
    return this.currentDate.toLocaleDateString('en-US', options);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement search logic
    }
  }

  openNotifications(): void {
    console.log('Opening notifications...');
    // Implement notifications logic
  }
}
