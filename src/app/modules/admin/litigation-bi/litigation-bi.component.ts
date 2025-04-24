import { catchError, debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { merge, Observable, of as observableOf, of, Subject } from 'rxjs';
import { NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LitigationBiService } from './litigation-bi.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
    selector: 'app-litigation-bi',
    templateUrl: './litigation-bi.component.html',
    styleUrls: ['./litigation-bi.component.css'],
})
export class LitigationBiComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['updatedAt', 'user', 'entityId', 'entityName', 'action'];
    data: any[] = [];

    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;
    pageSize: number = 30;
    fileDownloadlink: string = '';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(public dialog: MatDialog, private apiService: LitigationBiService, private _snackBar: MatSnackBar, private router: Router) {}

    ngOnInit(): void {
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => this.fetchLitigationBiList(query))
            )
            .subscribe((data) => (this.data = data));
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => this.fetchLitigationBiList())
            )
            .subscribe((data) => (this.data = data));
    }

    private fetchLitigationBiList(query = ''): Observable<any[]> {
        this.isLoadingResults = true;
        return this.apiService.getLitigationBiList(this.sort.active, this.sort.direction, this.paginator.pageIndex + 1, this.pageSize, query).pipe(
            catchError(() => observableOf(null)),
            map((data) => {
                this.isLoadingResults = false;
                this.isRateLimitReached = !data;
                if (!data) return [];

                this.resultsLength = data.total_count || data.data.pagination?.totalRecords || 0;
                return data.data.litigationBIs || [];
            })
        );
    }

    openAddLitigationDetailDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
        this.dialog
            .open(LitigationBiAddDataComponent, {
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

    routeToLitigationBIDetails(entityId: any) {
        this.router.navigateByUrl(`/litigation-bi/litigation-bi/${entityId}`);
    }

    // downloadAdvanceExcelLitigationFile(companyId) {
    //     this.apiService
    //         .downloadAdvanceExcelLitigationFile({ companyId: companyId })
    //         .subscribe(
    //             (resolve) => {
    //                 this.fileDownloadlink =
    //                     resolve.data.litigationFileDetails.downloadLink;
    //                 this.downloadFile();
    //             },
    //             (err) => {
    //                 this._snackBar.open(err.message, 'Close', {
    //                     horizontalPosition: 'center',
    //                     verticalPosition: 'top',
    //                     panelClass: ['mat-toolbar', 'mat-warn'],
    //                 });
    //             }
    //         );
    // }

    // downloadLiteExcelLitigationFile(companyId) {
    //     this.apiService
    //         .downloadLiteExcelLitigationFile({ companyId: companyId })
    //         .subscribe(
    //             (resolve) => {
    //                 this.fileDownloadlink =
    //                     resolve.data.litigationFileDetails.downloadLink;
    //                 this.downloadFile();
    //             },
    //             (err) => {
    //                 this._snackBar.open(err.message, 'Close', {
    //                     horizontalPosition: 'center',
    //                     verticalPosition: 'top',
    //                     panelClass: ['mat-toolbar', 'mat-warn'],
    //                 });
    //             }
    //         );
    // }

    downloadFile(): void {
        const link = document.createElement('a');
        link.href = this.fileDownloadlink;
        // link.download = 'filename.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// ADD Litigation BI Details By CIN //
@Component({
    selector: 'litigation-bi-add-data',
    templateUrl: './add-litigation-bi.component.html',
})
export class LitigationBiAddDataComponent implements OnInit {
    @ViewChild('litigationBiDetailsByCinNgForm')
    litigationBiDetailsByCinNgForm: NgForm;

    litigationBiDetailsByCinForm: UntypedFormGroup;
    filteredCompanies$: Observable<any[]> = of([]);
    entityId: string | null = null;
    kid: string | null = null;
    isSubmitting: boolean = false;

    constructor(public dialogRef: MatDialogRef<LitigationBiAddDataComponent>, private _formBuilder: UntypedFormBuilder, private apiService: LitigationBiService, private _snackBar: MatSnackBar, private router: Router) {}

    ngOnInit() {
        this.litigationBiDetailsByCinForm = this._formBuilder.group({
            entityName: ['', [Validators.required]],
            entityRelation: ['b'],
            fuzzy: [false],
            latestData: [false],
        });

        this.filteredCompanies$ = this.litigationBiDetailsByCinForm.get('entityName')!.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            switchMap((value) => (value ? this.searchCompanies(value) : of([])))
        );
    }

    onCompanySelected(event: MatAutocompleteSelectedEvent) {
        const selectedOption = event.option;
        this.entityId = selectedOption._getHostElement().getAttribute('data-id'); // Store entityId
        this.kid = selectedOption._getHostElement().getAttribute('data-kid'); // KID is needed as not all companies will cin, kid will be used to fetch directors
    }

    searchCompanies(query: string): Observable<any[]> {
        return this.apiService.searchByNameOrId(query).pipe(
            map((response) => (Array.isArray(response.result) ? response.result : [])), // Ensure an array is returned
            catchError(() => of([]))
        );
    }

    submitLitigationBiDetails() {
        if (this.isSubmitting) return;

        this.isSubmitting = true;

        this.apiService
            .getLitigationBiDetails({
                ...this.litigationBiDetailsByCinForm.value,
                entityId: this.entityId,
                kid: this.kid,
            })
            .subscribe({
                next: (resolve) => {
                    this._snackBar.open(resolve.message, 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-primary'],
                    });

                    this.router.navigate(['/litigation-bi/litigation-bi', resolve.data._id]);
                    this.dialogRef.close();
                },
                error: (err) => {
                    this._snackBar.open(err.message, 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-warn'],
                    });
                },
                complete: () => {
                    this.isSubmitting = false;
                },
            });
    }
}
