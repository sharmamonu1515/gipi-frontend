import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GipiApiComponent } from './gipi-api.component';

describe('GipiApiComponent', () => {
  let component: GipiApiComponent;
  let fixture: ComponentFixture<GipiApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GipiApiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GipiApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
