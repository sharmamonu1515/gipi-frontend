import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitigationDirectorsListComponent } from './litigation-directors-list.component';

describe('LitigationDirectorsListComponent', () => {
  let component: LitigationDirectorsListComponent;
  let fixture: ComponentFixture<LitigationDirectorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LitigationDirectorsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LitigationDirectorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
