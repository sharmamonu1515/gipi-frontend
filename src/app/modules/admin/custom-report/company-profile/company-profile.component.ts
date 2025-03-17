import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomReportService } from '../custom-report.service';
import {
    IBankCharge,
    ICreditRating,
    IEntitySection,
    IEPFOData,
    IFilteredRating,
    IKeyManagerPeron,
} from 'app/interfaces/custom-report';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ReportDataService } from '../services/report-data.service';

@Component({
    selector: 'app-company-profile',
    templateUrl: './company-profile.component.html',
    styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit, AfterViewInit {
    companyData: any;
    companyForm: FormGroup;
    operationalForm: FormGroup;
    colourBandForm: FormGroup;
    sustainibilityBandForm: FormGroup;
    gstDetails: any;
    keyManagerialPersons: IKeyManagerPeron[] = [];
    pastDirectors: IKeyManagerPeron[] = [];
    auditData: { [year: string]: any } = {};
    shareholdingData: { [year: string]: any } = {};
    shareholdingSummaryData: { [year: string]: any } = {};
    auditorYears: string[] = [];
    shareholdingSummaryYears: string[] = [];
    shareholdingYears: string[] = [];
    allMcaYears: string[] = [];
    displayedAuditorYears: string[] = [];
    displayedshareholdingYears: string[] = [];
    displayedshareholdingSummaryYears: string[] = [];
    allShareholdingYears: string[] = [];
    allShareholdingSummaryYears: string[] = [];
    allAuditorYears: string[] = [];
    directorsData: any;
    bankCharges: IBankCharge[] = [];
    mcaFilingColumns: string[] = [];
    mcaFiling = [{ particulars: '', data: [] }];
    mcaYears: any;
    displayedMcaYears: string[] = [];
    epfoDataList: IEPFOData[] = [];
    creditRatings: IFilteredRating[] = [];
    entityTypes: IEntitySection[] = [];
    filteredCharges: IBankCharge[] = [];
    showSatisfied: boolean = false;
    totalUniqueCharges: number = 0;
    keyManagerialPersonsCount = 0;
    pastDirectorsCount = 0;
    selectedOwnershipYears:string[]=[];
    private originalData: string = '';
    
    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dataService: ReportDataService,
        private toastr: ToastrService
    ) {}

    get formControls() {
        return this.companyForm.controls;
    }

    ngOnInit(): void {
        this.initializeForms();
        
        const savedData = this.dataService.getData('company-profile');
        
        this.companyData = this.dataService.getCompanyData();
    
        if (savedData) {
            this.loadFromSavedData(savedData);
        } else if (this.companyData) {
            this.ProcessCompanyData(this.companyData?.data);
        }

        this.originalData = JSON.stringify(this.getData());
    }    

    hasUnsavedChanges(): boolean {
        const currentData = JSON.stringify(this.getData());
        return this.originalData !== currentData;
    }

    private loadFromSavedData(savedData: any): void {
        this.companyForm.patchValue(savedData.companyForm);
        this.operationalForm.patchValue(savedData.operationalForm);
        
        this.gstDetails = savedData.gstDetails;
        this.keyManagerialPersons = savedData.keyManagerialPersons;
        this.pastDirectors = savedData.pastDirectors;
        this.directorsData = savedData.directorsData;
        this.auditData = savedData.auditData;
        
        this.allAuditorYears = savedData.allAuditorYears || [];
        this.auditorYears = savedData.auditorYears || [];
        this.displayedAuditorYears = savedData.auditorYears || [];
        
        this.allMcaYears = savedData.allMcaYears || [];
        this.mcaYears = savedData.mcaYears || [];
        this.displayedMcaYears = savedData.mcaYears || [];
        
        this.allShareholdingSummaryYears = savedData.allShareholdingSummaryYears || [];
        this.shareholdingSummaryYears = savedData.shareholdingSummaryYears || [];
        this.displayedshareholdingSummaryYears = savedData.shareholdingSummaryYears || [];
        
        this.allShareholdingYears = savedData.allShareholdingYears || [];
        this.shareholdingYears = savedData.shareholdingYears || [];
        this.displayedshareholdingYears = savedData.shareholdingYears || [];
        
        this.selectedOwnershipYears = savedData.selectedOwnershipYears || [];
        
        this.creditRatings = savedData.creditRating;
        this.mcaFiling = savedData.mcaFiling;
        this.filteredCharges = savedData.bankCharges;
        this.bankCharges = savedData.bankCharges; 
        this.epfoDataList = savedData.epfoDataList;
        this.entityTypes = savedData.entityTypes;
        this.shareholdingSummaryData = savedData.shareHoldingSummary;
        this.shareholdingData = savedData.shareHolding;
        
        this.keyManagerialPersonsCount = this.keyManagerialPersons.length;
        this.pastDirectorsCount = this.pastDirectors.length;
        
        this.updateTotalUniqueCharges();
    }

    private ProcessCompanyData(companyData: any) {
        this.getCreditratings(companyData?.credit_ratings);

        this.processCharges(companyData?.charge_sequence);

        this.patchFormValues(companyData);

        this.epfoDataList =
            companyData?.establishments_registered_with_epfo?.filter(
                (item: IEPFOData) =>
                    item.filing_details && item.filing_details.length > 0
            );

        this.entityTypes = [
            {
                type: 'Holding Entities',
                companies: companyData?.holding_entities?.company ?? [],
            },
            {
                type: 'Associate Entities',
                companies: companyData?.associate_entities?.company ?? [],
            },
            {
                type: 'Joint Ventures',
                companies: companyData?.joint_ventures?.company ?? [],
            },
            {
                type: 'Subsidiary Entities',
                companies: companyData?.subsidiary_entities?.company ?? [],
            },
        ]?.filter((section) => section.companies.length > 0);

        this.gstDetails = companyData?.gst_details?.map((detail: any) => ({
            gstin: detail.gstin,
            status: detail.status,
            state: detail.state,
        }));

        this.extractKeyManagerialPersons(companyData?.authorized_signatories);

        //auditor
        const latestFinancials = companyData?.financials;
        const standaloneFinancials = latestFinancials.filter(
            (item: any) => item.nature === 'STANDALONE'
        );

        const validFinancials = standaloneFinancials?.filter(
            (entry) => entry.auditor !== null
        );

        this.allAuditorYears = Array.from(
            new Set(
                validFinancials?.map((item) =>
                    new Date(item.year).getFullYear().toString()
                )
            )
        );

        //shareholding summary
        const shareholdingSummaryFinancials =
            companyData?.shareholdings_summary;

        this.allShareholdingSummaryYears = shareholdingSummaryFinancials?.map(
            (item) => item.year
        );

        this.allShareholdingSummaryYears = Array.from(
            new Set([...this.allShareholdingSummaryYears, ...this.allAuditorYears])
        );
        const yearsWithSummaryData = this. allShareholdingSummaryYears.filter(year =>
            shareholdingSummaryFinancials.some(entry => entry.year === year)
        );
        
        if (yearsWithSummaryData.length > 2) {
           
            this.shareholdingSummaryYears = yearsWithSummaryData.slice(0, 3).reverse();
        } else {
            this.shareholdingSummaryYears = yearsWithSummaryData.reverse();
        }

        this.displayedshareholdingSummaryYears = [
            ...this.shareholdingSummaryYears,
        ];

        this.shareholdingSummaryData = {};

        shareholdingSummaryFinancials?.forEach((entry) => {
            this.shareholdingSummaryData[entry.year] = entry;
        });
        this.displayedshareholdingSummaryYears.forEach((year) => {
            this.ensureYearDataExists(year);
        });

        //shareholding
        const shareholdingFinancials = companyData?.shareholdings || [];

        const equityEntries = shareholdingFinancials?.filter(
            (item) => item.category === 'equity'
        );

        this.allShareholdingYears = Array.from(
            new Set(equityEntries?.map((item) => item.year))
        );
        this.allShareholdingYears = Array.from(
            new Set([...this.allShareholdingYears, ...this.allAuditorYears])
        );
        const yearsWithData = this.allShareholdingYears.filter(year =>
            equityEntries.some(entry => entry.year === year)
        );
        
        if (yearsWithData.length > 2) {
           
            this.shareholdingYears = yearsWithData.slice(0, 3).reverse();
        } else {
            this.shareholdingYears = yearsWithData.reverse();
        }

        this.displayedshareholdingYears = [...this.shareholdingYears];

        this.shareholdingData = {};

        this.allShareholdingYears?.forEach((year) => {
            this.shareholdingData[year] = {
                promoter: {},
                public: {},
            };
        });
        this.allShareholdingYears.forEach((year) => {
            this.ensureOwnershipYearDataExists(year);
        });
        equityEntries?.forEach((entry) => {
            if (entry.shareholders === 'promoter') {
                this.shareholdingData[entry.year].promoter = entry;
            } else if (entry.shareholders === 'public') {
                this.shareholdingData[entry.year].public = entry;
            }
        });

        this.allMcaYears = [...this.allAuditorYears];
        this.mcaYears = this.allMcaYears.slice(0, 3).reverse();
        this.auditorYears = this.allAuditorYears.slice(0, 3).reverse();
        this.displayedAuditorYears = [...this.auditorYears];
        this.displayedMcaYears = [...this.mcaYears];
        this.auditData = {};

        validFinancials?.forEach((entry) => {
            this.auditData[new Date(entry.year).getFullYear().toString()] =
                entry?.auditor;
        });
    }

    private patchFormValues(companyData: any) {
        const companyDetails = companyData?.company;
        const description = companyData?.description;
        this.directorsData = companyData?.director_network;

        const fullAddress = [
            companyDetails?.business_address?.address_line1,
            companyDetails?.business_address?.address_line2,
            companyDetails?.business_address?.city,
            companyDetails?.business_address?.state,
            companyDetails?.business_address?.pincode,
        ]
            ?.filter(Boolean)
            .join(', ');

        const incorporationDate = companyDetails?.incorporation_date;
        const incorporationYear = new Date(incorporationDate).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - incorporationYear;
        const formattedIncorporationDate = `${age} Years (${incorporationDate})`;

        this.companyForm.patchValue({
            legal_name: companyDetails.legal_name,
            reportNo: companyDetails.reportNo,
            cin: companyDetails.cin,
            age: formattedIncorporationDate,
            status: companyDetails.status,
            type: companyDetails.classification,
            subCategory: companyDetails.subCategory,
            email: companyDetails.email,
            website: companyDetails.website,
            //industry: companyData?.industry_segments[0]?.industry,
            //sic: companyDetails.sic,
            description: description.desc_thousand_char,
            balanceSheetDate: companyDetails.balanceSheetDate,
            paidUpCapital: companyDetails.paid_up_capital,
            profitLoss: companyDetails.profitLoss,
            openCharges: companyDetails.sum_of_charges,
            directorSignatory: companyDetails.directorSignatory,
            activeCompliance: companyDetails.active_compliance,
            companyAddress: fullAddress,
            statutoryReg: 'PAN:  ' + companyDetails.pan,
            correspondenceAddress: companyDetails.correspondenceAddress,
            contactNo: `${
                companyData?.contact_details?.phone[0]?.phoneNumber || ''
            }${
                companyData?.contact_details?.phone[1]
                    ? ', ' + companyData.contact_details.phone[1].phoneNumber
                    : ''
            }`.trim(),
            listing: companyDetails.status,
            mainGroup: companyData?.industry_segments[0]?.industry,
            subGroup: `${companyData?.industry_segments[0]?.segments[0] || ''}${
                companyData?.industry_segments[0]?.segments[1]
                    ? ', ' + companyData.industry_segments[0].segments[1]
                    : ''
            }`.trim(),
        });

        this.operationalForm.patchValue({
            companyAuditor: companyDetails.auditor_name,
            employeeAcross: companyDetails.number_of_employees,
        });
    }

    private initializeForms() {
        this.companyForm = this.createForm([
            'legal_name',
            'reportNo',
            'cin',
            'age',
            'status',
            'type',
            'subCategory',
            'email',
            'website',
            'industry',
            'sic',
            'description',
            'balanceSheetDate',
            'paidUpCapital',
            'profitLoss',
            'openCharges',
            'directorSignatory',
            'activeCompliance',
            'companyAddress',
            'statutoryReg',
            'correspondenceAddress',
            'contactNo',
            'listing',
            'mainGroup',
            'subGroup',
        ]);

        this.operationalForm = this.createForm([
            'employeeAcross',
            'taxPayer',
            'customerNo',
            'businessGroup',
            'employeesLocation',
            'companyAuditor',
            'cuatomerTypes',
            'otherentities',
        ]);
    }

    extractKeyManagerialPersons(data: IKeyManagerPeron[]) {
        data?.forEach((detail: IKeyManagerPeron) => {
            const directorInfo = {
                companyDirectors: detail.name,
                din: detail.din,
                designation: detail.designation,
                appointmentDate:
                    detail.date_of_appointment_for_current_designation,
            };

            if (detail?.date_of_cessation === null) {
                this.keyManagerialPersons.push(directorInfo);
            } else {
                this.pastDirectors.push({
                    ...directorInfo,
                    cessationDate: detail.date_of_cessation,
                });
                this.keyManagerialPersonsCount =
                    this.keyManagerialPersons.length;
                this.pastDirectorsCount = this.pastDirectors.length;
            }
        });
    }

    getCreditratings(ratings: ICreditRating[]) {
        if (ratings.length > 0) {
            const firstYear = new Date(ratings[0].rating_date).getFullYear();

            this.creditRatings = ratings
                .flatMap((entry) =>
                    entry.rating_details.map((detail) => ({
                        rating_agency: entry.rating_agency,
                        rating_date: entry.rating_date,
                        rating: detail.rating,
                        action: detail.action,
                        outlook: detail.outlook,
                        type_of_loan: entry.type_of_loan,
                        currency: entry.currency,
                        amount: entry.amount,
                    }))
                )
                ?.filter(
                    (rating) =>
                        new Date(rating.rating_date).getFullYear() === firstYear
                );
        }
    }

    updateDisplayedYears(tabName: string) {
        if (tabName == 'auditor') {
            this.displayedAuditorYears = [...this.auditorYears].reverse();
        } else if (tabName == 'mca') {
            this.displayedMcaYears = [...this.mcaYears].reverse();
        } else if (tabName === 'summary') {
            this.displayedshareholdingSummaryYears = [
                ...this.shareholdingSummaryYears,
            ].reverse();

            this.displayedshareholdingSummaryYears.forEach((year) => {
                this.ensureYearDataExists(year);
            });
        } else if (tabName === 'shareholding') {
            this.displayedshareholdingYears = [
                ...this.shareholdingYears
            ].reverse();

            this.displayedshareholdingYears.forEach((year) => {
                this.ensureOwnershipYearDataExists(year);
            });
        }
    }

    ensureYearDataExists(year: string) {
        if (!this.shareholdingSummaryData[year]) {
            this.shareholdingSummaryData[year] = {
                financial_year: '',
                promoter: '',
                public: '',
                total: '',
                total_preference_shares: '',
                total_equity_shares: '',
            };
        }
    }
    ensureOwnershipYearDataExists(year: string) {
        if (!this.shareholdingData[year]) {
            this.shareholdingData[year] = {
                promoter: {},
                public: {},
            };

            const fields = [
                'bank_held_percentage_of_shares',
                'body_corporate_held_percentage_of_shares',
                'central_government_held_percentage_of_shares',
                'financial_institutions_held_percentage_of_shares',
                'financial_institutions_investors_held_percentage_of_shares',
                'foreign_held_other_than_nri_percentage_of_shares',
                'government_company_held_percentage_of_shares',
                'indian_held_percentage_of_shares',
                'insurance_company_held_percentage_of_shares',
                'mutual_funds_held_percentage_of_shares',
                'nri_held_percentage_of_shares',
                'others_held_percentage_of_shares',
                'state_government_held_percentage_of_shares',
                'venture_capital_held_percentage_of_shares',
                'total_percentage_of_shares',
            ];

            fields.forEach((field) => {
                this.shareholdingData[year].promoter[field] = '';
                this.shareholdingData[year].public[field] = '';
            });
        }
    }

    private createForm(fields: string[]): FormGroup {
        const formGroup = this.fb.group({});
        fields.forEach((field) =>
            formGroup.addControl(field, this.fb.control(''))
        );
        return formGroup;
    }

    addRow(tab: string) {
        // if (tab == 'bankCharges') {
        //     this.bankCharges.push({
        //         holder_name: '',
        //         charge_id: null,
        //         amount: null,
        //         date: '',
        //         status: '',
        //         property_particulars: '',
        //     });
        // } 
        if (tab == 'mca') {
            this.mcaFiling.push({
                particulars: '',
                data: new Array(this.mcaFilingColumns.length).fill(''),
            });
        }
    }

    processCharges(charges: IBankCharge[]) {
        const chargeMap = new Map<number, IBankCharge[]>();

        charges.forEach((charge) => {
            if (!chargeMap.has(charge.charge_id)) {
                chargeMap.set(charge.charge_id, [charge]);
            } else {
                chargeMap.get(charge.charge_id)!.push(charge);
            }
        });

        const latestCharges = new Map<number, IBankCharge>();

        chargeMap.forEach((chargeList, chargeId) => {
            chargeList.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            const latestEntry = chargeList[0];
            const latestCreation = chargeList.find(
                (c) => c.status === 'Creation'
            );
            const latestModification = chargeList.find(
                (c) => c.status === 'Modification'
            );
            const latestSatisfaction = chargeList.find(
                (c) => c.status === 'Satisfaction'
            );

            latestEntry.creation_date = latestCreation
                ? latestCreation.date
                : '';
            latestEntry.filing_date = latestModification
                ? latestModification.date
                : '';
            latestEntry.satisfaction_date = latestSatisfaction
                ? latestSatisfaction.date
                : '';

            latestCharges.set(chargeId, latestEntry);
        });

        this.bankCharges = Array.from(latestCharges.values());
        this.updateTotalUniqueCharges();
        this.filterData();
    }

    updateTotalUniqueCharges() {
        if (this.showSatisfied) {
            this.totalUniqueCharges = this.bankCharges.length;
        } else {
            this.totalUniqueCharges = this.bankCharges.filter(
                (charge) => charge.status !== 'Satisfaction'
            ).length;
        }
    }

    filterData() {
        const chargeMap = new Map<number, IBankCharge>();

        this.bankCharges.forEach((charge) => {
            if (this.showSatisfied) {
                chargeMap.set(charge.charge_id, charge);
            } else {
                const originalGroup = this.bankCharges.filter(
                    (c) => c.charge_id === charge.charge_id
                );
                if (!originalGroup.some((c) => c.status === 'Satisfaction')) {
                    chargeMap.set(charge.charge_id, charge);
                }
            }
        });

        this.filteredCharges = Array.from(chargeMap.values());
        this.updateTotalUniqueCharges();
    }

    getStatusPriority(status: string): number {
        switch (status) {
            case 'Satisfaction':
                return 3;
            case 'Modification':
                return 2;
            case 'Creation':
                return 1;
            default:
                return 0;
        }
    }

    getData() {
        const data = {
            companyForm: this.companyForm.value,
            operationalForm: this.operationalForm.value,
            gstDetails: this.gstDetails,
            keyManagerialPersons: this.keyManagerialPersons,
            pastDirectors: this.pastDirectors,
            directorsData: this.directorsData,
            auditData: this.auditData,
            auditorYears: this.displayedAuditorYears,
            creditRating: this.creditRatings,
            mcaFiling: this.mcaFiling,
            mcaYears: this.displayedMcaYears,
            bankCharges: this.filteredCharges,
            epfoDataList: this.epfoDataList,
            entityTypes: this.entityTypes,
            shareHoldingSummary:this.shareholdingSummaryData,
            shareholdingSummaryYears:this.displayedshareholdingSummaryYears,
            shareHolding:this.shareholdingData,
            shareholdingYears:this.displayedshareholdingYears,
            allAuditorYears: this.allAuditorYears,
            allMcaYears: this.allMcaYears, 
            allShareholdingSummaryYears: this.allShareholdingSummaryYears,
            allShareholdingYears: this.allShareholdingYears,
            selectedOwnershipYears: this.selectedOwnershipYears
        };
        return data;
    }

    getFirst6FilingDetails(filingDetails: any[]): any[] {
        return filingDetails?.slice(0, 6) || [];
    }

    formatFieldName(field: string): string {
        return field
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    openDeleteDialog(index: number, tab: string) {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            width: '350px',
            data: { message: 'Are you sure you want to delete this row?' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.deleteRow(index, tab);
            }
        });
    }
    deleteRow(index: number, tab: string): void {
        if (tab == 'mca') {
            this.mcaFiling.splice(index, 1);
            this.toastr.success('Row deleted successfully!');
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.companyForm.patchValue({
                directorSignatory: `Current: ${this.keyManagerialPersonsCount}  (Past: ${this.pastDirectorsCount})`,
            });
        });
    }

    saveData() {
        const data = this.getData();
        this.dataService.setData('company-profile', data);
        this.toastr.success('Company Profile data saved successfully');
        this.originalData = JSON.stringify(data);
    }

}
