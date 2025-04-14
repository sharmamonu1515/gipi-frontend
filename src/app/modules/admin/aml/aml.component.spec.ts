import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AMLComponent } from './aml.component';

describe('AMLComponent', () => {
  let component: AMLComponent;
  let fixture: ComponentFixture<AMLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AMLComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AMLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
