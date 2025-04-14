import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BasicUdyamService } from './basic-udyam.service';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasicUdyamDialogComponent } from './basic-udyam-dialog.component';

@Component({
    selector: 'app-basic-udyam',
    templateUrl: './basic-udyam.component.html',
    styleUrls: ['./basic-udyam.component.scss'],
})
export class BasicUdyamComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['entityId', 'name', 'actions'];
    dataSource = new MatTableDataSource<any>([]);

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoadingResults: boolean = false;
    isRateLimitReached: boolean = false;
    resultsLength: number = 0;
    pageSize: number = 20;

    constructor(
        private apiService: BasicUdyamService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.fetchUdyamData();

        this.searchInputControl.valueChanges.subscribe((value) => {
            this.applyFilter(value);
        });
    }

    fetchUdyamData(
        page: number = 1,
        limit: number = 20,
        search: string = ''
    ): void {
        this.isLoadingResults = true;
        this.apiService
            .getAllUdyamDetails(page, limit, search.trim())
            .subscribe({
                next: (response) => {
                    this.dataSource.data = response.data.udyamDetails;
                    this.resultsLength = response.data.pagination.totalRecords;
                },
                error: (error) => {
                    console.error('Error fetching Udyam data:', error);
                    this._snackBar.open(
                        'Failed to fetch Udyam data. Please try again.',
                        'Close',
                        {
                            duration: 5000,
                            panelClass: ['error-snackbar'],
                        }
                    );
                },
                complete: () => {
                    this.isLoadingResults = false;
                },
            });
    }

    onPageChange(event: PageEvent): void {
        this.fetchUdyamData(event.pageIndex + 1, event.pageSize);
    }

    applyFilter(filterValue: string): void {
        const trimmedValue = filterValue.trim();
        if (trimmedValue.length > 3 || trimmedValue.length === 0) {
            this.fetchUdyamData(1, this.pageSize, trimmedValue);
        }
    }

    openDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string
    ): void {
        const dialogRef = this.dialog.open(BasicUdyamDialogComponent, {
            width: '50%',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.fetchUdyamData(); // Refresh the list if needed
            }
        });
    }
}
