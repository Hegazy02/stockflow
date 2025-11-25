import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { LayoutComponent } from "./core/components/layout/layout.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('stockflow');
}
