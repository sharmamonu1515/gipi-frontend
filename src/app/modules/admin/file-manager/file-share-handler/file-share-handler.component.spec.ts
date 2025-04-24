import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileShareHandlerComponent } from './file-share-handler.component';

describe('FileShareHandlerComponent', () => {
  let component: FileShareHandlerComponent;
  let fixture: ComponentFixture<FileShareHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileShareHandlerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileShareHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
