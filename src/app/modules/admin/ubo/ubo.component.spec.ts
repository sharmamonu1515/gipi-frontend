import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UBOComponent } from './ubo.component';

describe('UBOComponent', () => {
  let component: UBOComponent;
  let fixture: ComponentFixture<UBOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UBOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UBOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
