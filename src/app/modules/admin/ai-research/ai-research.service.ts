import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ISummaryResult } from 'app/interfaces/ai-research';
import { environment } from 'environments/environment';

export interface Article {
  title: string;
  description: string;
  article: string;
  url?: string;
}

@Injectable({
    providedIn: 'root'
  })
  export class AiResearchService {
    constructor(private http: HttpClient) {}
  
    summarizeArticles(urls: string[], searchQuery: string): Observable<ISummaryResult> {
        const body = { urls, searchQuery };
    
        return this.http.post<ISummaryResult>(`${environment.baseURI}/ai-research/summarize`, body).pipe(
          map(response => {
            return response;
          })
        );
      }

    getKeywords(): Observable<any> {
      return this.http.get<any>(`${environment.baseURI}/search-keyword`);
    }
  
    getNewsSiteUrls(): Observable<any> {
      return this.http.get<any>(`${environment.baseURI}/news-links`); 
    }

    addKeyword(keyword: string): Observable<any> {
      return this.http.post<any>(`${environment.baseURI}/search-keyword`, { value : keyword });
    }
    updateKeyword(id: string, value: string ): Observable<any> {
      return this.http.put<any>(`${environment.baseURI}/search-keyword/${id}`, {value});
    }

    addUrl(url: string, name:string): Observable<any> {
      return this.http.post<any>(`${environment.baseURI}/news-links`, { url, name });
    }
    updateUrlLabel(id: string, url: string, name: string ): Observable<any> {
      return this.http.put<any>(`${environment.baseURI}/news-links/${id}`, {name,url})
    }

    deleteUrl(id: string) {
      return this.http.delete<any>(`${environment.baseURI}/news-links/${id}`);
    }

    deleteKeyword(id: string){
      return this.http.delete<any>(`${environment.baseURI}/search-keyword/${id}`);
    }

  }
  