import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapedPopupComponent } from './scraped-popup.component';

describe('ScrapedPopupComponent', () => {
  let component: ScrapedPopupComponent;
  let fixture: ComponentFixture<ScrapedPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrapedPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrapedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
