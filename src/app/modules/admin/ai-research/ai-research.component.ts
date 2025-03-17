import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { AiResearchService } from './ai-research.service';
import {
    IScrapedContent,
    ISearchResult,
    ISummaryResult,
} from 'app/interfaces/ai-research';
import { SummarizePopupComponent } from './summarize-popup/summarize-popup.component';
import { ScrapedPopupComponent } from './scraped-popup/scraped-popup.component';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-ai-research',
    templateUrl: './ai-research.component.html',
    styleUrls: ['./ai-research.component.scss'],
})
export class AiResearchComponent implements OnInit {
    searchTerm = '';
    previousSearchTerm: string = '';
    keywordsControl = new FormControl([]);
    dateRangeControl = new FormControl('');
    sortControl = new FormControl('relevance');
    isAllSelected = false;
    isCategoryWise = false;
    searching: boolean = false;
    currentPage = 1;
    itemsPerPage = 10;
    summaryResult: ISummaryResult | null = null;
    error: string | null = null;
    summarizedArticles: IScrapedContent[] = [];

    keywords: string[] = [];

    filterOptions = [
        { name: 'All', selected: true },
        { name: 'News', selected: false },
    ];

    searchResults: ISearchResult[] = [];
    totalResults: number = 0;
    isLoading: boolean = false;
    scrapedContents: IScrapedContent[] = [];
    scrapingProgress: number = 0;
    totalUrlsToScrape: number = 0;
    selectedFilter: any;
    selectedResults: [];

    constructor(
        private http: HttpClient,
        private datePipe: DatePipe,
        private summarizerService: AiResearchService,
        private dialog: MatDialog,
        private researchService: AiResearchService,
        private toastr: ToastrService
    ) {}
    ngOnInit() {
        this.fetchKeywords();
    }

    fetchKeywords(): void {
        this.researchService.getKeywords().subscribe({
            next: (response: any) => {
                this.keywords = response.data.map((item: any) => item.value);
            },
            error: (err) => {
                console.error('Error fetching keywords', err);
            },
        });
    }
    openPopup(summaryResult: ISummaryResult): void {
        this.dialog.open(SummarizePopupComponent, {
            disableClose: true,
            width: '100vw',
            height: '100vh',
            data: summaryResult,
        });
    }
    openDetails(selectedResults: any[]): void {
        this.dialog.open(ScrapedPopupComponent, {
            data: selectedResults,
            width: '700px',
            height: '350px',
        });
    }
    onSearchTermChange() {
        this.searching = this.searchTerm.length > 0;
        this.currentPage = 1;
    }
    toggleFilter(filter: any) {
        filter.selected = !filter.selected;
        if (filter.name === 'All') {
            this.filterOptions.forEach((f) => {
                if (f.name !== 'All') f.selected = false;
            });
        } else {
            this.filterOptions.find((f) => f.name === 'All').selected = false;
        }
        this.selectedFilter = this.filterOptions
            .filter((filter) => filter.selected)
            .map((filter) => filter.name.toLowerCase());

        this.search();
    }

    isIndeterminate(): boolean {
        const selected = this.keywordsControl.value || [];
        return selected.length > 0 && selected.length < this.keywords.length;
    }

    toggleAllSelection(): void {
        if (!this.isAllSelected) {
            this.keywordsControl.setValue([...this.keywords], {
                emitEvent: true,
            });
        } else {
            this.keywordsControl.setValue([], { emitEvent: true });
        }
        this.isAllSelected = !this.isAllSelected;
    }
    search(isloadMore = false) {
        if (!this.searchTerm) return;
        const keywords = this.keywordsControl.value;
        const keywordall = keywords.join(',');
        const url = `${environment.baseURI}/ai-research`;
        if (this.searchTerm !== this.previousSearchTerm) {
            this.searchResults = [];
            this.currentPage = 1;
        }
        if (!isloadMore) {
            this.searchResults = [];
            this.currentPage = 1;
        }

        this.http
            .get<any>(
                `${url}?searchTerm=${this.searchTerm}&keywords=${keywordall}&page=${this.currentPage}&itemsPerPage=${this.itemsPerPage}&filter=${this.selectedFilter}`
            )
            .subscribe((response) => {
                if (response.status === 'success') {
                    if (isloadMore) {
                        this.searchResults = this.searchResults.concat(
                            response.data?.result
                        );
                    } else {
                        this.searchResults = response.data?.result;
                    }
                    this.totalResults = response.data?.totalResults;
                    this.isCategoryWise = response?.data?.isCategoryWise;
                    this.previousSearchTerm = this.searchTerm;
                }
            });
    }

    changePage(page: number) {
        this.currentPage = page;
        this.search(true);
    }

    get totalPages(): number {
        return Math.ceil(this.totalResults / this.itemsPerPage);
    }

