import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PromptData } from 'app/interfaces/ai-summary';
import { ApiResponse } from 'app/interfaces/common';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PromptService {
    private unitSubject = new BehaviorSubject<string>('gemini');
    unit$ = this.unitSubject.asObservable();
    constructor(private http: HttpClient) {}

    savePrompt(
        section: string,
        prompt: string,
        temperature:number,
        maxOutputTokens:number,
        topP:number,
        topK:number,

    ): Observable<ApiResponse<string>> {
        const body = { prompt, section, temperature, maxOutputTokens,topP,topK};

        return this.http.post<ApiResponse<string>>(
            `${environment.baseURI}/prompt`,
            body
        );
    }

    getPrompt(fieldKey: string): Observable<ApiResponse<PromptData>> {
        return this.http.get<ApiResponse<PromptData>>(
            `${environment.baseURI}/prompt?section=${fieldKey}`
        );
    }

    setModel(unit: string) {
        this.unitSubject.next(unit);
    }

    getCurrentModel(): string {
        return this.unitSubject.value;
      }
}
