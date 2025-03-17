import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URI = environment.baseURI;

@Injectable({
  providedIn: 'root'
})
export class SanctionsService {

  constructor(private _httpClient: HttpClient) { }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  getGstCaptcha(): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-gst-captcha`;
    return this._httpClient.get<any>(requestUrl);

  }

  gstAuth(data: any): Observable<any> {

    const requestUrl = `${BASE_URI}/user/auth-gst`;
    return this._httpClient.post<any>(requestUrl, data);

  }

  submitPan(data: any): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-all-gst-by-pan`;
    return this._httpClient.post<any>(requestUrl, data);

  }

  getSanctionList(sortBy: string, orderBy: string, page: number,pageSize,country,schema, searchText: string): Observable<any> {

    const requestUrl = `http://localhost:8000/api/get-sanctions`;
    page=page+1;
    return this._httpClient.post<any>(requestUrl, {
      sortBy,orderBy,page,pageSize,country,schema,searchText
    });

  }

  getCheckDateList(): Observable<any> {

    const requestUrl = `${BASE_URI}/user/emp-check-date-list`;
    return this._httpClient.get<any>(requestUrl);

  }

}
