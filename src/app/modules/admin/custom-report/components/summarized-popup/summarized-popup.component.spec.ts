import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizedPopupComponent } from './summarized-popup.component';

describe('SummarizedPopupComponent', () => {
  let component: SummarizedPopupComponent;
  let fixture: ComponentFixture<SummarizedPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarizedPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummarizedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
