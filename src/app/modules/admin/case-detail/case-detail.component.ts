import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseUtilsService } from '@fuse/services/utils';

@Component({
    selector: 'app-case-detail',
    templateUrl: './case-detail.component.html',
    styleUrls: ['./case-detail.component.scss'],
})
export class CaseDetailComponent implements OnInit {
    caseDetails: any;
    court: string;
    panelOpenState = false;
    parties: any = [];
    tableConfigs: { title: string; dataSource: { field1: string; value1: any; field2?: string; value2?: any }[] }[] = [];

    caseDetailsColumns = {
        cino: 'CINO',
        cnrNumber: 'CNR Number',
        casetypeCaseNoCaseYr: 'Case Type | CaseNo | Case Year',
        caseType: 'Case Type',
        standardCaseType: 'Standard Case Type',
        filingNumber: 'Filing Number',
        filingDate: 'Filing Date',
        registrationNumber: 'Registration Number',
        registrationDate: 'Registration Date',
        judges: 'Judges',
        civilCriminal: 'Civil/Criminal',
        courtEstablishment: 'Court Establishment',
        courtComplex: 'Court Complex',
        standardCaseTypeCategory: 'Standard Case Type Category',
        standardStageOfCase: 'Standard Stage of Case',
    };

    caseStatusColumns = {
        firstHearingDate: 'First Hearing Date',
        decisionDate: 'Decision Date',
        natureOfDisposal: 'Nature of Disposal',
        caseStatus: 'Case Status',
        courtNumberAndJudge: 'Court No | Judge',
        courtNumber: 'Court No',
        districtCode: 'District Code',
        stageOfCase: 'Stage of Case',
        stateCode: 'State Code',
        district: 'District',
        state: 'State',
    };

    subordinateColumns = [
        // 'courtNumberAndName', //
        // 'courtType',
        // 'state',
        // 'casetypeCaseNoCaseYr',
        // 'caseNumberAndYear',
        // 'caseDecisionDate',
        // 'crimeNumber',
        // 'policeStation',
        // 'district',
        // 'judge',
        // 'judgeDesignation',
        // 'judgementLang',
        // 'assesmentYear',
        // 'taxAmtInvolved',
    ];

    historyOfCaseHearingsColumns = [
        // 'causeListType', //
        // 'judges',
        // 'action',
        // 'latestOrder',
        // 'lastActionTaken',
        // 'businessOnDate',
        // 'hearingDate',
        // 'purposeOfHearing',
        // 'standardPurposeOfHearing',
        // 'courtNo',
    ];

    additionalTablesToShow = ['linkedCases', 'notice', 'caveat'];

    constructor(@Inject(MAT_DIALOG_DATA) public injectedData: any, private utils: FuseUtilsService) {}

    ngOnInit(): void {
        this.caseDetails = this.injectedData.caseDetails;
        this.court = this.injectedData.court;

        this.parties = [
            { title: 'Petitioner and Advocate Details', data: this.caseDetails.petitionerAndAdvocate },
            { title: 'Respondent and Advocate Details', data: this.caseDetails.respondentAndAdvocate },
        ];

        // Create data sources using reusable function
        const caseDetailsDataSource = this.createDataSource(this.caseDetailsColumns, this.caseDetails);
        const caseStatusDataSource = this.createDataSource(this.caseStatusColumns, this.caseDetails);

        // Configure tables for dynamic rendering
        this.tableConfigs = [
            { title: 'Case Details', dataSource: caseDetailsDataSource },
            { title: 'Case Status', dataSource: caseStatusDataSource },
        ];

        this.subordinateColumns = this.getColumnsToDisplay('subordinateCourtInfo');
        this.historyOfCaseHearingsColumns = this.getColumnsToDisplay('historyOfCaseHearing');
    }

    getColumnsToDisplay(key: string): string[] {
        return this.caseDetails[key] ? Object.keys(this.caseDetails[key][0]) : [];
    }

    private createDataSource(columns: { [key: string]: string }, data: any): { field1: string; value1: any; field2?: string; value2?: any }[] {
        const keys = Object.keys(columns);
        const dataSource: { field1: string; value1: any; field2?: string; value2?: any }[] = [];
        for (let i = 0; i < keys.length; i += 2) {
            const row: { field1: string; value1: any; field2?: string; value2?: any } = {
                field1: columns[keys[i]],
                value1: data[keys[i]],
            };
            if (i + 1 < keys.length) {
                row.field2 = columns[keys[i + 1]];
                row.value2 = data[keys[i + 1]];
            }
            dataSource.push(row);
        }
        return dataSource;
    }

    printDialogContent(): void {
        const dialogContent = document.querySelector('mat-dialog-content')?.innerHTML;
        if (!dialogContent) {
            console.error('Dialog content not found');
            return;
        }

        const originalBody = document.body.innerHTML;

        // Get styles from the current document, filtering relevant ones
        const styles = Array.from(document.styleSheets)
            .map((sheet) => {
                try {
                    return Array.from(sheet.cssRules)
                        .filter((rule) => rule.cssText.includes('.mat-') || rule.cssText.includes('.wrap-text') || rule.cssText.includes('.card'))
                        .map((rule) => rule.cssText)
                        .join('\n');
                } catch (e) {
                    return '';
                }
            })
            .join('\n');

        // Write the print content
        document.body.innerHTML = `
            <style>
              ${styles}
              /* Print-specific styles */
              @page { margin: 5mm; }
              .wrap-text {
                overflow-wrap: break-word;
                word-break: break-word;
                max-width: 180px;
                white-space: normal;
              }
              .table-responsive {
                width: 100%;
                overflow-x: unset !important;
              }
              table { 
                width: 100% !important;
                table-layout: fixed !important;
                border-collapse: collapse !important;
                word-wrap: break-word;
                margin-bottom: 0 !important;
                white-space: wrap !important;
                line-height: 1.2 !important;
              }
              tr, tr.mat-row { 
                page-break-inside: avoid; 
                page-break-after: auto; 
                height: auto !important;
              }
              th, td, th.wrap-text, td.wrap-text {
                word-break: break-word !important;
                padding: 6px;
                border: 1px solid #ccc;
                font-size: 12px !important;
              }
              .card { 
                margin-bottom: 20px; 
                page-break-inside: avoid; 
              }
              mat-expansion-panel { 
                display: block; 
                margin-bottom: 20px; 
                page-break-inside: avoid; 
              }
              mat-expansion-panel-header {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                border-bottom: 2px solid rgb(2, 132, 199);
                background: white !important; 
              }
              .mat-expansion-indicator {
                display: none !important;
              }
              .mat-expansion-panel-body {
                padding: 10px !important;
              }
              @page {
                size: landscape;
              }
            </style>
            ${dialogContent}
      `;

        document.querySelector('html').classList.remove('cdk-global-scrollblock');

        window.print();
        window.close();
    }
}
