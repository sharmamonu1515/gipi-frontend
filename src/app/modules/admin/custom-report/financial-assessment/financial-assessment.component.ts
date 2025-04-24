import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { catchError, forkJoin, Subscription, throwError } from 'rxjs';
import { FinancialRatioService } from './financial-ratio.service';
import { CurrencyConversionService } from './currency-conversion.service';
import { ToastrService } from 'ngx-toastr';
import { ReportDataService } from '../services/report-data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { SummarizedPopupComponent } from '../components/summarized-popup/summarized-popup.component';
import { PromptService } from '../services/prompt.service';
import { ApiResponse } from 'app/interfaces/common';

@Component({
    selector: 'app-financial-assessment',
    templateUrl: './financial-assessment.component.html',
    styleUrls: ['./financial-assessment.component.scss'],
})
export class FinancialAssessmentComponent implements OnInit, OnDestroy {
    years: number[] = [];
    newYear!: number;
    companyData: any;
    balanceSheetdata: { [year: string]: any } = {};
    balanceSheetYears: string[] = [];
    assetsData: { [year: string]: any } = {};
    assetsYears: string[] = [];
    displayeBalanceSheetYears: string[] = [];
    financialObservations: string = ``;
    displayAssetsYears: string[] = [];
    displayProfitLossYears: string[] = [];
    financialYears: string[] = [];
    profitLossData: { [year: string]: any } = {};
    profitLossYears: string[] = [];
    ratioAnalysisYears: string[] = [];
    subTotalData: { [year: string]: any } = {};
    currentUnit: string = 'INR';
    private unitSubscription: Subscription;
    private rawBalanceSheetdata: { [year: string]: any } = {};
    private rawSubTotalData: { [year: string]: any } = {};
    private rawAssetsData: { [year: string]: any } = {};
    private rawProfitLossData: { [year: string]: any } = {};
    private savedData: any;
    private originalData: string = '';
    companyType: string = 'company';
    showPlNullFields: boolean = true;
    showPlZeroFields: boolean = true;
    showBsNullFields: boolean = true;
    showBsZeroFields: boolean = true;
    showAsNullFields: boolean = true;
    showAsZeroFields: boolean = true;
    private quillEditors: { [key: string]: any } = {};
    private quillEditorFields: string[] = ['financialObservations'];
    isLoading: boolean;
    summaryResult: any;
    private modelSubscription: Subscription;
    currentModel: string;

    constructor(
        private dataService: ReportDataService,
        private ratioService: FinancialRatioService,
        private currencyService: CurrencyConversionService,
        private toastr: ToastrService,
        private http: HttpClient,
        private dialog: MatDialog,
        private promptService: PromptService
    ) {}

    financialData = [
        { field: 'Recommended Credit Days', value: '', comments: '' },
        { field: 'Recommended Credit Amount', value: '', comments: '' },
        { field: 'Total Income', value: '', comments: '' },
        { field: 'Profit (loss) for period (PAT)', value: '', comments: '' },
        { field: "Shareholders' funds", value: '', comments: '' },
        { field: 'Long-Term Borrowings', value: '', comments: '' },
        {
            field: 'Aggregate of charges registered on borrowings',
            value: '',
            comments: '',
        },
        { field: 'Adverse Remark by Auditor in CARO', value: '', comments: '' },
    ];

