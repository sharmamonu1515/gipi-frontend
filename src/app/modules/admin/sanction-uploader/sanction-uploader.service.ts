import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URI = environment.baseURI;
const open_Sanction_Url = "https://api.opensanctions.org/";

@Injectable({
  providedIn: 'root'
})
export class SanctionUploaderService {

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
  uploadExcel(file: File): Observable<HttpEvent<any>> {
    const requestUrl = `http://localhost:8000/api/import`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
  
    const uploadReq = new HttpRequest('POST', requestUrl, formData, {
      reportProgress: true
    });
  
    return this._httpClient.request(uploadReq);
  }

  fetchLogs(page,pageSize):  Observable<any> {
    const requestUrl = `http://localhost:8000/api/get-logs`;
    return this._httpClient.post<any>(requestUrl,{page,pageSize});
    
  }

  saveLogs(fileName,totalItems):  Observable<any> {
    const requestUrl = `http://localhost:8000/api/save-log`;
    return this._httpClient.post<any>(requestUrl,{fileName,totalItems});
    
  }
}
