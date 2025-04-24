import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LitigationBiService } from '../litigation-bi.service';
import { MatTabGroup } from '@angular/material/tabs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import moment from 'moment';
import _, { cloneDeep } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CaseDetailComponent } from '../../case-detail/case-detail.component';
import { PdfExportComponent } from './pdf-export/pdf-export.component';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDialogComponent } from '../../custom-report/components/confirmation-dialog/confirmation-dialog.component';
import { FuseUtilsService } from '@fuse/services/utils';
import { LitigationPopupComponent } from '../../custom-report/components/litigation-popup/litigation-popup.component';

interface Director {
    din: string;
    pan: string;
    name: string;
    designation: string;
    dateOfAppointment: string;
    tenureBeginDate: string;
    tenureEndDate: string;
}

@Component({
    selector: 'app-litigation-bi-detail',
    templateUrl: './litigation-bi-detail.component.html',
    styleUrls: ['./litigation-bi-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LitigationBiDetailComponent implements OnInit {
    @ViewChild('caseTypeTabs', { static: false }) caseTypeTabs: MatTabGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    _id: string;
    entityId: string;
    isLoading: boolean = true;
    errorMessage: string = '';
    primaryEntityData: any; // needed for regenerate
    data: any;
    originalData: any;

    filters: any = {
        caseStatus: '',
        caseTypeCategory: '',
        severity: [] as string[],
        relevance: '',
        upcomingHearing: '',
    };
    litigationData: any;

    dataSource = new MatTableDataSource([]);

    courtsToDisplay: any = [
        {
            key: 'districtCourts',
            label: 'District Courts',
            color: 'text-sky-400',
        },
        { key: 'tribunalCourts', label: 'Tribunals', color: 'text-amber-500' },
        { key: 'highCourts', label: 'High Courts', color: 'text-purple-500' },
        {
            key: 'supremeCourt',
            label: 'Supreme Court',
            color: 'text-green-500',
        },
        {
            key: 'consumerCourt',
            label: 'Consumer Court',
            color: 'text-red-500',
        },
        { key: 'reraCourts', label: 'RERA Court', color: 'text-pink-500' },
    ];

    activeCourtType: number = 0;
    activeCaseType: string = 'all';
    displayedColumns: string[] = [
        'cino',
        'casetypeCaseNoCaseYr',
        'standardCaseType',
        'caseStatus',
        'petitionerNameList',
        'respondentNameList',
        'nextHearingDate',
        'courtComplex',
        'courtEstablishment',
        'district',
        'state',
        'filingDate',
        'decisionDate',
        'stageOfCase',
        'petitionerAdvocates',
        'respondentAdvocates',
        'judges',
        'natureOfDisposal',
        'civilCriminal',
    ];

    directors: any[] = [];
    selectedEntity: string = '';
    primaryEntityName: string = '';

    entityType: 'company' | 'director' = 'company';

    expired: boolean = false;
    expiredDate: Date | null = null;

    currentPageIndex: number = 0;
    pageSize: number = 20;
    resultsLength: number = 0;

    constructor(private route: ActivatedRoute, private _snackBar: MatSnackBar, private apiService: LitigationBiService, public dialog: MatDialog, private router: Router, private utils: FuseUtilsService) {}

    ngOnInit(): void {
        this._id = this.route.snapshot.paramMap.get('id');
        if (this._id) {
            this.getLitigationBiDetails();
            this.getLitigationBiDirectors();
        }
    }

    onPageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPageIndex = event.pageIndex;
    }

    getCourtTabLabel(court: Record<string, string>): string {
        return `<mat-icon class="${court.color}">glave</mat-icon> ${court.label} (${this.data?.litigationDetails?.courtWiseCount?.[court.key]?.total || 0})`;
    }

    setActiveCourtType(index: number): void {
        this.activeCourtType = index;
        this.activeCaseType = 'all';

        if (this.paginator) {
            this.paginator.firstPage();
        }

        if (this.caseTypeTabs) {
            this.caseTypeTabs.selectedIndex = 0;
        }

        this.getFilteredTableData();
    }

    setActiveCaseType(caseType: string): void {
        this.activeCaseType = caseType;

        if (this.paginator) {
            this.paginator.firstPage();
        }

        this.getFilteredTableData();
    }

    getFilteredTableData(): void {
        if (!this.data?.litigationDetails?.records) return null;

        let caseData = this.data.litigationDetails.records[this.courtsToDisplay[this.activeCourtType].key];

        if (this.activeCaseType !== 'all') {
            caseData = caseData.filter((caseItem: any) => {
                return caseItem.civilCriminal && caseItem.civilCriminal.toLowerCase() === this.activeCaseType;
            });
        }

        this.resultsLength = caseData.length; // Update total records count
        this.litigationData = caseData;
        // Implement pagination
        const startIndex = this.currentPageIndex * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        this.dataSource.data = caseData.slice(startIndex, endIndex);
    }

    getLitigationBiDetails(): void {
        this.isLoading = true;
        this.apiService.getLitigationBiById(this._id).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.data = response.data;
                    this.primaryEntityName = response.data.entityName;
                    this.selectedEntity = response.data.entityName;
                    this.originalData = _.cloneDeep(response.data); // save the copy of original data for clear filters
                    this.primaryEntityData = _.cloneDeep(response.data); // save the copy of original data for clear filters
                    this.entityId = response.data.entityId;
                    this.entityType = 'company';
                    this.filterCases();
                    this.setExpiry();
                } else {
                    this.data = null;
                }
            },
            error: (err) => {
                console.error('Error fetching Litigation BI details:', err);
                this.errorMessage = 'Failed to fetch Litigation BI details.';
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }

    getLitigationBiDirectors(): void {
        this.apiService.getLitigationBiDirectors({ litigationBiId: this._id }).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.directors = response.data.detailedDetails.directors;
                } else {
                    this.directors = [];
                }
            },
            error: (err) => {
                console.error('Error fetching Litigation BI details:', err);
                this.errorMessage = 'Failed to fetch Litigation BI directors list.';
            },
        });
    }

    getDirectorByName(name: string): Director | null {
        const filteredDirector = this.directors.find((director) => director.name === name);
        return filteredDirector || null; // Return null instead of false
    }

    dateInCurrentWeek(dateStr: string): boolean {
        const date = moment(dateStr, 'YYYY-MM-DD');
        const start = moment().startOf('week').add(1, 'day'); // Monday
        const end = moment(start).add(6, 'days'); // Sunday
        return date.isBetween(start, end, undefined, '[]');
    }

    dateInThisMonth(dateStr: string): boolean {
        const date = moment(dateStr, 'YYYY-MM-DD');
        const today = moment();
        return date.isSame(today, 'month') && date.isSameOrAfter(today, 'day');
    }

    dateInNextMonth(dateStr: string): boolean {
        const date = moment(dateStr, 'YYYY-MM-DD');
        return date.isSame(moment().add(1, 'month'), 'month');
    }

    updateRecordsAndCount(data: any) {
        let severityCount = {
            high: 0,
            highRelevance: 0,
            low: 0,
            medium: 0,
            total: 0,
        };

        let caseTypeCategoryCount = {
            total: {
                civil: 0,
                criminal: 0,
                execution: 0,
            },
        };

        for (let courtType in data.records) {
            caseTypeCategoryCount[courtType] = {
                civil: 0,
                criminal: 0,
            };

            data.records[courtType].forEach((record: any) => {
                record.severity_ === 'medium' ? severityCount.medium++ : '';
                record.severity_ === 'high' ? severityCount.high++ : '';
                record.severity_ === 'low' ? severityCount.low++ : '';
                record.relevance_ === 'high' ? severityCount.highRelevance++ : '';

                const isCivil = record.civilCriminal?.toLowerCase() === 'civil';
                const isCriminal = record.civilCriminal?.toLowerCase() === 'criminal';
                const isExecution = record.civilCriminal === '';

                caseTypeCategoryCount[courtType].civil += isCivil ? 1 : 0;
                caseTypeCategoryCount[courtType].criminal += isCriminal ? 1 : 0;
                caseTypeCategoryCount[courtType].execution += isExecution ? 1 : 0;

                caseTypeCategoryCount.total.civil += isCivil ? 1 : 0;
                caseTypeCategoryCount.total.criminal += isCriminal ? 1 : 0;
                caseTypeCategoryCount.total.execution += isExecution ? 1 : 0;
            });
        }

        this.data.litigationDetails.severityCount.total = severityCount;
        this.data.litigationDetails.caseTypeCategoryCount = caseTypeCategoryCount;
        this.data.litigationDetails.courtWiseCount = data.courtWiseCount;
        this.data.litigationDetails.totalCases = data.totalCases;
        this.data.litigationDetails.upcomingCases = data.upcomingCases;
        this.data.litigationDetails.records = data.records;

        // reset pagination
        this.currentPageIndex = 0;
        this.pageSize = 20;
        this.resultsLength = 0;

        this.activeCaseType = 'all';

        this.getFilteredTableData(); // ✅ Ensure UI updates
    }

    filterCases() {
        const records = this.originalData.litigationDetails.records;

        let data = {
            records: {},
            totalCases: {
                disposed: 0,
                pending: 0,
                'not available': 0,
                total: 0,
            },
            courtWiseCount: {},
            upcomingCases: {
                total: { thisWeek: 0, thisMonth: 0, nextMonth: 0 },
            },
        };

        const hearings = {
            thisWeek: [],
            thisMonth: [],
            nextMonth: [],
        };

        for (let courtType in records) {
            data.records[courtType] = [];

            data.courtWiseCount[courtType] = {
                disposed: 0,
                pending: 0,
                'not available': 0,
                total: 0,
            };

            records[courtType].forEach((record: any) => {
                let isMatch: boolean =
                    (!this.filters.caseStatus || (record.caseStatus && record.caseStatus.toLowerCase() === this.filters.caseStatus)) &&
                    (!this.filters.caseTypeCategory || (record.civilCriminal && record.civilCriminal.toLowerCase() === this.filters.caseTypeCategory)) &&
                    (!this.filters.severity.length || (typeof record.severity_ === 'string' && this.filters.severity.includes(record.severity_.toLowerCase()))) &&
                    (!this.filters.relevance || (record.relevance_ && record.relevance_.toLowerCase() === this.filters.relevance));

                if (this.filters.upcomingHearing && isMatch) {
                    if (!record.nextHearingDate) {
                        isMatch = false;
                    } else {
                        switch (this.filters.upcomingHearing) {
                            case 'thisWeek':
                                isMatch = this.dateInCurrentWeek(record.nextHearingDate);
                                break;
                            case 'thisMonth':
                                isMatch = this.dateInThisMonth(record.nextHearingDate);
                                break;
                            case 'nextMonth':
                                isMatch = this.dateInNextMonth(record.nextHearingDate);
                                break;
                        }
                    }
                }

                if (isMatch) {
                    data.records[courtType].push(record);

                    data.courtWiseCount[courtType][record.caseStatus.toLowerCase()]++;
                    data.courtWiseCount[courtType].total++;

                    data.totalCases[record.caseStatus.toLowerCase()]++;
                    data.totalCases.total++;

                    if (record.nextHearingDate) {
                        data.upcomingCases.total.thisWeek += this.dateInCurrentWeek(record.nextHearingDate) ? 1 : 0;
                        data.upcomingCases.total.thisMonth += this.dateInThisMonth(record.nextHearingDate) ? 1 : 0;
                        data.upcomingCases.total.nextMonth += this.dateInNextMonth(record.nextHearingDate) ? 1 : 0;
                    }
                }
            });
        }

        this.updateRecordsAndCount(data);
    }

    setFilters(filters: Partial<typeof this.filters>) {
        this.isLoading = true;
        const updatedFilters = { ...this.filters };

        for (const key in filters) {
            if (Array.isArray(this.filters[key]) && Array.isArray(filters[key])) {
                // Toggle array filters (like severity)
                updatedFilters[key] = this.filters[key].toString() === filters[key].toString() ? [] : filters[key];
            } else {
                // Toggle string filters
                updatedFilters[key] = this.filters[key] === filters[key] ? '' : filters[key];
            }
        }

        this.filters = updatedFilters;

        // ! NOTE - Remove temp delay
        const delay = 0; // Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
        setTimeout(() => {
            this.isLoading = false;
            this.filterCases();
        }, delay);
    }

    setExpiry() {
        const updatedAt = moment(this.data.updatedAt || this.data.createdAt);
        const expiryDate = updatedAt.clone().add(30, 'days');
        this.expired = moment().isAfter(expiryDate);
        this.expiredDate = expiryDate.toDate();
    }

    onDirectorChange(selectedValue: string): void {
        this.selectedEntity = selectedValue;

        // if its primary entity
        if (this.selectedEntity === this.primaryEntityName) {
            this.getLitigationBiDetails();
            return;
        }

        const director = this.getDirectorByName(this.selectedEntity);

        if (!director) {
            this._snackBar.open('Director not found!', 'Close', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['mat-toolbar', 'mat-warn'],
            });

            return;
        }

        this.isLoading = true;

        this.apiService
            .getLitigationBiDirectorDetails({
                litigationBiId: this._id,
                entityName: selectedValue,
                din: director.din,
            })
            .subscribe({
                next: (response) => {
                    if (response && response.data) {
                        this.data = response.data;
                        this.originalData = _.cloneDeep(response.data); // save the copy of original data for clear filters
                        this.entityId = response.data.entityId;
                        this.selectedEntity = response.data.entityName;
                        this.filterCases();

                        this.entityType = 'director';
                    } else {
                        this.data = null;
                    }
                },
                error: (err) => {
                    console.error('Error fetching Litigation BI Director details:', err);
                    this.errorMessage = 'Failed to fetch Litigation BI Director details.';
                },
                complete: () => {
                    this.isLoading = false;
                },
            });
    }

    getCaseDetails(cino: string) {
        this.isLoading = true;
        this.apiService.getCaseDetails(this._id, cino).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.dialog.open(CaseDetailComponent, {
                        width: '95vw',
                        height: '95vh',
                        data: {
                            caseDetails: response.data,
                            court: this.courtsToDisplay[this.activeCourtType].label,
                        },
                    });
                } else {
                }
            },
            error: (err) => {
                console.error('Error fetching Case details:', err);
                this.errorMessage = 'Failed to fetch Case details.';
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }

    exportExcel(fileType: 'lite' | 'advanced'): void | boolean {
        if (this.expired) {
            this._snackBar.open('Expired reports can not be expored.', 'Close', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['mat-toolbar', 'mat-warn'],
            });

            return;
        }

        this.isLoading = true;
        this.apiService.exportExcel(this.data._id, fileType, this.entityType, this.filters).subscribe({
            next: (resolve) => {
                this.downloadFile(resolve.downloadLink, fileType);
            },
            error: (err) => {
                this._snackBar.open(err.message, 'Close', {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    panelClass: ['mat-toolbar', 'mat-warn'],
                });
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }

    async getPDFTemplates(): Promise<any> {
        try {
            const response = await firstValueFrom(this.apiService.getPDFTemplates());
            if (response && response.templates) {
                return response.templates;
            } else {
                return false;
            }
        } catch (err) {
            console.error('Failed to fetch PDF templates.', err);
            this.errorMessage = 'Failed to fetch PDF templates.';
            return false;
        }
    }

    async exportPDF() {
        if (this.expired) {
            this._snackBar.open('Expired reports can not be expored.', 'Close', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['mat-toolbar', 'mat-warn'],
            });

            return;
        }

        const pdfTemplates = await this.getPDFTemplates();

        if (!pdfTemplates) {
            this._snackBar.open('PDF templates not found!', 'Close', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['mat-toolbar', 'mat-warn'],
            });

            return;
        }

        this.dialog.open(PdfExportComponent, {
            width: '500px',
            data: {
                templates: pdfTemplates,
                entityType: this.entityType,
                filters: this.filters,
                id: this.data._id,
            },
        });
    }

    downloadFile(fileLink: string, fileType: string): void {
        const link = document.createElement('a');
        // link.href = `${environment.litigationFilePath}${fileLink}`;
        link.href = fileLink;
        link.download = `${this.entityType}_${this.entityId}_${fileType}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    regenerate() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Regenerating will cost 2 credits. Do you want to continue?',
                confirmText: 'Yes',
                cancelText: 'No',
            },
        });

        dialogRef.afterClosed().subscribe({
            next: (confirmed: boolean) => {
                if (confirmed) {
                    this.isLoading = true;
                    this.apiService
                        .getLitigationBiDetails({
                            entityName: this.primaryEntityData.entityName,
                            entityId: this.primaryEntityData.entityId,
                            entityRelation: this.primaryEntityData.entityRelation,
                            fuzzy: this.primaryEntityData.fuzzy,
                            kid: this.primaryEntityData.kid,
                            latestData: true,
                        })
                        .subscribe({
                            next: (resolve) => {
                                this._snackBar.open(resolve.message, 'Close', {
                                    horizontalPosition: 'center',
                                    verticalPosition: 'top',
                                    panelClass: ['mat-toolbar', 'mat-primary'],
                                });
                                this.router.navigate(['/litigation-bi/litigation-bi', resolve.data._id]);
                            },
                            error: (err) => {
                                this._snackBar.open(err.message, 'Close', {
                                    horizontalPosition: 'center',
                                    verticalPosition: 'top',
                                    panelClass: ['mat-toolbar', 'mat-warn'],
                                });
                            },
                            complete: () => {
                                this.isLoading = false;
                            },
                        });
                }
            },
        });
    }

    generateSummary(): void {
        this.apiService.getLitigationSummary(this.litigationData).subscribe(
            (summaryResult: any) => {
                const dialogRef = this.dialog.open(LitigationPopupComponent, {
                    disableClose: true,
                    width: '900px',
                    data: summaryResult.summaryHtml,
                });

                dialogRef.afterClosed().subscribe((selectedSummaries: string[] | undefined) => {});
            },
            (error) => {
                console.error('Error fetching litigation summary:', error);
            }
        );
    }
}
