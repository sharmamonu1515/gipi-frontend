import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstIndividualDetailsComponent } from './gst-individual-details.component';

describe('GstIndividualDetailsComponent', () => {
  let component: GstIndividualDetailsComponent;
  let fixture: ComponentFixture<GstIndividualDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstIndividualDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstIndividualDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
