import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerComparisonComponent } from './peer-comparison.component';

describe('PeerComparisonComponent', () => {
  let component: PeerComparisonComponent;
  let fixture: ComponentFixture<PeerComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerComparisonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeerComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
