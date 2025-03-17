import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URI = environment.baseURI;

@Injectable({
  providedIn: 'root'
})
export class GipiApiService {

  constructor(private _httpClient: HttpClient) { }



  getCheckDateList(): Observable<any> {

    const requestUrl = `${BASE_URI}/user/emp-check-date-list`;
    return this._httpClient.get<any>(requestUrl);

  }
  
  editDateList(data:any): Observable<any> {

    const requestUrl = `${BASE_URI}/user/add-emp-check-date`;
    return this._httpClient.post<any>(requestUrl,data);

  }
  
}
