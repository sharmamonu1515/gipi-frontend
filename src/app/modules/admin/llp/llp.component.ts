import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LLPService } from './llp.service';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-llp',
    templateUrl: './llp.component.html',
    styleUrls: ['./llp.component.scss']
})
export class LLPComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['entityId', 'companyName', 'lastDownloaded', 'actions'];
    dataSource = new MatTableDataSource<any>([]);

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoadingResults: boolean = false;
    isRateLimitReached: boolean = false;
    resultsLength: number = 0;
    pageSize: number = 20;

    constructor(
        private apiService: LLPService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.fetchLLPData();

        this.searchInputControl.valueChanges.subscribe((value) => {
            this.applyFilter(value);
        });
    }

    fetchLLPData(page: number = 1, limit: number = 20, search: string = ''): void {
        this.isLoadingResults = true;
        this.apiService.getAllLLPs(page, limit, search.trim()).subscribe(
            (response) => {
                this.dataSource.data = response.data.financialSummaries;
                this.resultsLength = response.data.pagination.totalRecords;
                this.isLoadingResults = false;
            },
            (error) => {
                console.error('Error fetching LLP data:', error);
                this.isLoadingResults = false;
            }
        );
    }

    onPageChange(event: PageEvent): void {
        this.fetchLLPData(event.pageIndex + 1, event.pageSize);
    }

    applyFilter(filterValue: string): void {
        const trimmedValue = filterValue.trim();
        if (trimmedValue.length > 3 || trimmedValue.length === 0) {
            this.fetchLLPData(1, this.pageSize, trimmedValue);
        }
    }

    openSearchDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
        this.dialog
            .open(LLPDialogComponent, {
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
}

// Add LLPDialogComponent
@Component({
    selector: 'llp-dialog',
    templateUrl: './llp-dialog.component.html',
})
export class LLPDialogComponent implements OnInit {
    @ViewChild('LLPDialogNGForm') LLPDialogNGForm: NgForm;

    formFieldHelpers: string[] = [''];
    LLPDialogForm: UntypedFormGroup;
    financialYears: string[] = this.generateFinancialYears(); // Generate last 10 financial years

    constructor(
        public dialogRef: MatDialogRef<LLPDialogComponent>,
        private _formBuilder: UntypedFormBuilder,
        private apiService: LLPService,
        private _snackBar: MatSnackBar,
        private router: Router // Inject Router for navigation
    ) {}

    ngOnInit(): void {
        this.LLPDialogForm = this._formBuilder.group({
            entityId: ['', [Validators.required]], // Entity ID is required
            financialYears: [[], [Validators.required]] // At least one financial year must be selected
        });
    }

    // Generate the last 10 financial years
    generateFinancialYears(): string[] {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 10; i++) {
            const startYear = currentYear - i - 1; // Starting year of the financial year
            const endYear = (currentYear - i).toString().slice(-2); // Last two digits of the ending year
            const financialYear = `${startYear}-${endYear}`; // Format: YYYY-YY
            years.push(financialYear);
        }
        return years;
    }

    getLLPDetails(): void {
        if (this.LLPDialogForm.invalid) {
            return;
        }
    
        const entityId = this.LLPDialogForm.get('entityId').value;
        const financialYears = this.LLPDialogForm.get('financialYears').value;
    
        // Prepare the payload for the API
        const payload = {
            id: entityId,
            financialYear: financialYears,
        };
    
        // Call the API to search for the LLP
        this.apiService.getLLPDetails(payload).subscribe({
            next: (response) => {
                if (response.data) {
                    this.router.navigate([`/llp/${entityId}`]);
                    this.dialogRef.close(true); // Close the dialog
                } else {
                    this._snackBar.open('No LLP found with the provided details.', 'Close', {
                        duration: 5000,
                        panelClass: ['error-snackbar'],
                    });
                }
            },
            error: (error) => {
                console.error('API Error:', error);
                this._snackBar.open('Failed to search for the LLP. Please try again.', 'Close', {
                    duration: 5000,
                    panelClass: ['error-snackbar'],
                });
            },
            complete: () => {

            }
        });
    }
    
    // Method to close the dialog
    onCancel(): void {
        this.dialogRef.close(false); // Close dialog without any action
    }
}