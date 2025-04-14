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
import { PEPService } from './pep.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pep',
    templateUrl: './pep.component.html',
    styleUrls: ['./pep.component.scss'],
})
export class PEPComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = [
        'name',
        'createdAt',
        'actions',
    ];
    dataSource = new MatTableDataSource<any>([]);

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoadingResults: boolean = false;
    isRateLimitReached: boolean = false;
    resultsLength: number = 0;
    pageSize: number = 20;

    constructor(public dialog: MatDialog, private apiService: PEPService) {}

    ngOnInit(): void {
        this.fetchPEPData();

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
            .open(PEPDialogComponent, {
                width: '50%',
                enterAnimationDuration,
                exitAnimationDuration,
                disableClose: true,
            })
            .afterClosed();
    }

    fetchPEPData(
        page: number = 1,
        limit: number = 20,
        search: string = ''
    ): void {
        this.isLoadingResults = true;
        this.apiService.getAllPEPs(page, limit, search.trim()).subscribe(
            (response) => {
                this.dataSource.data = response.data.peps; // Update table data
                this.resultsLength = response.data.pagination.totalRecords; // Set total records count
                this.isLoadingResults = false;
            },
            (error) => {
                console.error('Error fetching entity data:', error);
                this.isLoadingResults = false;
            }
        );
    }

    onPageChange(event: PageEvent): void {
        this.fetchPEPData(event.pageIndex + 1, event.pageSize);
    }

    applyFilter(filterValue: string): void {
        const trimmedValue = filterValue.trim();
        if (trimmedValue.length > 3 || trimmedValue.length === 0) {
            this.fetchPEPData(1, this.pageSize, trimmedValue);
        }
    }
}

// ADD Litigation BI Details By CIN //
@Component({
    selector: 'pep-dialog',
    templateUrl: './pep-dialog.component.html',
})
export class PEPDialogComponent implements OnInit {
    @ViewChild('PEPDialogNGForm') PEPDialogNGForm: NgForm;

    formFieldHelpers: string[] = [''];
    PEPDialogForm: UntypedFormGroup;

    constructor(
        public dialogRef: MatDialogRef<PEPDialogComponent>,
        private _formBuilder: UntypedFormBuilder,
        private apiService: PEPService,
        private _snackBar: MatSnackBar,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // Create the MCA Details form
        this.PEPDialogForm = this._formBuilder.group({
            name: ['', [Validators.required]],
        });
    }

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    getPEPDetails(): void {
        this.apiService
            .getPEPDetails(this.PEPDialogForm.get('name').value)
            .subscribe({
                next: (response) => {
                    this._snackBar.open(response.message, 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-primary'],
                    });

                    this.router.navigate([
                        '/pep/pep',
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
