import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarzaSettingsComponent } from './karza-settings.component';

describe('KarzaSettingsComponent', () => {
  let component: KarzaSettingsComponent;
  let fixture: ComponentFixture<KarzaSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KarzaSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarzaSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
