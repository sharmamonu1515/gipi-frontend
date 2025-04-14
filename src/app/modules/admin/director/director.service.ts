import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const BASE_URI = environment.newBaseURI;

@Injectable({
    providedIn: 'root',
})
export class DirectorService {
    constructor(private _httpClient: HttpClient) {}

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    getAllDirectors(
        page: number,
        limit: number,
        search: string = ''
    ): Observable<any> {
        const requestUrl = `${BASE_URI}/director-details/list?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search
        )}`;

        return this._httpClient.get<any>(requestUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    getDirectorDetails(id: string): Observable<any> {
        const requestUrl = `${BASE_URI}/director-details/search`;
        return this._httpClient.post<any>(
            requestUrl,
            {
                id: id,
            },
            {
                headers: new HttpHeaders({
                    Authorization: 'Bearer ' + this.accessToken,
                }),
            }
        );
    }

    getDirectorById(id: string): Observable<any> {
        return this._httpClient.get<any>(`${BASE_URI}/director-details/${id}`);
    }
}
