import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCell]',
})
export class CellTemplateDirective {
  @Input('appCell') field!: string;

  constructor(public template: TemplateRef<any>) {}
}
