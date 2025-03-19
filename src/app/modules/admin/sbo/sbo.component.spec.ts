import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SBOComponent } from './sbo.component';

describe('SBOComponent', () => {
  let component: SBOComponent;
  let fixture: ComponentFixture<SBOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SBOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SBOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
