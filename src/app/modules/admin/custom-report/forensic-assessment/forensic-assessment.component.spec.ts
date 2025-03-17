import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForensicAssessmentComponent } from './forensic-assessment.component';

describe('ForensicAssessmentComponent', () => {
  let component: ForensicAssessmentComponent;
  let fixture: ComponentFixture<ForensicAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForensicAssessmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForensicAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
