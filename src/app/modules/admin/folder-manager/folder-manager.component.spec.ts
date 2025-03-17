import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderManagerComponent } from './folder-manager.component';

describe('FolderManagerComponent', () => {
  let component: FolderManagerComponent;
  let fixture: ComponentFixture<FolderManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
