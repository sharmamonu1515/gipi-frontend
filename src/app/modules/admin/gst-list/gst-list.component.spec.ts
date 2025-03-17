import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstListComponent } from './gst-list.component';

describe('GstListComponent', () => {
  let component: GstListComponent;
  let fixture: ComponentFixture<GstListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
