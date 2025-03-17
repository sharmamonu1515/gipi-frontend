import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URI = environment.baseURI;

@Injectable({
  providedIn: 'root'
})
export class GstService {

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

  getGstList(sort: string, order: string, page: number, searchText: string): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-gst-list?sort=${sort}&order=${order}&page=${page + 1}&searchText=${searchText}`;
    return this._httpClient.get<any>(requestUrl, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

  getCheckDateList(): Observable<any> {

    const requestUrl = `${BASE_URI}/user/emp-check-date-list`;
    return this._httpClient.get<any>(requestUrl);

  }

}
