import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UboDetailComponent } from './aml-detail.component';

describe('UboDetailComponent', () => {
  let component: UboDetailComponent;
  let fixture: ComponentFixture<UboDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UboDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UboDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
