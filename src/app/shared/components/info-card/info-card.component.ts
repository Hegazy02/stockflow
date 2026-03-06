import { Component, Input, ContentChild, ElementRef, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements AfterContentInit {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle?: string;
  @Input() icon?: LucideIconData;
  @Input() backgroundColor: string = '#f0f9ff';
  @Input() iconColor: string = '#3b82f6';

  @ContentChild('subtitle', { read: ElementRef }) projectedSubtitle?: ElementRef;
  hasProjectedContent = false;

  ngAfterContentInit() {
    this.hasProjectedContent = !!this.projectedSubtitle;
  }

  // Convert hex color to darker shade
  getDarkerColor(hex: string, percent: number = 40): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Darken by reducing each component
    const darkenedR = Math.floor(r * (1 - percent / 100));
    const darkenedG = Math.floor(g * (1 - percent / 100));
    const darkenedB = Math.floor(b * (1 - percent / 100));
    
    // Convert back to hex
    return `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
  }
}
