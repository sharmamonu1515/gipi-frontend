import { Component, OnInit } from '@angular/core';
import { GstAddDataComponent } from '../../gst/gst.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { ReportPopupComponent } from '../components/report-popup/report-popup.component';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
  searchInputControl = new FormControl('');
  isLoadingResults: any;
  resultsLength: any;
  displayedColumns: string[] = ['createdAt', 'panNumber', 'mandateName', 'action'];
  pageSize = 30;
  currentPage = 1;
  originalData: any[] = [];
  data: any[] = [];  

  constructor(
      public dialog: MatDialog,
      private http: HttpClient,
      private toastr: ToastrService,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchCompanyLogs();
    this.setupSearchListener();
  }

  fetchCompanyLogs(): void {
    this.isLoadingResults = true;

    this.http.get(`${environment.baseURI}/custom-report?page=${this.currentPage}&limit=${this.pageSize}`).subscribe({
      next: (response: any) => {
        this.originalData = response?.data?.logs || [];
        this.data = [...this.originalData];
        this.resultsLength = response?.data?.pagination?.total || 0;
        this.isLoadingResults = false;
      },
      error: (error) => {
        this.toastr.error('Failed to fetch reports', 'Error');
        console.error('API Error:', error);
        this.isLoadingResults = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; 
    this.pageSize = event.pageSize;
    this.fetchCompanyLogs();
  }

  openDialog(): void {
    this.dialog.open(ReportPopupComponent, {
      width: '550px',
      disableClose: true
    }).afterClosed().subscribe((result) => {
      if(result){
        this.fetchCompanyLogs();
      }
    })
  }

  viewReport(row: any): void {
    const queryParams = {
        cinOrPan: row?.cinOrPan,
        searchType: row?.search_type, 
        companyType: row?.company_type
    };

    this.router.navigate(['/custom-report/view'], { queryParams });
  } 
  setupSearchListener(): void {
    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((searchValue: string) => {
        const lowerSearch = searchValue.toLowerCase().trim();
  
        if (!lowerSearch) {
          this.data = [...this.originalData];
          return;
        }
  
        this.data = this.originalData.filter((item: any) =>
          (item?.cinOrPan?.toLowerCase()?.includes(lowerSearch) ||
           item?.company_name?.toLowerCase()?.includes(lowerSearch))
        );
      });
  }
  
  
}