    editorConfig = {
        readOnly: false,
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ header: [1, 2, 3, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ align: [] }],
        ],
    };

    profitabilityRatios = [
        { particulars: 'Gross Profit Margin (%)', values: [] },
        { particulars: 'Operating Profit Margin (%)', values: [] },
    ];

    returnRatios = [
        { particulars: 'Net Profit Margin (%)', values: [] },
        { particulars: 'Return on Assets (%)', values: [] },
        { particulars: 'Return on Tangible Net worth (%)', values: [] },
        { particulars: 'Return on Capital Employed (%)', values: [] },
    ];

    liquidityRatios = [
        { particulars: 'Quick Ratio (Times)', values: [] },
        { particulars: 'Current Ratio (Times)', values: [] },
    ];

    trunoverRatios = [
        { particulars: 'Fixed Asset Turnover Ratio (Times)', values: [] },
    ];

    solvencyRatios = [
        { particulars: 'Total Debt Equity Ratio (Times)', values: [] },
        {
            particulars: 'Total Liabilities to Tangible Net worth (%)',
            values: [],
        },
        { particulars: 'Interest Coverage Ratio (Times)', values: [] },
    ];

    efficiencyRatios = [
        { particulars: 'Collection Period (Days)', values: [] },
    ];

    workingCapitalRatios = [
        {
            particulars: 'Current Liabilities to Tangible Net worth (%)',
            values: [],
        },
        { particulars: 'Working Capital Turnover Ratio (Times)', values: [] },
    ];

    altmanScore = [
        { particulars: "Altman's Z Score", values: [] },
        { particulars: 'Du Pont Analysis Score', values: [] },
    ];

    ngOnInit(): void {
        this.promptService.setModel('gemini');
        this.modelSubscription = this.promptService.unit$.subscribe((model) => {
            this.currentModel = model;
        });
        this.savedData = this.dataService.getData('financial-assessment');
        this.companyData = this.dataService.getCompanyData();
        this.companyType = this.dataService.getCompanyType();

        this.initializeData();
        this.subscribeToUnitChanges();
        this.getFinancialObservations();

        if (this.savedData) {
            this.loadFromSavedData();
        }

        this.originalData = JSON.stringify(this.getData());
        const firstfinancial = this.companyData?.data?.financials[0];
        this.financialObservations =
            this.savedData?.financialObservations ||
            firstfinancial?.financial_observations ||
            '';
    }

    hasUnsavedChanges(): boolean {
        const currentData = JSON.stringify(this.getData());
        return this.originalData !== currentData;
    }

    saveData() {
        const data = this.getData();
        const payload = {
            balanceSheetData: this.rawBalanceSheetdata,
            profitLossData: this.rawProfitLossData,
            assetsData: this.rawAssetsData,
            financialData: data?.financialData,
            financialObservations: data?.financialObservations,
            yearsToUpdate: data?.displayeBalanceSheetYears,
        };
        const requestBody = {
            companyId: this.dataService.getCompanyId(),
            financialData: payload,
        };

        this.http
            .put<any>(
                `${environment.baseURI}/custom-report/update-financials`,
                requestBody
            )
            .pipe(
                catchError((error) => {
                    this.toastr.error(
                        'Failed to update financial data: ' +
                            (error.error?.message || 'Unknown error')
                    );
                    return throwError(() => error);
                })
            )
            .subscribe((response) => {
                if (response.status === 'success') {
                    this.toastr.success(
                        'Financial assessment data saved successfully'
                    );
                    this.dataService.setData('financial-assessment', data);
                    this.originalData = JSON.stringify(data);
                } else {
                    this.toastr.warning(
                        'An Error occurred while saving financial data'
                    );
                }
            });
    }

    private loadFromSavedData(): void {
        (this.showPlNullFields = this.savedData.showPlNullFields),
            (this.showPlZeroFields = this.savedData.showPlZeroFields),
            (this.showBsNullFields = this.savedData.showBsNullFields),
            (this.showBsZeroFields = this.savedData.showBsZeroFields),
            (this.showAsNullFields = this.savedData.showAsNullFields),
            (this.showAsZeroFields = this.savedData.showAsZeroFields),
            (this.financialData =
                this.savedData.financialData || this.financialData);
        this.rawProfitLossData = this.savedData.rawProfitLossData;
        this.rawBalanceSheetdata = this.savedData.rawBalanceSheetdata;
        this.rawSubTotalData = this.savedData.subTotalData || this.subTotalData;
        this.rawAssetsData = this.savedData.rawAssetsData;
        this.balanceSheetYears =
            this.savedData.balanceSheetYears || this.balanceSheetYears;
        this.assetsYears = this.savedData.assetsYears || this.assetsYears;
        this.profitLossYears =
            this.savedData.profitLossYears || this.profitLossYears;
        this.ratioAnalysisYears =
            this.savedData.ratioAnalysisYears || this.ratioAnalysisYears;
        this.displayeBalanceSheetYears =
            this.savedData.displayeBalanceSheetYears;
        this.displayAssetsYears = this.savedData.displayAssetsYears;
        this.displayProfitLossYears = this.savedData.displayProfitLossYears;
        this.financialObservations =
            this.savedData.financialObservations || this.financialObservations;
        this.profitabilityRatios = this.savedData.profitabilityRatios;
        this.returnRatios = this.savedData.returnRatios;
        this.liquidityRatios = this.savedData.liquidityRatios;
        this.trunoverRatios = this.savedData.trunoverRatios;
        this.solvencyRatios = this.savedData.solvencyRatios;
        this.efficiencyRatios = this.savedData.efficiencyRatios;
        this.workingCapitalRatios = this.savedData.workingCapitalRatios;
        this.altmanScore = this.savedData.altmanScore;

        this.updateDataForUnit(this.currentUnit);
    }

    private initializeData(): void {
        if (!this.companyData) {
            console.warn('No company data available.');
            return;
        }

        const latestFinancials = this.companyData?.data?.financials || [];

        if (latestFinancials[0]?.financial_highlights?.length > 0) {
            this.financialData = latestFinancials[0].financial_highlights;
        }

        const standaloneFinancials =
            this.companyType === 'llps'
                ? latestFinancials
                : latestFinancials.filter(
                      (item: any) => item.nature === 'STANDALONE'
                  );

        if (!this.financialYears.length) {
            this.financialYears = Array.from(
                new Set(
                    standaloneFinancials.map((item: any) =>
                        new Date(item.year).getFullYear().toString()
                    )
                )
            );
        }

        if (!this.balanceSheetYears.length) {
            this.balanceSheetYears = this.financialYears.slice(0, 3).reverse();
            this.displayeBalanceSheetYears = [...this.balanceSheetYears];
        }

        if (!this.assetsYears.length) {
            this.assetsYears = this.financialYears.slice(0, 3).reverse();
            this.displayAssetsYears = [...this.assetsYears];
        }

        if (!this.profitLossYears.length) {
            this.profitLossYears = this.financialYears.slice(0, 3).reverse();
            this.displayProfitLossYears = [...this.profitLossYears];
        }

        if (!this.ratioAnalysisYears.length) {
            this.ratioAnalysisYears = this.financialYears.slice(0, 3).reverse();
        }

        if (!Object.keys(this.rawBalanceSheetdata).length) {
            standaloneFinancials.forEach((entry: any) => {
                const year = new Date(entry.year).getFullYear().toString();
                const balanceSheet =
                    this.companyType === 'llps'
                        ? entry.statement_of_assets_and_liabilities
                        : entry.bs;
                this.rawBalanceSheetdata[year] =
                    balanceSheet?.liabilities || {};
                this.rawSubTotalData[year] = balanceSheet?.subTotals || {};
                this.rawAssetsData[year] = balanceSheet?.assets || {};
                this.rawProfitLossData[year] =
                    this.companyType === 'llps'
                        ? entry?.statement_of_income_and_expenditure?.lineItems
                        : entry.pnl?.lineItems || {};
            });
        }

        this.updateDataForUnit(this.currentUnit);
        this.calculateRatios();
    }

    private subscribeToUnitChanges(): void {
        this.unitSubscription = this.currencyService.unit$.subscribe((unit) => {
            this.currentUnit = unit;
            this.updateDataForUnit(unit);
            this.calculateRatios();
        });
    }

    private updateDataForUnit(unit: string): void {
        this.balanceSheetdata = this.convertData(
            this.rawBalanceSheetdata,
            unit
        );
        this.subTotalData = this.convertData(this.rawSubTotalData, unit);
        this.assetsData = this.convertData(this.rawAssetsData, unit);
        this.profitLossData = this.convertData(this.rawProfitLossData, unit);

        this.financialData = this.financialData.map((item) => {
            if (item.value && !isNaN(Number(item.value))) {
                const convertedValue = this.convertValue(
                    Number(item.value),
                    unit
                );
                return {
                    ...item,
                    value: this.formatDecimalValue(convertedValue),
                };
            }
            return item;
        });
    }

    private formatDecimalValue(value: number): string {
        return value.toFixed(2);
    }

    private convertData(
        data: { [year: string]: any },
        unit: string
    ): { [year: string]: any } {
        const convertedData: { [year: string]: any } = {};
        for (const year in data) {
            convertedData[year] = {};
            for (const key in data[year]) {
                const value = data[year][key];
                convertedData[year][key] = this.formatNumericValue(value, unit);
            }
        }
        return convertedData;
    }

    private formatNumericValue(value: any, unit?: string): any {
        if (typeof value === 'number') {
            const convertedValue = unit
                ? this.convertValue(value, unit)
                : value;
            return Number(convertedValue.toFixed(2));
        }
        return value;
    }

    private convertValue(value: number, unit: string): number {
        return this.currencyService.convertValue(value, unit);
    }

    calculateRatios(): void {
        const ratios = this.ratioService.calculateAllRatios(
            this.balanceSheetdata,
            this.assetsData,
            this.profitLossData,
            this.ratioAnalysisYears.reverse(),
            this.subTotalData
        );

        this.profitabilityRatios = ratios.profitabilityRatios;
        this.returnRatios = ratios.returnRatios;
        this.liquidityRatios = ratios.liquidityRatios;
        this.trunoverRatios = ratios.turnoverRatios;
        this.solvencyRatios = ratios.solvencyRatios;
        this.efficiencyRatios = ratios.efficiencyRatios;
        this.workingCapitalRatios = ratios.workingCapitalRatios;
        this.altmanScore = ratios.altmanScore;
    }

    updateDisplayedYears(tableName: string) {
        if (tableName === 'balanceSheet') {
            this.displayeBalanceSheetYears = [
                ...this.balanceSheetYears,
            ].reverse();
        }
        if (tableName === 'assets') {
            this.displayAssetsYears = [...this.assetsYears].reverse();
        }
        if (tableName === 'profitLoss') {
            this.displayProfitLossYears = [...this.profitLossYears].reverse();
        }
        if (tableName === 'ratioAnalysis') {
            this.calculateRatios();
        }
    }

    getData() {
        const data = {
            financialData: this.financialData,
            displayeBalanceSheetYears: this.displayeBalanceSheetYears,
            balanceSheetData: this.balanceSheetdata,
            assetsData: this.assetsData,
            displayAssetsYears: this.displayAssetsYears,
            profitLossData: this.profitLossData,
            displayProfitLossYears: this.displayProfitLossYears,
            profitabilityRatios: this.profitabilityRatios,
            returnRatios: this.returnRatios,
            liquidityRatios: this.liquidityRatios,
            turnoverRatios: this.trunoverRatios,
            solvencyRatios: this.solvencyRatios,
            efficiencyRatios: this.efficiencyRatios,
            workingCapitalRatios: this.workingCapitalRatios,
            altmanScore: this.altmanScore,
            ratioAnalysisYears: this.ratioAnalysisYears,
            financialObservations: this.financialObservations,
            profitLossYears: this.profitLossYears,
            trunoverRatios: this.trunoverRatios,
            rawAssetsData: this.rawAssetsData,
            rawBalanceSheetdata: this.rawBalanceSheetdata,
            rawProfitLossData: this.rawProfitLossData,
            assetsYears: this.assetsYears,
            balanceSheetYears: this.balanceSheetYears,
            showPlNullFields: this.showPlNullFields,
            showPlZeroFields: this.showPlZeroFields,
            showBsNullFields: this.showBsNullFields,
            showBsZeroFields: this.showBsZeroFields,
            showAsNullFields: this.showAsNullFields,
            showAsZeroFields: this.showAsZeroFields,
            subTotalData: this.subTotalData,
        };
        return data;
    }

    getPnlFields(): string[] {
        if (this.profitLossYears.length === 0) return [];

        const firstYear = this.financialYears[0];
        if (!this.profitLossData[firstYear]) return [];

        return Object.keys(this.profitLossData[firstYear]).filter((field) => {
            return (
                (this.showPlNullFields || !this.isNullField(field)) &&
                (this.showPlZeroFields || !this.isZeroField(field))
            );
        });
    }

    private isNullField(field: string): boolean {
        return this.profitLossYears.every(
            (year) => this.profitLossData[year]?.[field] === null
        );
    }

    private isZeroField(field: string): boolean {
        return this.profitLossYears.every(
            (year) => this.profitLossData[year]?.[field] === 0
        );
    }

    getBsFields(): string[] {
        if (this.balanceSheetYears.length === 0) return [];

        const firstYear = this.financialYears[0];
        if (!this.balanceSheetdata[firstYear]) return [];

        return Object.keys(this.balanceSheetdata[firstYear]).filter((field) => {
            return (
                (this.showBsNullFields || !this.isBsNullField(field)) &&
                (this.showBsZeroFields || !this.isBsZeroField(field))
            );
        });
    }

    private isBsNullField(field: string): boolean {
        return this.balanceSheetYears.every(
            (year) => this.balanceSheetdata[year]?.[field] === null
        );
    }

    private isBsZeroField(field: string): boolean {
        return this.balanceSheetYears.every(
            (year) => this.balanceSheetdata[year]?.[field] === 0
        );
    }

    getAssetFields(): string[] {
        if (this.assetsYears.length === 0) return [];

        const firstYear = this.financialYears[0];
        if (!this.assetsData[firstYear]) return [];

        return Object.keys(this.assetsData[firstYear]).filter((field) => {
            return (
                (this.showAsNullFields || !this.isAsNullField(field)) &&
                (this.showAsZeroFields || !this.isAsZeroField(field))
            );
        });
    }

    private isAsNullField(field: string): boolean {
        return this.assetsYears.every(
            (year) => this.assetsData[year]?.[field] === null
        );
    }

    private isAsZeroField(field: string): boolean {
        return this.assetsYears.every(
            (year) => this.assetsData[year]?.[field] === 0
        );
    }

    formatFieldName(fieldName: string): string {
        return fieldName
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    onEditorCreated(editor: any, fieldName: string) {
        this.quillEditorFields[fieldName] = editor;

        const currentValue = this.financialObservations || '';
        if (currentValue) {
            this.setQuillContent(fieldName, currentValue);
        }
    }
    private setQuillContent(fieldName: string, content: string) {
        const editor = this.quillEditorFields[fieldName];
        if (editor && content) {
            editor.setText('');
            editor.clipboard.dangerouslyPasteHTML(content);
        }
    }

    // summarizeAssessment(data: any,years: string[], section: string) {
    //     if (!data || Object.keys(data).length === 0) {
    //         this.toastr.warning(`No data found for ${section}`);
    //         return;
    //     }
    //     const selectedYearsData: { [year: string]: any } = {};
    //     years.forEach((year: string) => {
    //         selectedYearsData[year] =  data?.[year]
    //     });
    //     const companyId =this.dataService.getCompanyId();

    //     this.isLoading = true;

    //     this.dataService.generateContent(selectedYearsData, section,this.currentModel,companyId).subscribe({
    //         next: (result: any) => {
    //             this.summaryResult = result.data;
    //             this.openPopup(this.summaryResult);
    //             this.isLoading = false;
    //         },
    //         error: (err) => {
    //             this.toastr.error(`Error generating summary ${section}:`, err);
    //             this.isLoading = false;
    //         },
    //     });
    // }

    summarizeAllSections() {
        const company_id = this.dataService.getCompanyId();
        this.isLoading = true;

        const profitLossPayload: { [year: string]: any } = {};
        this.profitLossYears.forEach((year) => {
            profitLossPayload[year] = this.profitLossData?.[year];
        });

        const balanceSheetPayload: { [year: string]: any } = {};
        this.balanceSheetYears.forEach((year) => {
            balanceSheetPayload[year] = this.balanceSheetdata?.[year];
        });

        const assetPayload: { [year: string]: any } = {};
        this.assetsYears.forEach((year) => {
            assetPayload[year] = this.assetsData?.[year];
        });

        forkJoin({
            profitLoss: this.dataService.generateContent(
                profitLossPayload,
                'profitLoss',
                this.currentModel,
                company_id
            ),
            balanceSheet: this.dataService.generateContent(
                balanceSheetPayload,
                'balanceSheet',
                this.currentModel,
                company_id
            ),
            asset: this.dataService.generateContent(
                assetPayload,
                'assets',
                this.currentModel,
                company_id
            ),
        }).subscribe({
            next: (results) => {
                this.summaryResult = {
                    profitLoss: results.profitLoss.data,
                    balanceSheet: results.balanceSheet.data,
                    asset: results.asset.data,
                };
                this.getFinancialObservations();
                this.isLoading = false;
            },
            error: (err) => {
                this.toastr.error('Error generating one or more summaries');
                console.error(err);
                this.isLoading = false;
            },
        });
    }

    openPopup(summaryResult: any): void {
        this.dialog.open(SummarizedPopupComponent, {
            disableClose: true,
            width: '600px',
            data: summaryResult,
        });
    }

    getFinancialObservations() {
        this.http
            .get<ApiResponse<string>>(
                `${
                    environment.baseURI
                }/custom-report/financial-analysis/${this.dataService.getCompanyId()}`
            )
            .subscribe((res) => {
                this.financialObservations = res.data;
                if (this.quillEditors['financialObservations']) {
                    this.setQuillContent(
                        'financialObservations',
                        this.financialObservations
                    );
                } else {
                    setTimeout(() => {
                        this.setQuillContent(
                            'financialObservations',
                            this.financialObservations
                        );
                    }, 300);
                }
            });
    }

    ngOnDestroy(): void {
        this.unitSubscription?.unsubscribe();
    }
}
