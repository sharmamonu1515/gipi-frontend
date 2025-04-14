import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URI = environment.newBaseURI;

@Injectable({
    providedIn: 'root',
})
export class LitigationBiService {
    constructor(private _httpClient: HttpClient) {}

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    searchByNameOrId(query: string): Observable<any> {
        return this._httpClient.post(`${BASE_URI}/entity/searchByNameOrId`, { name: query });
    }

    // Get Litigation BI List
    getLitigationBiList(sort: string, order: string, page: number, limit: number, searchText: string): Observable<any> {
        const requestUrl = `${BASE_URI}/litigation-bi/list?page=${page}&limit=${limit}&search=${encodeURIComponent(searchText)}&sort=${sort}&order=${order}`;

        return this._httpClient.get<any>(requestUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    // Get Litigation BI Details by Id
    getLitigationBiById(id: string): Observable<any> {
        return this._httpClient.get<any>(`${BASE_URI}/litigation-bi/${id}`);
    }

    // Add Litigation BI Details
    getLitigationBiDetails(data: any): Observable<any> {
        const requestUrl = `${BASE_URI}/litigation-bi/search`;
        return this._httpClient.post<any>(requestUrl, data, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    // Get directors list
    getLitigationBiDirectors(data: any): Observable<any> {
        const requestUrl = `${BASE_URI}/litigation-bi/directors`;
        return this._httpClient.post<any>(requestUrl, data, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    // Add Litigation BI Director Details
    getLitigationBiDirectorDetails(data: any): Observable<any> {
        const requestUrl = `${BASE_URI}/litigation-bi/director/search`;
        return this._httpClient.post<any>(requestUrl, data, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.accessToken,
            }),
        });
    }

    exportExcel(id: string, fileType: 'lite' | 'advanced', entityType: 'company' | 'director', filters: any = {}): Observable<any> {
        const requestUrl = `${BASE_URI}/litigation-bi/export/excel`;
        return this._httpClient.post<any>(
            requestUrl,
            {
                id,
                fileType,
                entityType,
                filters,
            },
            {
                headers: new HttpHeaders({
                    Authorization: 'Bearer ' + this.accessToken,
                }),
            }
        );
    }
}
