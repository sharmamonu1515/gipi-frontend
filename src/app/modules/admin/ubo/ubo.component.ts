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
import { UBOService } from './ubo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-ubo',
    templateUrl: './ubo.component.html',
    styleUrls: ['./ubo.component.scss'],
})
export class UBOComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = [
        'entityId',
        'entityName',
        'coverage',
        'finYear',
        'totalEquityShares',
        'actions',
    ];
    dataSource = new MatTableDataSource<any>([]);

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoadingResults: boolean = false;
    isRateLimitReached: boolean = false;
    resultsLength: number = 0;
    pageSize: number = 20;

    constructor(
        public dialog: MatDialog,
        private apiService: UBOService
    ) {}

    ngOnInit(): void {
        this.fetchEntityData();

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
            .open(UBODialogComponent, {
                width: '50%',
                enterAnimationDuration,
                exitAnimationDuration,
                disableClose: true,
            })
            .afterClosed()
            .subscribe((result) => {
                window.location.reload();
            });
    }

    fetchEntityData(
        page: number = 1,
        limit: number = 20,
        search: string = ''
    ): void {
        this.isLoadingResults = true;
        this.apiService.getAllEntities(page, limit, search.trim()).subscribe(
            (response) => {
                this.dataSource.data = response.data.companies; // Update table data
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
        this.fetchEntityData(event.pageIndex + 1, event.pageSize);
    }

    applyFilter(filterValue: string): void {
      const trimmedValue = filterValue.trim();
      if (trimmedValue.length > 3) {
          this.fetchEntityData(1, this.pageSize, trimmedValue);
      }
  }
}

// ADD Litigation BI Details By CIN //
@Component({
    selector: 'ubo-dialog',
    templateUrl: './ubo-dialog.component.html',
})
export class UBODialogComponent implements OnInit {
    @ViewChild('UBODialogNGForm') UBODialogNGForm: NgForm;

    formFieldHelpers: string[] = [''];
    UBODialogForm: UntypedFormGroup;

    constructor(
        public dialogRef: MatDialogRef<UBODialogComponent>,
        private _formBuilder: UntypedFormBuilder,
        private apiService: UBOService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        // Create the MCA Details form
        this.UBODialogForm = this._formBuilder.group({
            companyId: ['', [Validators.required]],
        });
    }

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    getUBODetails(): void {
        this.apiService
            .getUBODetails(
                this.UBODialogForm.get('companyId').value
            )
            .subscribe(
                (response) => {
                    this._snackBar.open(response.message, 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-primary'],
                    });
                    this.dialogRef.close(true); // Pass true to indicate data was fetched
                },
                (error) => {
                    this._snackBar.open(error.message, 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-warn'],
                    });
                }
            );
    }
}
