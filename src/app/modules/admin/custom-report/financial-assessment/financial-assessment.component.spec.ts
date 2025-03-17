import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAssessmentComponent } from './financial-assessment.component';

describe('FinancialAssessmentComponent', () => {
  let component: FinancialAssessmentComponent;
  let fixture: ComponentFixture<FinancialAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialAssessmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
