import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptSettingComponent } from './prompt-setting.component';

describe('PromptSettingComponent', () => {
  let component: PromptSettingComponent;
  let fixture: ComponentFixture<PromptSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromptSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
