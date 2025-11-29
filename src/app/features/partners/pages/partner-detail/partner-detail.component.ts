import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Partner } from '../../models/partner.model';
import { getPartnerById, deletePartners } from '../../store/partners.actions';
import { selectPartnerById, selectPartnersLoading } from '../../store/partners.selectors';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DetailsPageHeaderComponent } from "../../../../shared/components/details-page-header/details-page-header.component";

@Component({
  selector: 'app-partner-detail',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent, DetailsPageHeaderComponent],
  templateUrl: './partner-detail.component.html',
  styleUrls: ['./partner-detail.component.scss'],
})
export class PartnerDetailComponent implements OnInit {
  partner$: Observable<Partner | undefined>;
  loading$: Observable<boolean>;
  partnerId: string | null = null;
  showDeleteDialog = false;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
    this.loading$ = this.store.select(selectPartnersLoading);
    this.partner$ = new Observable();
  }

  ngOnInit(): void {
    this.partnerId = this.route.snapshot.paramMap.get('id');
    if (this.partnerId) {
      this.store.dispatch(getPartnerById({ id: this.partnerId }));
      this.partner$ = this.store.select(selectPartnerById(this.partnerId));
    }
  }

  onEdit(): void {
    if (this.partnerId) {
      this.router.navigate(['/partners', this.partnerId, 'edit']);
    }
  }

  confirmDelete(): void {
    this.showDeleteDialog = true;
  }

  onDelete(): void {
    if (this.partnerId) {
      this.store.dispatch(deletePartners({ ids: [this.partnerId] }));
      this.showDeleteDialog = false;
      this.router.navigate(['/partners']);
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
  }

  onBack(): void {
    this.router.navigate(['/partners']);
  }
}
