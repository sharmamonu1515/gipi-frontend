import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitigationBiComponent } from './litigation-bi.component';

describe('LitigationBiComponent', () => {
  let component: LitigationBiComponent;
  let fixture: ComponentFixture<LitigationBiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LitigationBiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LitigationBiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
