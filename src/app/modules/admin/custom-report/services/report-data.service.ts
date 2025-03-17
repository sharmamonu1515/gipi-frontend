import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  private apiUrl = `${environment.baseURI}/prob/getCompanyDetail`;
  private collectedData: Record<string, any> = {};
  companyData: any;

  constructor(
    private http: HttpClient,
  ) { }

  setData(tabName: string, data: any) {
    this.collectedData[tabName] = data;
  }

  getData(tabName: string){
    return this.collectedData[tabName];
  }

  clearData() {
    this.collectedData = {};
  }

  getCompanyDetail(CinOrPan: string,type : string ): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${CinOrPan}?type=${type}`);
  }

  setCompanyData(data: any) {
    this.companyData = data;
  }

  getCompanyData() {
    return this.companyData;
  }
}