    changeExpansionPage(page: number, keyword: string) {
        const url = `${environment.baseURI}/ai-research`;

        this.http
            .get<any>(
                `${url}?searchTerm=${this.searchTerm}&page=${page}&keywords=${keyword}`
            )
            .subscribe((response) => {
                if (response.status === 'success') {
                    this.currentPage = page;
                    const categoryData = response.data.result;
                    const categoryIndex = this.searchResults.findIndex(
                        (data) => data.keyword === keyword
                    );
                    if (categoryIndex !== -1) {
                        this.searchResults[categoryIndex].results = [
                            ...this.searchResults[categoryIndex].results,
                            ...categoryData[0].results,
                        ];
                    }
                }
            });
    }

    downloadResults() {
        if (!this.searchResults.length) return;

        const wsData: any[] = [];

        if (this.isCategoryWise) {
            this.searchResults.forEach((category: any) => {
                wsData.push([category.keyword]);

                wsData.push(['Title', 'URL', 'Description']);

                category.results.forEach((result: ISearchResult) => {
                    wsData.push([result.title, result.url, result.description]);
                });
                wsData.push([]);
            });
        } else {
            wsData.push(['Title', 'URL', 'Description']);
            this.searchResults.forEach((result: ISearchResult) => {
                wsData.push([result.title, result.url, result.description]);
            });
        }

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);

        const colWidths = [{ wch: 50 }, { wch: 50 }, { wch: 100 }];
        ws['!cols'] = colWidths;
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Search Results');

        const fileName = `search-results-${
            new Date().toISOString().split('T')[0]
        }.xlsx`;
        XLSX.writeFile(wb, fileName);
    }

    hasSelectedUrls(): boolean {
        if (this.isCategoryWise) {
            return this.searchResults.some((category) =>
                category.results.some(
                    (result: ISearchResult) => result.selected
                )
            );
        }
        return this.searchResults.some((result) => result.selected);
    }

    getSelectedResults(): ISearchResult[] {
        if (this.isCategoryWise) {
            return this.searchResults.flatMap((category) =>
                category.results.filter(
                    (result: ISearchResult) => result.selected
                )
            );
        }
        return this.searchResults.filter((result) => result.selected);
    }

    async scrapeSelectedContent(url: string) {
        // const selectedResults = this.getSelectedResults();
        // if (!selectedResults.length) return;
        let urls = [];
        urls[0] = url;
        this.isLoading = true;
        //this.totalUrlsToScrape = selectedResults.length;
        this.scrapingProgress = 0;

        try {
            //const urls = selectedResults.map(result => result.url);

            const response = await this.http
                .post<any>(`${environment.baseURI}/ai-research/scrape-batch`, {
                    urls,
                })
                .toPromise();

            if (response.status === 'success') {
                if (response.data[0]?.content?.article?.length) {
                    this.selectedResults = response.data;
                    this.openDetails(this.selectedResults);
                } else {
                    this.toastr.warning(
                        'No content available for the selected url!'
                    );
                }
            }
        } catch (error) {
            console.error('Error during scraping:', error);
        } finally {
            this.isLoading = false;
            this.scrapingProgress = 0;
        }
    }

    summarizeArticles(urls: string[], searchQuery: string) {
        this.isLoading = true;
        this.error = null;
        this.summarizerService.summarizeArticles(urls, searchQuery).subscribe({
            next: (result: any) => {
                this.summaryResult = result.data;
                this.openPopup(this.summaryResult);
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to generate summary. Please try again.';
                this.isLoading = false;
                console.error('Error:', err);
            },
        });
    }

    private downloadScrapedContent(results: ISearchResult[]) {
        if (!results.length) return;
        const csvRows = [];
        csvRows.push(
            ['URL', 'Title', 'Description', 'Content']
                .map((header) => `"${header}"`)
                .join(',')
        );
        results.forEach((result) => {
            if (result.scrapedContent) {
                const row = [
                    result.url,
                    result.scrapedContent.title,
                    result.scrapedContent.description,
                    result.scrapedContent.article.join('\n\n'),
                ].map((field) => `"${String(field).replace(/"/g, '""')}"`);
                csvRows.push(row.join(','));
            }
        });

        // Create blob and download
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const fileName = `scraped-content-${
            new Date().toISOString().split('T')[0]
        }.csv`;

        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    async summarizeSelectedUrls() {
        const selectedResults = this.getSelectedResults();
        if (!selectedResults.length) return;

        this.isLoading = true;
        this.totalUrlsToScrape = selectedResults.length;
        this.scrapingProgress = 0;

        try {
            const urls = selectedResults.map((result) => result.url);
            this.summarizeArticles(urls, this.searchTerm);
        } catch (error) {
            console.error('Error during scraping:', error);
        } finally {
            this.isLoading = false;
            this.scrapingProgress = 0;
        }
    }
}
