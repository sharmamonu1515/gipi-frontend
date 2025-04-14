import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitigationBiDetailComponent } from './litigation-bi-detail.component';

describe('LitigationBiDetailComponent', () => {
  let component: LitigationBiDetailComponent;
  let fixture: ComponentFixture<LitigationBiDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LitigationBiDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LitigationBiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
