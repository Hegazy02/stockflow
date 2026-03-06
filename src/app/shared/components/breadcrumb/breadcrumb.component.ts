import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { LucideAngularModule, ChevronRight, Home } from 'lucide-angular';

export interface Breadcrumb {
    label: string;
    url: string;
}

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
    breadcrumbs: Breadcrumb[] = [];

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    readonly ChevronRight = ChevronRight;
    readonly Home = Home;

    ngOnInit() {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
            });

        // Initial breadcrumb
        this.breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
    }

    private buildBreadcrumbs(
        route: ActivatedRoute,
        url: string = '',
        breadcrumbs: Breadcrumb[] = []
    ): Breadcrumb[] {
        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
            if (routeURL !== '') {
                url += `/${routeURL}`;
            }

            const label = child.snapshot.data['breadcrumb'];
            const customUrl = child.snapshot.data['breadcrumbUrl'];
            
            if (label) {
                breadcrumbs.push({ 
                    label, 
                    url: customUrl || url 
                });
            }

            return this.buildBreadcrumbs(child, url, breadcrumbs);
        }

        return breadcrumbs;
    }
}
