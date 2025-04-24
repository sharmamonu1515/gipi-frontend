import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FinancialAnalysisData, SummaryData } from 'app/interfaces/ai-summary';
import { ApiResponse } from 'app/interfaces/common';
import { environment } from 'environments/environment';
import { catchError, map, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReportDataService {
    private apiUrl = `${environment.baseURI}/prob/getCompanyDetail`;
    private collectedData: Record<string, any> = {};
    companyData: any;
    companyType: string = 'company';
    company_id: string;

    constructor(private http: HttpClient) {}

    setData(tabName: string, data: any) {
        this.collectedData[tabName] = data;
    }

    getData(tabName: string) {
        return this.collectedData[tabName];
    }

    clearData() {
        this.collectedData = {};
    }

    getCompanyDetail(
        CinOrPan: string,
        searchType: string,
        companyType: string
    ): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/${CinOrPan}?type=${searchType}&companyType=${companyType}`
        );
    }

    setCompanyData(data: any) {
        this.companyData = data;
        this.company_id = data?.data?._id || data?.data?.company_id;
    }

    getCompanyData() {
        return this.companyData;
    }

    getCompanyId() {
        return this.company_id;
    }

    setCompanyType(companyType: string) {
        this.companyType = companyType;
    }

    getCompanyType() {
        return this.companyType;
    }

    getExecutiveSummaryData() {
        const tabName = 'executiveSummary';

        if (this.collectedData[tabName]) {
            return new Observable((observer) => {
                observer.next(this.collectedData[tabName]);
                observer.complete();
            });
        } else {
            return this.http
                .get(
                    `${environment.baseURI}/custom-report/get-executive-summary?companyId=${this.company_id}`
                )
                .pipe(
                    catchError((error) => {
                        console.error(
                            'Error fetching executive summary data',
                            error
                        );
                        return new Observable();
                    }),
                    tap((response: any) => {
                        if (response && response.data) {
                            this.setData(tabName, response.data);
                        }
                    }),
                    map((response: any) => response.data)
                );
        }
    }

    getForensicAssessmentData() {
        const tabName = 'forensicAssessment';

        if (this.collectedData[tabName]) {
            return new Observable((observer) => {
                observer.next(this.collectedData[tabName]);
                observer.complete();
            });
        } else {
            return this.http
                .get(
                    `${environment.baseURI}/custom-report/get-forensic-assessment?companyId=${this.company_id}`
                )
                .pipe(
                    catchError((error) => {
                        console.error(
                            'Error fetching forensic assessment data',
                            error
                        );
                        return new Observable();
                    }),
                    tap((response: any) => {
                        if (response && response.data) {
                            this.setData(tabName, response.data);
                        }
                    }),
                    map((response: any) => response.data)
                );
        }
    }

    summarizeContent(content: string, section: string, model:string): Observable<ApiResponse<SummaryData>> {
        const body = { content, section, model };

        return this.http
            .post<ApiResponse<SummaryData>>(`${environment.baseURI}/ai/summarize`, body);
    }

    generateContent( data: { [year: string]: any }, section: string, model:string,company_id:string): Observable<ApiResponse<FinancialAnalysisData>> {
        const body = { data, section, model,company_id };

        return this.http
            .post<ApiResponse<FinancialAnalysisData>>(`${environment.baseURI}/custom-report/financial-analysis`, body);
    }

    generateCompanyContent(searchTerm: string, section: string, model: string,director:string) {
        const payload = { searchTerm, section, model,director };
        return this.http.post<any>(`${environment.baseURI}/ai/webpilot-search`, payload);
      }
}
