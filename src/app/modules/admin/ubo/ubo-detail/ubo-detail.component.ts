import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UBOService } from '../ubo.service';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
    numOfMembers: string;
    sbo: string;
    sboId: {
        city: string;
        country: string;
        dateOfEntryOfNameInRegister: string;
        emailIdOfMember: string;
        entityIdOfMember: string;
        entityIdOfMorcOrMouh: string;
        entityIdOfUltHldCompOfBodyCorpOrBodyCorp: string;
        line1: string;
        line2: string;
        majStakeInMorcOrMouh: string;
        nameOfMorcOrMouh: string;
        nameOfTheMember: string;
        nameOfUltHldCompOfBodyCorpOrBodyCorp: string;
        pincode: string;
        sboHldByControl: string;
        sboHldByDividend: string;
        sboHldByInfluence: string;
        sboHldByVirOfShares: string;
        sboHldByVirOfVoting: string;
        state: string;
        statusOfSbo: string;
        typeOfMember: string;
        whtrIndSboIsPartnerOfTheMember: string;
    };
}

export interface UBODetails {
    entityId: string;
    entityName: string;
    beneficialOwnersThroughBen2: any[];
    finYear: string;
    coverage: number;
    isPartial: boolean;
    beneficialOwners: any[];
    nestedShareholdingPattern: {
        individualShareholders: any[];
        companyShareholders: any[];
    };
    totalEquityShares: number;
}

type BeneColumns = Record<string, string>;

@Component({
    selector: 'app-ubo-detail',
    templateUrl: './ubo-detail.component.html',
    styleUrls: ['./ubo-detail.component.scss'],
})
export class UboDetailComponent implements OnInit {
    uboId: string;
    uboDetails: any;
    isLoading: boolean = false;
    errorMessage: string = '';
    expandedBene2Rows: boolean[] = [];

    dataSource = new MatTableDataSource<UBODetails>([]);
    beneficialOwnersThroughBen2DataSource = new MatTableDataSource<any>([]);

    entityDisplayedColumns: string[] = [
        'entityId',
        'entityName',
        'coverage',
        'finYear',
        'beneficialOwners',
        'isPartial',
        'totalEquityShares',
    ];

    bene2ColumnsToDisplay: BeneColumns = {
        numOfMembers: '',
        sbo: '',
        addresssLineIIOfIndSbo: 'sboId',
        addresssLineIOfIndSbo: 'sboId',
        citizenshipOfIndSbo: 'sboId',
        cityOfIndSbo: 'sboId',
        countryOfIndSbo: 'sboId',
        dateOfDeclnOfIndSbo: 'sboId',
        dateOfReceiptOfDeclnByIndSbo: 'sboId',
        datesOfAcquiringOfIndSbo: 'sboId',
        datesOfBirthOfIndSbo: 'sboId',
        emailIdOfIndSbo: 'sboId',
        fathersFirstNameOfIndSbo: 'sboId',
        fathersLastNameOfIndSbo: 'sboId',
        fathersMiddleNameOfIndSbo: 'sboId',
        firstNameOfIndSbo: 'sboId',
        indSboHldByControl: 'sboId',
        indSboHldByDividend: 'sboId',
        indSboHldByInfluence: 'sboId',
        indSboHldByVirOfShares: 'sboId',
        indSboHldByVirOfVoting: 'sboId',
        lastNameOfIndSbo: 'sboId',
        middleNameOfIndSbo: 'sboId',
        nationalityOfIndSbo: 'sboId',
        panOfIndSbo: 'sboId',
        passportNumberOfIndSbo: 'sboId',
        pincodeOfIndSbo: 'sboId',
        sboId: 'sboId',
        stateOfIndSbo: 'sboId',
    };

    bene2TeamMemberDisplayedColumns: string[] = [
      "city",
      "country",
      "dateOfEntryOfNameInRegister",
      "emailIdOfMember",
      "entityIdOfMember",
      "entityIdOfMorcOrMouh",
      "entityIdOfUltHldCompOfBodyCorpOrBodyCorp",
      "line1",
      "line2",
      "majStakeInMorcOrMouh",
      "nameOfMorcOrMouh",
      "nameOfTheMember",
      "nameOfUltHldCompOfBodyCorpOrBodyCorp",
      "pincode",
      "sboHldByControl",
      "sboHldByDividend",
      "sboHldByInfluence",
      "sboHldByVirOfShares",
      "sboHldByVirOfVoting",
      "state",
      "statusOfSbo",
      "typeOfMember",
      "whtrIndSboIsPartnerOfTheMember",
    ];

    individualShareholdersDisplayedColumns: string[] = [
        'nameOfShareholder',
        'pan',
        'din',
        'equitySharesHeld',
        'percentageOfSharesHeld',
    ];

    companyShareholdersDisplayedColumns: string[] = [
        'nameOfShareholder',
        'cinPan',
        'equitySharesHeld',
        'percentageOfSharesHeld',
    ];

    expandedBene2Element: PeriodicElement | null;

    constructor(
        private route: ActivatedRoute,
        private apiService: UBOService
    ) {}

    ngOnInit(): void {
        this.uboId = this.route.snapshot.paramMap.get('id');
        if (this.uboId) {
            this.getUboDetails(this.uboId);
        }
    }

    toggleBene2Details(index: number): void {
        this.expandedBene2Rows[index] = !this.expandedBene2Rows[index];
    }

    humanizeCamelCase(text: string): string {
        return text
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Handle consecutive uppercase letters
            .replace(/\s+/g, ' ') // Remove extra spaces
            .trim() // Remove leading/trailing spaces
            .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
    }

    getBene2ColumnsToDisplay(): string[] {
        return Object.keys(this.bene2ColumnsToDisplay);
    }

    getBene2ColumnValue(element: any, column: string): any {
        const parentKey = this.bene2ColumnsToDisplay[column];
        return parentKey ? element[parentKey]?.[column] : element[column];
    }

    getUboDetails(id: string): void {
        this.isLoading = true;
        this.apiService.getUBOById(id).subscribe(
            (response) => {
                if (response && response.data) {
                    this.dataSource.data = [response.data]; // Convert object to array
                    this.beneficialOwnersThroughBen2DataSource.data =
                        response.data.beneficialOwnersThroughBen2;
                } else {
                    this.dataSource.data = [];
                }

                this.isLoading = false;
            },
            (error) => {
                console.error('Error fetching UBO details:', error);
                this.errorMessage = 'Failed to fetch UBO details.';
                this.isLoading = false;
            }
        );
    }
}
