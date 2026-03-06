import { Component, Input, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Copy, Check } from 'lucide-angular';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-copy-text',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './copy-text.component.html',
    styleUrls: ['./copy-text.component.scss']
})
export class CopyTextComponent implements OnDestroy {
    @Input() text: string = '';
    @Input() label: string = 'Copy';

    copied = signal(false);
    private timeoutId?: number;

    private messageService = inject(MessageService);

    readonly Copy = Copy;
    readonly Check = Check;

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.text);

            this.copied.update((val) => !val);

            this.messageService.add({
                severity: 'success',
                summary: 'Copied!',
                detail: `${this.text} copied to clipboard`,
                life: 2000
            });

            // reset existing timer
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }

            this.timeoutId = window.setTimeout(() => {
                this.copied.update((val) => !val);

            }, 1000);

        } catch (err) {
            console.error('Failed to copy text:', err);

            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to copy text to clipboard',
                life: 3000
            });
        }
    }

    ngOnDestroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
}