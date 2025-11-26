import { Component, Input } from '@angular/core';
import { AlertCircle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-error-message',
  imports: [LucideAngularModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
})
export class ErrorMessageComponent {
  readonly AlertCircle = AlertCircle;
  @Input() message = '';
}
