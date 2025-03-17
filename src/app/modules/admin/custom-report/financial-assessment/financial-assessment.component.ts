import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';
import { FinancialRatioService } from './financial-ratio.service';
import { CurrencyConversionService } from './currency-conversion.service';
import { ToastrService } from 'ngx-toastr';
import { ReportDataService } from '../services/report-data.service';

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
    ratioAnalysisYears: string[]  = [];
    subTotalData: { [year: string]: any } = {};
    currentUnit: string = 'INR';
    private unitSubscription: Subscription;
    private rawBalanceSheetdata: { [year: string]: any } = {};
    private rawSubTotalData: { [year: string]: any } = {};
    private rawAssetsData: { [year: string]: any } = {};
    private rawProfitLossData: { [year: string]: any } = {};
    private savedData: any;
    private originalData: string = '';

    constructor(
        private dataService: ReportDataService,
        private ratioService: FinancialRatioService,
        private currencyService: CurrencyConversionService,
        private toastr: ToastrService
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

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '300px',
        minHeight: '250px',
        placeholder: 'Enter financial observations here...',
        translate: 'no',
        sanitize: false,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [['insertVideo', 'insertImage']],
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
        this.savedData = this.dataService.getData('financial-assesment');
        this.companyData = this.dataService.getCompanyData();

        this.initializeData();
        this.subscribeToUnitChanges();

        if (this.savedData) {
            this.loadFromSavedData();
        }
        
        this.originalData = JSON.stringify(this.getData());
    }    

    hasUnsavedChanges(): boolean {
        const currentData = JSON.stringify(this.getData());
        return this.originalData !== currentData;
    }

    saveData() {
        const data = this.getData();
        console.log({data})
        this.dataService.setData('financial-assesment', data);
        this.toastr.success('Financial assessment data saved successfully');
        this.originalData = JSON.stringify(data);
    }

    private loadFromSavedData(): void {    
        console.log({savedData : this.savedData})
        this.financialData = this.savedData.financialData || this.financialData;
        this.rawProfitLossData = this.savedData.profitLossData || this.profitLossData;
        this.rawBalanceSheetdata = this.savedData.balanceSheetData || this.balanceSheetdata;
        this.rawSubTotalData = this.savedData.subTotalData || this.subTotalData;
        this.rawAssetsData = this.savedData.assetsData || this.assetsData;
    
        this.balanceSheetYears = this.savedData.balanceSheetYears || this.balanceSheetYears;
        this.assetsYears = this.savedData.assetsYears || this.assetsYears;
        this.profitLossYears = this.savedData.profitLossYears || this.profitLossYears;
        this.ratioAnalysisYears = this.savedData.ratioAnalysisYears || this.ratioAnalysisYears;
    
        this.displayeBalanceSheetYears = this.savedData.displayeBalanceSheetYears,
        this.displayAssetsYears = this.savedData.displayAssetsYears,
        this.displayProfitLossYears = this.savedData.displayProfitLossYears,
        this.financialObservations = this.savedData.financialObservations || this.financialObservations;

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
        const standaloneFinancials = latestFinancials.filter((item: any) => item.nature === 'STANDALONE');
    
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
                this.rawBalanceSheetdata[year] = entry.bs?.liabilities || {};
                this.rawSubTotalData[year] = entry.bs?.subTotals || {};
                this.rawAssetsData[year] = entry.bs?.assets || {};
                this.rawProfitLossData[year] = entry.pnl?.lineItems || {};
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
        this.balanceSheetdata = this.convertData(this.rawBalanceSheetdata, unit);
        this.subTotalData = this.convertData(this.rawSubTotalData, unit);
        this.assetsData = this.convertData(this.rawAssetsData, unit);
        this.profitLossData = this.convertData(this.rawProfitLossData, unit);

        this.financialData = this.financialData.map(item => {
            if (item.value && !isNaN(Number(item.value))) {
                const convertedValue = this.convertValue(Number(item.value), unit);
                return {
                    ...item,
                    value: this.formatDecimalValue(convertedValue)
                };
            }
            return item;
        });
    }

    private formatDecimalValue(value: number): string {
        return value.toFixed(2);
    }
    
    private convertData(data: { [year: string]: any }, unit: string): { [year: string]: any } {
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
            const convertedValue = unit ? this.convertValue(value, unit) : value;
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
            this.displayeBalanceSheetYears = [...this.balanceSheetYears].reverse();;
        }
        if (tableName === 'assets') {
            this.displayAssetsYears = [...this.assetsYears].reverse();;
        }
        if (tableName === 'profitLoss') {
            this.displayProfitLossYears = [...this.profitLossYears].reverse();;
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
            ratioAnalysisYears:this.ratioAnalysisYears,
            financialObservations:this.financialObservations,
            profitLossYears : this.profitLossYears,
            trunoverRatios : this.trunoverRatios,
        };
        return data;
    }

    ngOnDestroy(): void {
        this.unitSubscription?.unsubscribe();
    }
}
