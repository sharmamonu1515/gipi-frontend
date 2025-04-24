import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchSettingComponent } from './research-setting.component';

describe('ResearchSettingComponent', () => {
  let component: ResearchSettingComponent;
  let fixture: ComponentFixture<ResearchSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearchSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
