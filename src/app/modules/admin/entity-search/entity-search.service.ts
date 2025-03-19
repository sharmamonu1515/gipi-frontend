import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const BASE_URI = environment.newBaseURI;

@Injectable({
    providedIn: 'root',
})
export class EntitySearchService {
    constructor(private _httpClient: HttpClient) {}

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    getAllEntities(
        page: number,
        limit: number,
        search: string = ''
    ): Observable<any> {
        const requestUrl = `${BASE_URI}/entity/list?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
        )}`;

        return this._httpClient.get<any>(requestUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    getEntitySearchDetails(companyId: string): Observable<any> {
        const requestUrl = `${BASE_URI}/entity/search`;
        return this._httpClient.post<any>(
            requestUrl,
            {
                id: companyId,
            },
            {
                headers: new HttpHeaders({
                    Authorization: 'Bearer ' + this.accessToken,
                }),
            }
        );
    }
}
