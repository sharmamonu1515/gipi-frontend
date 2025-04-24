import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseMediaComponent } from './adverse-media.component';

describe('AdverseMediaComponent', () => {
  let component: AdverseMediaComponent;
  let fixture: ComponentFixture<AdverseMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdverseMediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdverseMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
