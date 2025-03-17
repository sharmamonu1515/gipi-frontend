import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URI = environment.baseURI;

@Injectable({
  providedIn: 'root'
})
export class ExampleService {

  constructor(private _httpClient: HttpClient) { }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  getSignatoryCaptchaAndCookies(): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-mca-signatory-details-captcha`;
    return this._httpClient.get<any>(requestUrl, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

  getSignatoryDetails(data: any): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-mca-signatory-details`;
    return this._httpClient.post<any>(requestUrl, data);

  }

  getMcaDetails(data: any): Observable<any> {
    const requestUrl = `${BASE_URI}/user/get-mca-details-from-excel`;
    return this._httpClient.post<any>(requestUrl, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

  getMcaList(sort: string, order: string, page: number, searchText: string): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-mca-company-list?sort=${sort}&order=${order}&page=${page + 1}&searchText=${searchText}`;
    return this._httpClient.get<any>(requestUrl, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

  deleteMcaDetails(companyId: any): Observable<any> {

    const requestUrl = `${BASE_URI}/user/delete-mca-details?companyId=${companyId}`;
    return this._httpClient.delete<any>(requestUrl, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

}
