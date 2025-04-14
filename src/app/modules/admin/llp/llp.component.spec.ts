import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LLPComponent } from './llp.component';

describe('LLPComponent', () => {
    let component: LLPComponent;
    let fixture: ComponentFixture<LLPComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LLPComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LLPComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});