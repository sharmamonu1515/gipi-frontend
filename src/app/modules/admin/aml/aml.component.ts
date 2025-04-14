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
import { AMLService } from './aml.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
    selector: 'app-aml',
    templateUrl: './aml.component.html',
    styleUrls: ['./aml.component.scss'],
})
export class AMLComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['name', 'createdAt', 'actions'];
    dataSource = new MatTableDataSource<any>([]);

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoadingResults: boolean = false;
    isRateLimitReached: boolean = false;
    resultsLength: number = 0;
    pageSize: number = 20;

    constructor(public dialog: MatDialog, private apiService: AMLService) {}

    ngOnInit(): void {
        this.fetchAMLData();

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
            .open(AMLDialogComponent, {
                width: '50%',
                enterAnimationDuration,
                exitAnimationDuration,
                disableClose: true,
            })
            .afterClosed();
    }

    fetchAMLData(
        page: number = 1,
        limit: number = 20,
        search: string = ''
    ): void {
        this.isLoadingResults = true;
        this.apiService.getAllAMLs(page, limit, search.trim()).subscribe({
            next: (response) => {
                this.dataSource.data = response.data.amls; // Update table data
                this.resultsLength = response.data.pagination.totalRecords; // Set total records count
            },
            error: (error) => {
                console.error('Error fetching entity data:', error);
            },
            complete: () => {
                this.isLoadingResults = false;
            }
        });
    }

    onPageChange(event: PageEvent): void {
        this.fetchAMLData(event.pageIndex + 1, event.pageSize);
    }

    applyFilter(filterValue: string): void {
        const trimmedValue = filterValue.trim();
        if (trimmedValue.length > 3 || trimmedValue.length === 0) {
            this.fetchAMLData(1, this.pageSize, trimmedValue);
        }
    }
}

// ADD Litigation BI Details By CIN //
@Component({
    selector: 'aml-dialog',
    templateUrl: './aml-dialog.component.html',
})
export class AMLDialogComponent implements OnInit {
    @ViewChild('AMLDialogNGForm') AMLDialogNGForm: NgForm;

    formFieldHelpers: string[] = [''];
    AMLDialogForm: UntypedFormGroup;

    constructor(
        public dialogRef: MatDialogRef<AMLDialogComponent>,
        private _formBuilder: UntypedFormBuilder,
        private apiService: AMLService,
        private _snackBar: MatSnackBar,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Create the MCA Details form
        this.AMLDialogForm = this._formBuilder.group({
            name: ['', [Validators.required]],
        });
    }

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    getAMLDetails(): void {
        this.apiService
            .getAMLDetails(this.AMLDialogForm.get('name').value)
            .subscribe({
                next: (response) => {
                    this._snackBar.open(response.message, 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-primary'],
                    });

                    this.router.navigate(['/aml/aml', response.data._id]);

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
