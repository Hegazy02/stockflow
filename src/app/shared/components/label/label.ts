import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  imports: [],
  templateUrl: './label.html',
  styleUrl: './label.scss',
})
export class LabelComponent {
  @Input() label: string = '';
  @Input() required: boolean = false;
}
