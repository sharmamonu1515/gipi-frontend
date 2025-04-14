import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const BASE_URI = environment.newBaseURI;

@Injectable({
    providedIn: 'root',
})
export class PeerComparisonService {
    constructor(private _httpClient: HttpClient) {}

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    getAllPeerComparisons(
        page: number,
        limit: number,
        search: string = ''
    ): Observable<any> {
        const requestUrl = `${BASE_URI}/peer-comparison/list?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
        )}`;

        return this._httpClient.get<any>(requestUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    getPeerComparisonDetails(cin: string): Observable<any> {
        const requestUrl = `${BASE_URI}/peer-comparison/search`;
        return this._httpClient.post<any>(
            requestUrl,
            {
                id: cin,
            },
            {
                headers: new HttpHeaders({
                    Authorization: 'Bearer ' + this.accessToken,
                }),
            }
        );
    }

    getPeerComparisonById(id: string): Observable<any> {
        return this._httpClient.get<any>(`${BASE_URI}/peer-comparison/${id}`);
    }
}
