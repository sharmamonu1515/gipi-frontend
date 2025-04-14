import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BasicUdyamService {
    private apiUrl = 'http://127.0.0.1:4000'; // Replace with your actual API URL

    constructor(private http: HttpClient) {}

    // Fetch all Udyam details
    getAllUdyamDetails(page: number, limit: number, search: string = ''): Observable<any> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString())
            .set('search', search);

        return this.http.get<any>(`${this.apiUrl}/basic-udyam-details/list`, { params });
    }

    // Fetch single Udyam detail by entityId
    getUdyamDetailById(entityId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/basic-udyam-details/${entityId}`);
    }

    // Search for Udyam detail by entityId
    searchUdyamDetail(entityId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/basic-udyam-details/search`, { id: entityId });
    }
}