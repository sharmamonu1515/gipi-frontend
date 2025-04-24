import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseMediaPromptComponent } from './adverse-media-prompt.component';

describe('AdverseMediaPromptComponent', () => {
  let component: AdverseMediaPromptComponent;
  let fixture: ComponentFixture<AdverseMediaPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdverseMediaPromptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdverseMediaPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
