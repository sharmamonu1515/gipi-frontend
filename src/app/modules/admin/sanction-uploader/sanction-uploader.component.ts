import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { SanctionUploaderService } from './sanction-uploader.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';

interface FileLog {
    fileName: string;
    date: Date;
    length: number;
}

@Component({
    selector: 'app-sanction-uploader',
    templateUrl: './sanction-uploader.component.html',
    styleUrls: ['./sanction-uploader.component.scss'],
    providers: [DatePipe],
})
export class SanctionUploaderComponent implements OnInit, OnDestroy {
    @ViewChild('fileInput') fileInput: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    uploadProgress = 0;
    constructor(
        public dialog: MatDialog,
        private apiService: SanctionUploaderService,
        private router: Router,
        private toaster: ToastrService,
        private cdr: ChangeDetectorRef
    ) {}
    data: MatTableDataSource<FileLog> = new MatTableDataSource<FileLog>();
    fileLogs: FileLog[] = [];
    displayedColumns: string[] = ['fileName', 'date', 'length'];
    resultsLength = 0;
    pageSize = 10;
    isLoadingResults = false;
    isRateLimitReached = false;
    isLoading = false;
    isUploading=true;
    currentUploadTask = 'Uploading File......';
    processedItems = 0;
    totalItems = 0;
    excelTotalItems = 0;
    eventSource: EventSource;

    ngOnInit() {
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
        this.apiService.fetchLogs(1, 30).subscribe((res) => {
            this.isLoadingResults = false;
            this.isRateLimitReached = res.data === null;

            if (res.data === null) {
                return [];
            }

            this.resultsLength = res.pagination.totalItems;
            this.data = res.data;
        });
    }

    ngOnDestroy() {
        if (this.eventSource) {
            this.eventSource.close();
        }
    }

    onFileSelected(event: any): void {
        this.isLoading = true;
        this.uploadProgress = 0;

        const fileInput = event.target;
        if (!fileInput.files || fileInput.files.length === 0) {
            this.toaster.error('No file selected');
            this.isLoading = false;
            return;
        }

        const file: File = fileInput.files[0];

        // File reading progress simulation
        const reader = new FileReader();
        let readingProgress = 0;

        const updateProgress = () => {
            if (this.isUploading) {
                readingProgress += 1;
                this.uploadProgress = readingProgress;
                this.cdr.detectChanges(); // Update the view
                
                if (readingProgress < 100) {
                    setTimeout(updateProgress, 1000);
                }
            }
        };
        updateProgress();
        reader.onload = (e: any) => {
     
            this.apiService.uploadExcel(file).subscribe(
                (event: HttpEvent<any>) => {
                    this.uploadProgress=0;
                    switch (event.type) {
                        case HttpEventType.UploadProgress:
                           
                            this.getEvents(file.name);
                            
                            break;
                        case HttpEventType.Response:
                            this.toaster.success(event.body.message);
                           
                                this.apiService
                                .fetchLogs(1, 30)
                                .subscribe((res) => {
                                    this.data = res.data;
                                    this.isLoading = false;
                                    this.isLoadingResults=false;
                                });
                            break;
                    }
                },
                (error) => {
                    this.isLoading = false;
                    this.toaster.error(error.error.message);
                }
            );
        };

        reader.onerror = (error) => {
            console.error('FileReader error: ', error);
            this.toaster.error('Error reading file');
            this.isLoading = false;
        };

        reader.readAsArrayBuffer(file);
    }

    // checkProgress(): void {
    //   setInterval(() => {
    //     this.apiService.getProcessPercentage().subscribe(response => {
    //       this.uploadProgress = response.percentage;
    //       console.log(`Progress: ${this.uploadProgress}%`);
    //     });
    //   }, 3000); // Poll every 3 seconds
    // }
    getEvents(fileName) {
        this.uploadProgress=0;
        this.cdr.detectChanges();
        this.eventSource = new EventSource('http://localhost:8000/api/events');
        this.eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.processed) {
                this.isUploading=false;
                this.currentUploadTask = 'Processing File...';
}
            this.uploadProgress =
                Math.round((data.processed / data.totalItems) * 100) >
                this.uploadProgress
                    ? Math.round((data.processed / data.totalItems) * 100)
                    : this.uploadProgress;
            this.cdr.detectChanges();
            if (data.processed==data.totalItems) {
      
                        this.isLoading=false
                        this.apiService
                        .saveLogs(fileName, data.totalItems)
                        .subscribe((res) => {
                            this.eventSource.close();
                            return ;
                        })

                    
                    
               
            }
            console.log(data);
        };
        return 0;
    }
}
