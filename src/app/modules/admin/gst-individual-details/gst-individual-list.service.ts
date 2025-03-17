import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URI = environment.baseURI;

@Injectable({
  providedIn: 'root'
})
export class GstIndividualListService {

  constructor(private _httpClient: HttpClient) { }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  getGstDetails(docId: any, gstin: any): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-gst-details?docId=${docId}&gstin=${gstin}`;
    return this._httpClient.get<any>(requestUrl, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }
}
