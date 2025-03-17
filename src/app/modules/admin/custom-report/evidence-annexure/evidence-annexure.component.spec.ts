import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceAnnexureComponent } from './evidence-annexure.component';

describe('EvidenceAnnexureComponent', () => {
  let component: EvidenceAnnexureComponent;
  let fixture: ComponentFixture<EvidenceAnnexureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenceAnnexureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenceAnnexureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
