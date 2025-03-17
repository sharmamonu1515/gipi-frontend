import {
    catchError,
    debounceTime,
    map,
    startWith,
    switchMap,
    takeUntil,
} from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { merge, Observable, of as observableOf, Subject } from 'rxjs';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SanctionsService } from './sanctions.service';
import { Router } from '@angular/router';
import { countries } from './countries';
import { ToastrService } from 'ngx-toastr';

import {
    NgbModal,
  } from '@ng-bootstrap/ng-bootstrap';
import { SanctionDetailsComponent } from '../sanction-details/sanction-details.component';
interface Country {
    code: string;
    value: string;
}

@Component({
    selector: 'app-sanctions',
    templateUrl: './sanctions.component.html',
    styleUrls: ['./sanctions.component.scss'],
})
export class SanctionsComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        'schema',
        'name',
        'countries',
        'sanctions',
        'dataset',
    ];
    data: any[] = [];

    schemas: string[] = ['All', 'Person', 'Organization', 'Company','Airplane','LegalEntity','Vessel'];

    countryForm = new FormControl();
    schemaForm = new FormControl();
    filteredCountries: any[] = countries;
    filteredSchemas: any[] = this.schemas;
    pageSize = 30;
    countries = countries;
    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;
    searchInputControl = new UntypedFormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public dialog: MatDialog,
        private apiService: SanctionsService,
        private router: Router,
        private toaster: ToastrService,
        private modalService:NgbModal
    ) {}

    ngOnInit(): void {
        merge(
           // this.searchInputControl.valueChanges.pipe(debounceTime(300)),
            this.countryForm.valueChanges,
            this.schemaForm.valueChanges
        )
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(() => {
                    this.isLoadingResults = true;
                    this.paginator.pageIndex = 0; // Reset to first page
                    return this.apiService
                        .getSanctionList(
                            this.sort.active,
                            this.sort.direction,
                            this.paginator.pageIndex,
                            this.pageSize,
                            this.countryForm.value,
                            this.schemaForm.value,
                            this.searchInputControl.value
                        )
                        .pipe(catchError(() => observableOf(null)));
                }),
                map((data) => {
                    this.isLoadingResults = false;
                    this.isRateLimitReached = data === null;
                    if (data === null) {
                        return [];
                    }
                    this.resultsLength = data.pagination.totalItems;
                    return data.data;
                })
            )
            .subscribe((data) => (this.data = data));
    }

    onCountryChange(event: any) {
        const searchInput = event.target.value.toLowerCase();
        this.filteredCountries = this.countries.filter(({ value }) => {
            return value.toLowerCase().includes(searchInput);
        });
    }

    onSchemaChange(event: any) {
      const searchInput = event.target.value.toLowerCase();
      this.filteredSchemas = this.schemas.filter(schema => {
        return schema.toLowerCase().includes(searchInput);
      });
      console.log(this.countryForm.value);
    }

    onOpenCountryChange(input: any) {
        if (input) {
            input.value = '';
            this.filteredCountries = this.countries.slice();
        }
    }
    onOpenSchemaChange(input: any) {
        if (input) {
            input.value = '';
            this.filteredCountries = this.countries.slice();
        }
    }
    getCountry(countryCode) {
        return countryCode.split(';').map(code => {
            const country = countries.find(c => c.code === code);
            return country ? `${country.value}(${code})` : `${code}`;
        }).join(';');
    }
    
    getSearch()
    {
        this.isLoadingResults = true;
        this.paginator.pageIndex = 0; // Reset to first page
        return this.apiService
            .getSanctionList(
                this.sort.active,
                this.sort.direction,
                this.paginator.pageIndex,
                this.pageSize,
                this.countryForm.value,
                this.schemaForm.value,
                this.searchInputControl.value
            )
            
.subscribe((data) =>
    { this.data = data.data
        this.isLoadingResults = false;
        this.isRateLimitReached = data.data === null;
        if (data.data === null) {
            return [];
        }
this.resultsLength = data.pagination.totalItems;
    });
    }
    ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.apiService
                        .getSanctionList(
                            this.sort.active,
                            this.sort.direction,
                            this.paginator.pageIndex,
                            this.pageSize,
                            this.countryForm.value,
                            this.schemaForm.value,
                            ''
                        )
                        .pipe(catchError(() => observableOf(null)));
                }),
                map((data) => {
                    this.isLoadingResults = false;
                    this.isRateLimitReached = data === null;
                    if (data === null) {
                        return [];
                    }
                    this.resultsLength = data.pagination.totalItems;
                    return data.data;
                })
            )
            .subscribe((data) => (this.data = data));
    }
    textLimiter(text: string): string {
        if (!text) return '';

        return text.slice(0, 100) + (text.length > 50 ? '...' : '');
    }
    openPopup(row)
    {
        console.log(row);

      const modalReference = this.modalService.open(SanctionDetailsComponent, {
        scrollable: false,
        size: 'lg',
        centered: true,
        windowClass: 'media-modal hsGr',
        backdropClass: 'light-grey-backdrop',
        // backdrop:false
      });
      modalReference.componentInstance.row = row;
      modalReference.componentInstance.searchText = this.searchInputControl.value||"All";
    }
    openDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string
    ): void {
        // this.dialog.open(GstAddDataComponent, {
        //   width: '50%',
        //   enterAnimationDuration,
        //   exitAnimationDuration,
        //   disableClose: true
        // }).afterClosed().subscribe((result) => {
        //   window.location.reload();
        // })
    }

    gstListByPan(id: any) {
        this.router.navigateByUrl(`/gst-list-by-pan/details/${id}`);
    }

    openGstLoginDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string
    ): void {
        // this.dialog.open(GstLoginComponent, {
        //   width: '50%',
        //   height: '68%',
        //   enterAnimationDuration,
        //   exitAnimationDuration,
        //   disableClose: true
        // });
    }

    async exportExcelInOneSheet(gstData, panNumber) {
        console.log('Akshay');
    }

    createProduct() {
        console.log('Akshay Pratap');
    }
}
