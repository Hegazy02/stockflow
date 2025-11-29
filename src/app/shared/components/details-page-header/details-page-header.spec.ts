import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPageHeader } from './details-page-header';

describe('DetailsPageHeader', () => {
  let component: DetailsPageHeader;
  let fixture: ComponentFixture<DetailsPageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPageHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsPageHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
