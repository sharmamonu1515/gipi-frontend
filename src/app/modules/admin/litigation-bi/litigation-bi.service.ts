import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URI = environment.baseURI;

@Injectable({
  providedIn: 'root'
})
export class LitigationBiService {

  constructor(private _httpClient: HttpClient) { }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  // Get Litigation BI List
  getLitigationBiList(sort: string, order: string, page: number, searchText: string): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get/litigation-bi/list?sort=${sort}&order=${order}&page=${page + 1}&searchText=${searchText}`;
    return this._httpClient.get<any>(requestUrl, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

  // Add Litigation BI Details
  submitLitigationBiDetails(data: any): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-litigation-bi/details`;
    return this._httpClient.post<any>(requestUrl, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

  // Download Advance Litigation BI File
  downloadAdvanceExcelLitigationFile(data: any): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-litigation-bi/save/advance-excel-file`;
    return this._httpClient.post<any>(requestUrl, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

  // Download Lite Litigation BI File
  downloadLiteExcelLitigationFile(data: any): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-litigation-bi/save/lite-excel-file`;
    return this._httpClient.post<any>(requestUrl, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

}
