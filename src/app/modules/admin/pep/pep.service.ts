import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const BASE_URI = environment.baseURI;

@Injectable({
    providedIn: 'root',
})
export class PEPService {
    constructor(private _httpClient: HttpClient) {}

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    getAllPEPs(
        page: number,
        limit: number,
        search: string = ''
    ): Observable<any> {
        const requestUrl = `${BASE_URI}/pep/list?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
        )}`;

        return this._httpClient.get<any>(requestUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    getPEPDetails(name: string): Observable<any> {
        const requestUrl = `${BASE_URI}/pep/search`;
        return this._httpClient.post<any>(
            requestUrl,
            {
                name: name,
            },
            {
                headers: new HttpHeaders({
                    Authorization: 'Bearer ' + this.accessToken,
                }),
            }
        );
    }

    getPEPById(id: string): Observable<any> {
        return this._httpClient.get<any>(`${BASE_URI}/pep/${id}`);
    }
}
