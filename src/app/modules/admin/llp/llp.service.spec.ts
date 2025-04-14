import { TestBed } from '@angular/core/testing';
import { LLPService } from './llp.service';

describe('LLPService', () => {
    let service: LLPService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LLPService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});