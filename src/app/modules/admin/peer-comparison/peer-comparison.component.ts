import { Component, OnInit, ViewChild } from '@angular/core';
import {
    NgForm,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PeerComparisonService } from './peer-comparison.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
    selector: 'app-peer-comparison',
    templateUrl: './peer-comparison.component.html',
    styleUrls: ['./peer-comparison.component.scss'],
})
export class PeerComparisonComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['entityId', 'createdAt', 'actions'];
    dataSource = new MatTableDataSource<any>([]);

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoadingResults: boolean = false;
    isRateLimitReached: boolean = false;
    resultsLength: number = 0;
    pageSize: number = 20;

    constructor(
        public dialog: MatDialog,
        private apiService: PeerComparisonService
    ) {}

    ngOnInit(): void {
        this.fetchPeerComparisonData();

        // Apply filtering when search input changes
        this.searchInputControl.valueChanges.subscribe((value) => {
            this.applyFilter(value);
        });
    }

    openSearchDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string
    ): void {
        this.dialog
            .open(PeerComparisonDialogComponent, {
                width: '50%',
                enterAnimationDuration,
                exitAnimationDuration,
                disableClose: true,
            })
            .afterClosed();
    }

    fetchPeerComparisonData(
        page: number = 1,
        limit: number = 20,
        search: string = ''
    ): void {
        this.isLoadingResults = true;
        this.apiService.getAllPeerComparisons(page, limit, search.trim()).subscribe({
            next: (response) => {
                this.dataSource.data = response.data.peerComparisons; // Update table data
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
        this.fetchPeerComparisonData(event.pageIndex + 1, event.pageSize);
    }

    applyFilter(filterValue: string): void {
        const trimmedValue = filterValue.trim();
        if (trimmedValue.length > 3 || trimmedValue.length === 0) {
            this.fetchPeerComparisonData(1, this.pageSize, trimmedValue);
        }
    }
}

// ADD Litigation BI Details By CIN //
@Component({
    selector: 'peer-comparison-dialog',
    templateUrl: './peer-comparison-dialog.component.html',
})
export class PeerComparisonDialogComponent implements OnInit {
    @ViewChild('PeerComparisonDialogNGForm') PeerComparisonDialogNGForm: NgForm;

    formFieldHelpers: string[] = [''];
    PeerComparisonDialogForm: UntypedFormGroup;

    constructor(
        public dialogRef: MatDialogRef<PeerComparisonDialogComponent>,
        private _formBuilder: UntypedFormBuilder,
        private apiService: PeerComparisonService,
        private _snackBar: MatSnackBar,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Create the MCA Details form
        this.PeerComparisonDialogForm = this._formBuilder.group({
            cin: ['', [Validators.required]],
        });
    }

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    getPeerComparisonDetails(): void {
        this.apiService
            .getPeerComparisonDetails(this.PeerComparisonDialogForm.get('cin').value)
            .subscribe({
                next: (response) => {
                    this._snackBar.open(response.message, 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-primary'],
                    });

                    this.router.navigate([
                        '/peer-comparison/peer-comparison',
                        response.data._id,
                    ]);

                    this.dialogRef.close(true); // Pass true to indicate data was fetched
                },
                error: (error) => {
                    this._snackBar.open(error.message, 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-warn'],
                    });
                },
            });
    }
}
