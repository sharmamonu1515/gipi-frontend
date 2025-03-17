import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizePopupComponent } from './summarize-popup.component';

describe('SummarizePopupComponent', () => {
  let component: SummarizePopupComponent;
  let fixture: ComponentFixture<SummarizePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarizePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummarizePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
