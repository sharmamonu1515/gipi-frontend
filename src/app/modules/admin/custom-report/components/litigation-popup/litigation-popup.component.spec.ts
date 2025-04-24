import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitigationPopupComponent } from './litigation-popup.component';

describe('LitigationPopupComponent', () => {
  let component: LitigationPopupComponent;
  let fixture: ComponentFixture<LitigationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LitigationPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LitigationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
