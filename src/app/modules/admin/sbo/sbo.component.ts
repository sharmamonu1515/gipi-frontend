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
import { SBOService } from './sbo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sbo',
    templateUrl: './sbo.component.html',
    styleUrls: ['./sbo.component.scss'],
})
export class SBOComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = [
        'entityId',
        'companyName',
        'lastDownloaded',
        'actions',
    ];
    dataSource = new MatTableDataSource<any>([]);

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoadingResults: boolean = false;
    isRateLimitReached: boolean = false;
    resultsLength: number = 0;
    pageSize: number = 20;

    constructor(public dialog: MatDialog, private apiService: SBOService) {}

    ngOnInit(): void {
        this.fetchSBOData();

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
            .open(SBODialogComponent, {
                width: '50%',
                enterAnimationDuration,
                exitAnimationDuration,
                disableClose: true,
            })
            .afterClosed();
    }

    fetchSBOData(
        page: number = 1,
        limit: number = 20,
        search: string = ''
    ): void {
        this.isLoadingResults = true;
        this.apiService.getAllSBOs(page, limit, search.trim()).subscribe(
            (response) => {
                this.dataSource.data = response.data.sbos; // Update table data
                this.resultsLength = response.data.pagination.totalRecords; // Set total records count
                this.isLoadingResults = false;
            },
            (error) => {
                console.error('Error fetching SBO data:', error);
                this.isLoadingResults = false;
            }
        );
    }

    onPageChange(event: PageEvent): void {
        this.fetchSBOData(event.pageIndex + 1, event.pageSize);
    }

    applyFilter(filterValue: string): void {
        const trimmedValue = filterValue.trim();
        if (trimmedValue.length > 3 || trimmedValue.length === 0) {
            this.fetchSBOData(1, this.pageSize, trimmedValue);
        }
    }
}

// ADD Litigation BI Details By CIN //
@Component({
    selector: 'sbo-dialog',
    templateUrl: './sbo-dialog.component.html',
})
export class SBODialogComponent implements OnInit {
    @ViewChild('SBODialogNGForm') SBODialogNGForm: NgForm;

    formFieldHelpers: string[] = [''];
    SBODialogForm: UntypedFormGroup;

    constructor(
        public dialogRef: MatDialogRef<SBODialogComponent>,
        private _formBuilder: UntypedFormBuilder,
        private apiService: SBOService,
        private _snackBar: MatSnackBar,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // Create the MCA Details form
        this.SBODialogForm = this._formBuilder.group({
            companyId: ['', [Validators.required]],
        });
    }

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    getSBODetails(): void {
        this.apiService
            .getSBODetails(this.SBODialogForm.get('companyId').value)
            .subscribe({
                next: (response) => {
                    this._snackBar.open(response.message, 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-primary'],
                    });

                    this.router.navigate([
                        '/sbo/sbo',
                        response.data.entityId,
                    ]);

                    this.dialogRef.close(true);
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
