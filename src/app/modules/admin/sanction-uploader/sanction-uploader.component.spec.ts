import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionUploaderComponent } from './sanction-uploader.component';

describe('SanctionUploaderComponent', () => {
  let component: SanctionUploaderComponent;
  let fixture: ComponentFixture<SanctionUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionUploaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
