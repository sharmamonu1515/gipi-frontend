import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const BASE_URI = environment.baseURI;

@Injectable({
    providedIn: 'root',
})
export class KarzaSettingsService {
    constructor(private _httpClient: HttpClient) {}

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    saveSettings(data: any): Observable<any> {
        const requestUrl = `${BASE_URI}/karza-settings/save`;
        return this._httpClient.post<any>(requestUrl, data, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    getSettings(): Observable<any> {
        return this._httpClient.get<any>(`${BASE_URI}/karza-settings`);
    }
}
