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
import { MatSort, Sort } from '@angular/material/sort';
import { EntitySearchService } from './entity-search.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-entity-search',
    templateUrl: './entity-search.component.html',
    styleUrls: ['./entity-search.component.scss'],
})
export class EntitySearchComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        'entityId',
        'name',
        'pans',
        'createdAt',
        'status',
        'location',
    ];
    dataSource = new MatTableDataSource<any>([]);

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoadingResults: boolean = false;
    isRateLimitReached: boolean = false;
    resultsLength: number = 0;
    pageSize: number = 20;

    constructor(
        public dialog: MatDialog,
        private apiService: EntitySearchService
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
            .open(EntitySearchDialogComponent, {
                width: '50%',
                enterAnimationDuration,
                exitAnimationDuration,
                disableClose: true,
            })
            .afterClosed();
    }

    fetchEntityData(
        page: number = 1,
        limit: number = 20,
        search: string = '',
    ): void {
        this.isLoadingResults = true;
        this.apiService.getAllEntities(page, limit, search.trim()).subscribe({
            next: (response) => {
                this.dataSource.data = response.data.companies; // Update table data
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
        this.fetchEntityData(event.pageIndex + 1, event.pageSize);
    }

    applyFilter(filterValue: string): void {
      const trimmedValue = filterValue.trim();
      if (trimmedValue.length > 3 || trimmedValue.length === 0) {
          this.fetchEntityData(1, this.pageSize, trimmedValue);
      }
  }
}

// ADD Litigation BI Details By CIN //
@Component({
    selector: 'entity-search-dialog',
    templateUrl: './entity-search-dialog.component.html',
})
export class EntitySearchDialogComponent implements OnInit {
    @ViewChild('entitySearchDialogNGForm') entitySearchDialogNGForm: NgForm;

    formFieldHelpers: string[] = [''];
    entitySearchDialogForm: UntypedFormGroup;

    constructor(
        public dialogRef: MatDialogRef<EntitySearchDialogComponent>,
        private _formBuilder: UntypedFormBuilder,
        private apiService: EntitySearchService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        // Create the MCA Details form
        this.entitySearchDialogForm = this._formBuilder.group({
            companyId: ['', [Validators.required]],
        });
    }

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    getEntitySearchDetails(): void {
        this.apiService
            .getEntitySearchDetails(
                this.entitySearchDialogForm.get('companyId').value
            )
            .subscribe(
                (response) => {
                    this._snackBar.open(response.message, 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-primary'],
                    });
                    this.dialogRef.close(true);

                    window.location.reload();
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
