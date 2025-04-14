import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarzaLogsComponent } from './karza-logs.component';

describe('KarzaLogsComponent', () => {
  let component: KarzaLogsComponent;
  let fixture: ComponentFixture<KarzaLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KarzaLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarzaLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
