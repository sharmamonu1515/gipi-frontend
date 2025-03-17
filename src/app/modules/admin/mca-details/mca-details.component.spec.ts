import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McaDetailsComponent } from './mca-details.component';

describe('McaDetailsComponent', () => {
  let component: McaDetailsComponent;
  let fixture: ComponentFixture<McaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McaDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
