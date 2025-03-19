import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const BASE_URI = environment.newBaseURI;

@Injectable({
    providedIn: 'root',
})
export class UBOService {
    constructor(private _httpClient: HttpClient) {}

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    getAllEntities(
        page: number,
        limit: number,
        search: string = ''
    ): Observable<any> {
        const requestUrl = `${BASE_URI}/ubo/list?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
        )}`;

        return this._httpClient.get<any>(requestUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    getUBODetails(companyId: string): Observable<any> {
        const requestUrl = `${BASE_URI}/ubo/search`;
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

    getUBOById(id: string): Observable<any> {
        return this._httpClient.get<any>(`${BASE_URI}/ubo/${id}`);
    }
}
