import { catchError, debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { merge, Observable, of as observableOf, Subject } from 'rxjs';
import { NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LitigationBiService } from './litigation-bi.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-litigation-bi',
  templateUrl: './litigation-bi.component.html',
  styleUrls: ['./litigation-bi.component.css']
})
export class LitigationBiComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['updatedAt', 'entityId', 'name', 'action'];
  data: [] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  fileDownloadlink: string = '';
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public dialog: MatDialog,
    private apiService: LitigationBiService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoadingResults = true;
          return this.apiService.getLitigationBiList(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            query
          ).pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.total_count;
          return data.items;
        })
      )
      .subscribe(data => (this.data = data));
  }

  ngAfterViewInit() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apiService.getLitigationBiList(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            ''
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.total_count;
          return data.items;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  openAddLitigationDetailDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(LitigationBiAddDataComponent, {
      width: '50%',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe((result) => {
      window.location.reload();
    })
  }

  routeToLitigationDirectorsList(entityId: any) {
    this.router.navigateByUrl(`/litigation-directors/details/${entityId}`)
  }

  downloadAdvanceExcelLitigationFile(companyId) {
    this.apiService.downloadAdvanceExcelLitigationFile({companyId: companyId}).subscribe((resolve) => {
      this.fileDownloadlink = resolve.data.litigationFileDetails.downloadLink;
      this.downloadFile()
    }, (err) => {
      this._snackBar.open(err.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    });
  }

  downloadLiteExcelLitigationFile(companyId) {
    this.apiService.downloadLiteExcelLitigationFile({companyId: companyId}).subscribe((resolve) => {
      this.fileDownloadlink = resolve.data.litigationFileDetails.downloadLink;
      this.downloadFile()
    }, (err) => {
      this._snackBar.open(err.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    });
  }

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

  @ViewChild('litigationBiDetailsByCinNgForm') litigationBiDetailsByCinNgForm: NgForm;

  formFieldHelpers: string[] = [''];
  litigationBiDetailsByCinForm: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<LitigationBiAddDataComponent>,
    private _formBuilder: UntypedFormBuilder,
    private apiService: LitigationBiService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Create the MCA Details form
    this.litigationBiDetailsByCinForm = this._formBuilder.group({
      companyId: ['', [Validators.required]],
    });
  }

  /**
     * Get the form field helpers as string
     */
  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }

  submitLitigationBiDetails() {
    this.apiService.submitLitigationBiDetails({
      companyId: this.litigationBiDetailsByCinForm.get('companyId').value,
    }).subscribe((resolve) => {

      this._snackBar.open(resolve.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-primary']
      });
      this.dialogRef.close();

    }, (err) => {
      this._snackBar.open(err.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    })
  }

}
