import { Component, OnInit, ViewChild } from '@angular/core';
import { KarzaLogsService } from './karza-logs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';

@Component({
    selector: 'app-karza-logs',
    templateUrl: './karza-logs.component.html',
    styleUrls: ['./karza-logs.component.scss'],
})
export class KarzaLogsComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = [
        'userId',
        'apiType',
        'responseTime',
        'dateTime',
        'mode'
    ];

    dataSource = new MatTableDataSource<any>([]);

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoadingResults: boolean = false;
    resultsLength: number = 0;
    pageSize: number = 20;

    constructor(
        private apiService: KarzaLogsService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.fetchLogs(); // Load saved settings on component init

        // Apply filtering when search input changes
        this.searchInputControl.valueChanges.subscribe((value) => {
            this.applyFilter(value);
        });
    }

    fetchLogs(page: number = 1, limit: number = 20, search: string = ''): void {
        this.isLoadingResults = true;
        this.apiService.getLogs(page, limit, search.trim()).subscribe({
            next: (response) => {
                this.dataSource.data = response.data.logs; // Update table data
                this.resultsLength = response.data.pagination.totalRecords; // Set total records count
            },
            error: (error) => {
                console.error('Error fetching entity data:', error);
            },
            complete: () => {
                this.isLoadingResults = false;
            },
        });
    }

    onPageChange(event: PageEvent): void {
        this.fetchLogs(event.pageIndex + 1, event.pageSize);
    }

    applyFilter(filterValue: string): void {
        const trimmedValue = filterValue.trim();
        if (trimmedValue.length > 3 || trimmedValue.length === 0) {
            this.fetchLogs(1, this.pageSize, trimmedValue);
        }
    }
}
