import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const BASE_URI = environment.baseURI;

@Injectable({
    providedIn: 'root',
})
export class SBOService {
    constructor(private _httpClient: HttpClient) {}

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    getAllSBOs(
        page: number,
        limit: number,
        search: string = ''
    ): Observable<any> {
        const requestUrl = `${BASE_URI}/sbo/list?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
        )}`;

        return this._httpClient.get<any>(requestUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    getSBODetails(companyId: string): Observable<any> {
        const requestUrl = `${BASE_URI}/sbo/search`;
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

    getSBOById(id: string): Observable<any> {
        return this._httpClient.get<any>(`${BASE_URI}/sbo/${id}`);
    }
}
