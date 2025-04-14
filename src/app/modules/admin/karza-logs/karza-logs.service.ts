import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const BASE_URI = environment.newBaseURI;

@Injectable({
    providedIn: 'root',
})
export class KarzaLogsService {
    constructor(private _httpClient: HttpClient) {}

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    getLogs(page: number, limit: number, search: string = ''): Observable<any> {
        const requestUrl = `${BASE_URI}/logs/list?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
        )}`;

        return this._httpClient.get<any>(requestUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }
}
