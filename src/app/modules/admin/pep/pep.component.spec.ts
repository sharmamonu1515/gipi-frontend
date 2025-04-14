import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PEPComponent } from './pep.component';

describe('PEPComponent', () => {
  let component: PEPComponent;
  let fixture: ComponentFixture<PEPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PEPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PEPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
