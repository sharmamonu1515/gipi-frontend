import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URI = environment.baseURI;

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private _httpClient: HttpClient) { }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  getGipiUserList(sort: string, order: string, page: number): Observable<any> {

    const requestUrl = `${BASE_URI}/user/get-user-list?sort=${sort}&order=${order}&page=${
      page + 1
    }`;
    return this._httpClient.get<any>(requestUrl, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

  updateGipiUserStatus(checked: boolean, userId: string): Observable<any> {

    const requestUrl = `${BASE_URI}/user/update-user-status?checked=${checked}&userId=${userId}`;
    return this._httpClient.get<any>(requestUrl, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
      })
    });

  }

}
