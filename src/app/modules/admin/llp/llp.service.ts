import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URI = environment.baseURI;

@Injectable({
    providedIn: 'root',
})
export class LLPService {
    constructor(private _httpClient: HttpClient) {}

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    getAllLLPs(page: number, limit: number, search: string = ''): Observable<any> {
        const requestUrl = `${BASE_URI}/financial-summary-llp/list?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
        return this._httpClient.get<any>(requestUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    getLLPDetails(payload: { id: string; financialYear: string[] }): Observable<any> {
        const requestUrl = `${BASE_URI}/financial-summary-llp/search`;
        return this._httpClient.post<any>(
            requestUrl,
            payload,
            {
                headers: new HttpHeaders({
                    Authorization: 'Bearer ' + this.accessToken,
                }),
            }
        );
    }
    getLLPById(id: string): Observable<any> {
        return this._httpClient.get<any>(`${BASE_URI}/financial-summary-llp/${id}`);
    }
}