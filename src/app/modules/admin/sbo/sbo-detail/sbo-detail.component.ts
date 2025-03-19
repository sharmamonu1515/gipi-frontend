import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SBOService } from '../sbo.service';
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

export interface SBODetails {
    entityId: string;
    companyName: string;
    ubo: any[];
    lastDownloaded: string;
    createdAt: string;
}

type BeneColumns = Record<string, string>;

@Component({
    selector: 'app-sbo-detail',
    templateUrl: './sbo-detail.component.html',
    styleUrls: ['./sbo-detail.component.scss'],
})
export class UboDetailComponent implements OnInit {
    sboId: string;
    sboDetails: any;
    isLoading: boolean = false;
    errorMessage: string = '';
    expandedBene2Rows: boolean[] = [];

    dataSource = new MatTableDataSource<SBODetails>([]);
    beneficialOwnersThroughBen2DataSource = new MatTableDataSource<any>([]);

    entityDisplayedColumns: string[] = [
        'entityId',
        'companyName',
        'lastDownloaded',
    ];

    uboColumnsToDisplay: string[] = [
        "copNumber",
        "entityIdOfHldRepComp",
        "membershipNum",
        "numberOfSbo",
        "purposeOfFiling",
        "whtrAssOrFel",
        "whtrChangeInSboUnderSec90",
        "whtrDeclnOfHldRepComp",
        "whtrDeclnOfSboUnderSec90",
        "whtrSignedByCaOrCsOrCostAcc",
    ];

    metaDataColumnsToDisplay: string[] = [
        "companyID",
        "categoryCode",
        "documentName",
        "dateOfFiling",
        "formId",
        "type",
        "docId",
        "lastUpdated",
        "docLink",
        "excelLink",
        "attachmentLink",
    ];

    sboColumnsToDisplay: BeneColumns = {
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
        private apiService: SBOService
    ) {}

    ngOnInit(): void {
        this.sboId = this.route.snapshot.paramMap.get('id');
        if (this.sboId) {
            this.getUboDetails(this.sboId);
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

    getsboColumnsToDisplay(): string[] {
        return Object.keys(this.sboColumnsToDisplay);
    }

    getColumnValue(element: any, column: string): any {
        const parentKey = this.sboColumnsToDisplay[column];
        return parentKey ? element[parentKey]?.[column] : element[column];
    }

    getUboDetails(id: string): void {
        this.isLoading = true;
        this.apiService.getSBOById(id).subscribe(
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
                console.error('Error fetching SBO details:', error);
                this.errorMessage = 'Failed to fetch SBO details.';
                this.isLoading = false;
            }
        );
    }
}
