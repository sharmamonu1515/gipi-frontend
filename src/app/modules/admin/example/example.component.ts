import { Component, ViewEncapsulation, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { merge, Observable, of as observableOf, Subject } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ExampleService } from './example.service';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { FuseConfirmationService } from '@fuse/services/confirmation';
/**
 * @title Table retrieving data through HTTP
 */

@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ExampleComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['createdAt', 'cin', 'name', 'action'];
  data: any[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  mcaSearchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private apiService: ExampleService,
    private router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Subscribe to search input field value changes
    this.mcaSearchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoadingResults = true;
          console.log("Search Value", this.mcaSearchInputControl.value)
          return this.apiService.getMcaList(
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
          return this.apiService.getMcaList(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.mcaSearchInputControl.value
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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '25%',
      // height: '68%',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    });
  }

  mcaDetailsRoute(id) {
    this.router.navigateByUrl(`/mca-individual/details/${id}`)
  }

  exportExcel(element) {
    let companyMainData = [];

    companyMainData.push(['CIN', element['companyData']['CIN'] ? element['companyData']['CIN'] : 'NA']);
    companyMainData.push(['Company Name', element['companyData']['company'] ? element['companyData']['company'] : 'NA']);
    companyMainData.push(['ROC Code', element['companyData']['rocName'] ? element['companyData']['rocName'] : 'NA']);
    companyMainData.push(['Registration Number', element['companyData']['registrationNumber'] ? element['companyData']['registrationNumber'] : 'NA']);
    companyMainData.push(['Company Category', element['companyData']['companyCategory'] ? element['companyData']['companyCategory'] : 'NA']);
    companyMainData.push(['Company SubCategory', element['companyData']['companySubcategory'] ? element['companyData']['companySubcategory'] : 'NA']);
    companyMainData.push(['Class of Company', element['companyData']['classOfCompany'] ? element['companyData']['classOfCompany'] : 'NA']);
    companyMainData.push(['Authorised Capital(Rs)', element['companyData']['authorisedCapital'] ? element['companyData']['authorisedCapital'] : 'NA']);
    companyMainData.push(['Paid up Capital(Rs)', element['companyData']['paidUpCapital'] ? element['companyData']['paidUpCapital'] : 'NA']);
    companyMainData.push(['Number of Members(Applicable in case of company without Share Capital)', element['companyData']['numberOfMembers)'] ? element['companyData']['numberOfMembers)'] : 'NA']);
    companyMainData.push(['Date of Incorporation', element['companyData']['dateOfIncorporation'] ? element['companyData']['dateOfIncorporation'] : 'NA']);
    companyMainData.push(['Registered Address', element.companyData.MCAMDSCompanyAddress.length > 0 ? `${element?.companyData?.MCAMDSCompanyAddress[0]?.streetAddress} ${element?.companyData?.MCAMDSCompanyAddress[0]?.city}, ${element?.companyData?.MCAMDSCompanyAddress[0]?.state}, ${element?.companyData?.MCAMDSCompanyAddress[0]?.country}, ${element?.companyData?.MCAMDSCompanyAddress[0]?.postalCode}` : 'NA']);
    companyMainData.push(['Email Id', element['companyData']['emailAddress'] ? element['companyData']['emailAddress'] : 'NA']);
    companyMainData.push(['Whether Listed or not', element?.companyData?.whetherListedOrNot === 'N' ? 'Unlisted' : 'Listed']);
    companyMainData.push(['Date of last AGM', element['companyData']['dateOfLastAGM'] ? element['companyData']['dateOfLastAGM'] : 'NA']);
    companyMainData.push(['Date of Balance Sheet', element['companyData']['balanceSheetDate'] ? element['companyData']['balanceSheetDate'] : 'NA']);
    companyMainData.push(['ACTIVE compliance', element['companyData']['inc22Aflag'] ? element['companyData']['inc22Aflag'] === 'Y' ? 'ACTIVE Non-Compliant' : 'ACTIVE Compliant' : 'NA']);
    companyMainData.push(['Company Status', element['companyData']['llpStatus'] ? element['companyData']['llpStatus'] : 'NA']);

    // Create workbook and worksheet
    const workbook = new Excel.Workbook();;
    const worksheet = workbook.addWorksheet('Master Data', {
      properties: { tabColor: { argb: 'FFC0000' } },
    });


    /**
     * EXCEL HEADIND
     */

    worksheet.addRow([`Company Master Data :: ${element.companyId}`]);
    // merge a range of cells
    worksheet.mergeCells('A1:B1',);
    worksheet.getCell('B1').style.font = {
      name: 'Comic Sans MS',
      family: 4,
      size: 12,
      underline: true,
      bold: true
    };
    worksheet.getCell('B1').fill = {
      type: 'pattern',
      pattern: 'darkTrellis',
      fgColor: { argb: 'FFFFFF00' },
      bgColor: { argb: 'FF0000FF' }
    };
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };

    for (let i = 0; i < companyMainData.length; i++) {
      worksheet.addRow(companyMainData[i]);
      // set cell to font
      worksheet.getCell(`A${i + 2}}`).style.font = {
        bold: true
      };
      // set cell to wrap-text
      worksheet.getCell(`A${i + 2}}`).alignment = { wrapText: true };

      // set cell to wrap-text
      worksheet.getCell(`B${i + 2}}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    }

    worksheet.getColumn(1).width = 40;
    worksheet.getColumn(2).width = 60;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;

    worksheet.addRow([]);
    worksheet.addRow([]);

    // Charges Data
    // worksheet.addRow(['Charges']);
    // // merge a range of cells
    // worksheet.mergeCells(`A${worksheet.lastRow['_number']}:E${worksheet.lastRow['_number']}`,);
    // worksheet.getCell(`E${worksheet.lastRow['_number']}`).style.font = {
    //   name: 'Comic Sans MS',
    //   family: 4,
    //   size: 12,
    //   underline: true,
    //   bold: true
    // };
    // worksheet.getCell(`E${worksheet.lastRow['_number']}`).fill = {
    //   type: 'pattern',
    //   pattern: 'darkTrellis',
    //   fgColor: { argb: 'FFFFFF00' },
    //   bgColor: { argb: 'FF0000FF' }
    // };
    // worksheet.getCell(`E${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };

    // // ADD Charges Header
    // worksheet.addRow(['Assets Under Charge', 'Charge Amount', 'Date of Creation', 'Date of Modification', 'Status']).font = {
    //   bold: true
    // };
    // worksheet.getCell(`A${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(`B${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(`C${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(`D${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(`E${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };

    // // ADD Charges Value
    // if (element.chargesValue.length === 0) {

    //   worksheet.addRow(['No Charges Exists for Company/LLP']);
    //   worksheet.mergeCells(`A${worksheet.lastRow['_number']}:E${worksheet.lastRow['_number']}`,);
    //   worksheet.getCell(`E${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

    // } else {
    //   for (let charges = 0; charges < element['chargesValue'].length; charges++) {
    //     worksheet.addRow([
    //       element['chargesValue'][charges]['Assets under charge'],
    //       element['chargesValue'][charges]['Charge Amount'],
    //       element['chargesValue'][charges]['Date of Creation'],
    //       element['chargesValue'][charges]['Date of Modification'],
    //       element['chargesValue'][charges]['Status']
    //     ]).alignment = {
    //       wrapText: true, vertical: 'middle', horizontal: 'center'
    //     };
    //   }
    // }

    // worksheet.addRow([]);
    // worksheet.addRow([]);

    // Index Charges Data
    worksheet.addRow(['Index Of Charges Registered']);
    // merge a range of cells
    worksheet.mergeCells(`A${worksheet.lastRow['_number']}:I${worksheet.lastRow['_number']}`,);
    worksheet.getCell(`I${worksheet.lastRow['_number']}`).style.font = {
      name: 'Comic Sans MS',
      family: 4,
      size: 12,
      underline: true,
      bold: true
    };
    worksheet.getCell(`I${worksheet.lastRow['_number']}`).fill = {
      type: 'pattern',
      pattern: 'darkTrellis',
      fgColor: { argb: 'FFFFFF00' },
      bgColor: { argb: 'FF0000FF' }
    };
    worksheet.getCell(`I${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };

    // ADD Index Charges Header
    worksheet.addRow([
      'SNo',
      'SRN',
      'Charge Id',
      'Charge Holder Name',
      'Date of Creation',
      'Date of Modification',
      'Date of Satisfaction',
      'Amount',
      'Address'
    ]).font = {
      bold: true
    };
    worksheet.getCell(`A${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`B${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`C${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`D${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`E${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`G${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`H${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`I${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };

    // ADD Index Charges Value
    if (!element['indexObjValue'] || element['indexObjValue'] && element['indexObjValue'].length == 0) {
      worksheet.addRow(['No Index of Charges Exists for Company/LLP']);
      worksheet.mergeCells(`A${worksheet.lastRow['_number']}:I${worksheet.lastRow['_number']}`,);
      worksheet.getCell(`I${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

    } else {
      for (let charges = 0; charges < element['indexObjValue'].length; charges++) {
        worksheet.addRow([
          element['indexObjValue'][charges]['SNo'],
          element['indexObjValue'][charges]['SRN'],
          element['indexObjValue'][charges]['Charge Id'],
          element['indexObjValue'][charges]['Charge Holder Name'],
          element['indexObjValue'][charges]['Date of Creation'],
          element['indexObjValue'][charges]['Date of Modification'],
          element['indexObjValue'][charges]['Date of Satisfaction'],
          element['indexObjValue'][charges]['Amount'],
          element['indexObjValue'][charges]['Address']
        ])

        let getPreviousCell = worksheet.getCell(`I${worksheet.lastRow['_number']}`);

        worksheet.getRow(getPreviousCell['_row']['_number']).alignment = {
          wrapText: true, vertical: 'middle', horizontal: 'center'
        }

        worksheet.getRow(getPreviousCell['_row']['_number']).font = {
          // color: {argb: element['indexObjValue'][charges]['class'] === 'green' ? '32C732' : element['indexObjValue'][charges]['class'] === 'red' ? 'FF3D33' : '000000' }
          color: { argb: element['indexObjValue'][charges]['class'] === 'green' ? '32C732' : 'FF3D33' }
        }

      }
    }

    worksheet.addRow([]);
    worksheet.addRow([]);

    // ADD Directory/Signatory Details
    worksheet.addRow(['Directors/Signatory Details']);
    // merge a range of cells
    worksheet.mergeCells(`A${worksheet.lastRow['_number']}:G${worksheet.lastRow['_number']}`,);
    worksheet.getCell(`G${worksheet.lastRow['_number']}`).style.font = {
      name: 'Comic Sans MS',
      family: 4,
      size: 12,
      underline: true,
      bold: true
    };
    worksheet.getCell(`G${worksheet.lastRow['_number']}`).fill = {
      type: 'pattern',
      pattern: 'darkTrellis',
      fgColor: { argb: 'FFFFFF00' },
      bgColor: { argb: 'FF0000FF' }
    };
    worksheet.getCell(`G${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };

    // ADD Directory/Signatory Header
    worksheet.addRow(['Sr. No', 'DIN/PAN', 'Name', 'Designation', 'Date of Appointment', 'Cessation Date', 'Signatory']).font = {
      bold: true
    };
    worksheet.getCell(`A${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`B${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`C${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`D${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`E${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`G${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };

    // ADD Directory/Signatory Values

    for (let signatory = 0; signatory < element['filteredDirectorData'].length; signatory++) {
      worksheet.addRow([
        element['filteredDirectorData'][signatory]['serialNumber'],
        element['filteredDirectorData'][signatory]['dinPanValue'],
        element['filteredDirectorData'][signatory]['name'],
        element['filteredDirectorData'][signatory]['designation'],
        element['filteredDirectorData'][signatory]['dateOfAppointment'] ? `${new Date(element['filteredDirectorData'][signatory]['dateOfAppointment']).getDate().toString().padStart(2, '0')}/${(new Date(element['filteredDirectorData'][signatory]['dateOfAppointment']).getMonth() + 1).toString().padStart(2, '0')}/${new Date(element['filteredDirectorData'][signatory]['dateOfAppointment']).getFullYear()}` : 'NA',
        element['filteredDirectorData'][signatory]['cessationDate'],
        element['filteredDirectorData'][signatory]['signatory']
      ]).alignment = {
        wrapText: true, vertical: 'middle', horizontal: 'center'
      };
    }

    worksheet.addRow([]);
    worksheet.addRow([]);

    // ADD List of Signatories Details
    // worksheet.addRow(['List of Signatories']);
    // merge a range of cells
    // worksheet.mergeCells(`A${worksheet.lastRow['_number']}:F${worksheet.lastRow['_number']}`,);
    // worksheet.getCell(`F${worksheet.lastRow['_number']}`).style.font = {
    //   name: 'Comic Sans MS',
    //   family: 4,
    //   size: 12,
    //   underline: true,
    //   bold: true
    // };
    // worksheet.getCell(`F${worksheet.lastRow['_number']}`).fill = {
    //   type: 'pattern',
    //   pattern: 'darkTrellis',
    //   fgColor: { argb: 'FFFFFF00' },
    //   bgColor: { argb: 'FF0000FF' }
    // };
    // worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };

    // ADD List of Signatories Header
    // worksheet.addRow([
    //   'Full Name',
    //   'DIN/DPIN/PAN',
    //   'Designation',
    //   'Date of Appointment',
    //   'Whether DSC Registered',
    //   'Expiry Date of DSC'
    //   // 'Surrendered DIN'
    // ]).font = {
    //   bold: true
    // };
    // worksheet.getCell(`A${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(`B${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(`C${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(`D${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(`E${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };

    // ADD List of Signatories Values

    // for (let signatoryList = 0; signatoryList < element['detailedSignatoryMcaDetails'].length; signatoryList++) {
    //   worksheet.addRow([
    //     element['detailedSignatoryMcaDetails'][signatoryList]['name'],
    //     element['detailedSignatoryMcaDetails'][signatoryList]['din'],
    //     element['detailedSignatoryMcaDetails'][signatoryList]['designation'],
    //     element['detailedSignatoryMcaDetails'][signatoryList]['dateOfAppt'],
    //     element['detailedSignatoryMcaDetails'][signatoryList]['isDscRgstrd'],
    //     element['detailedSignatoryMcaDetails'][signatoryList]['dscExpiryDate'],
    //     // element['detailedSignatoryMcaDetails'][signatoryList]['endDate'],
    //   ]).alignment = {
    //     wrapText: true, vertical: 'middle', horizontal: 'center'
    //   };
    // }

    // worksheet.addRow([]);
    // worksheet.addRow([]);

    // ADD Director Master Data Label

    worksheet.addRow(['Director Master Data']);
    // merge a range of cells
    worksheet.mergeCells(`A${worksheet.lastRow['_number']}:F${worksheet.lastRow['_number']}`,);
    worksheet.getCell(`F${worksheet.lastRow['_number']}`).style.font = {
      name: 'Comic Sans MS',
      family: 4,
      size: 12,
      underline: true,
      bold: true
    };
    worksheet.getCell(`F${worksheet.lastRow['_number']}`).fill = {
      type: 'pattern',
      pattern: 'darkTrellis',
      fgColor: { argb: 'FFFFFF00' },
      bgColor: { argb: 'FF0000FF' }
    };
    worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };

    if (!element.detailedDirectorData) {
      worksheet.addRow(['Director master data did not exists in the database. Please update the data']);
      worksheet.mergeCells(`A${worksheet.lastRow['_number']}:F${worksheet.lastRow['_number']}`,);
      worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    }

    if (element.detailedDirectorData && element.detailedDirectorData.length === 0) {
      worksheet.addRow(['Director master data did not exists in the database. Please update the data']);
      worksheet.mergeCells(`A${worksheet.lastRow['_number']}:E${worksheet.lastRow['_number']}`,);
      worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    }

    if (element.detailedDirectorData && element.detailedDirectorData.length > 0) {

      for (let director of element.detailedDirectorData) {
        let llpDetails = [];
        worksheet.addRow([]);
        worksheet.addRow([]);

        worksheet.addRow(['Key Managerial Person Information']);
        worksheet.mergeCells(`A${worksheet.lastRow['_number']}:F${worksheet.lastRow['_number']}`,);
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).style.font = {
          name: 'Comic Sans MS',
          family: 4,
          size: 12,
          underline: true,
          bold: true,
          color: { argb: 'FFFFFF' }
        };
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).fill = {
          type: 'pattern',
          pattern: 'darkTrellis',
          bgColor: { argb: 'FF3D33' }
        };
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

        worksheet.addRow([`DIN: ${director['din']}`]);
        worksheet.mergeCells(`A${worksheet.lastRow['_number']}:F${worksheet.lastRow['_number']}`,);
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).style.font = {
          name: 'Comic Sans MS',
          family: 4,
          size: 12,
          underline: true,
          bold: true,
          color: { argb: 'FFFFFF' }
        };
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).fill = {
          type: 'pattern',
          pattern: 'darkTrellis',
          bgColor: { argb: 'FF3D33' }
        };
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

        worksheet.addRow([`Company Director: ${director['firstName']} ${director['middleName']} ${director['lastName']}`]);
        worksheet.mergeCells(`A${worksheet.lastRow['_number']}:F${worksheet.lastRow['_number']}`,);
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).style.font = {
          name: 'Comic Sans MS',
          family: 4,
          size: 12,
          underline: true,
          bold: true,
          color: { argb: 'FFFFFF' }
        };
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).fill = {
          type: 'pattern',
          pattern: 'darkTrellis',
          bgColor: { argb: 'FF3D33' }
        };
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

        worksheet.addRow(['Other Directorship/Potential Related Entity']);
        worksheet.mergeCells(`A${worksheet.lastRow['_number']}:F${worksheet.lastRow['_number']}`,);
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).style.font = {
          name: 'Comic Sans MS',
          family: 4,
          size: 12,
          underline: true,
          bold: true,
          color: { argb: 'FFFFFF' }
        };
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).fill = {
          type: 'pattern',
          pattern: 'darkTrellis',
          bgColor: { argb: 'FF3D33' }
        };
        worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

        // Add Companies Data
        if (director.companySignatory.length > 0 || director.mcaSignatoryCessationMasterHistory.length > 0) {
          worksheet.addRow([]);
          worksheet.addRow(['List of Companies']).font = {
            bold: true
          };
          worksheet.mergeCells(`A${worksheet.lastRow['_number']}:F${worksheet.lastRow['_number']}`,);
          worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

          // ADD Director Master Data Header Details
          worksheet.addRow([
            'CIN/FCRN',
            'Company Name',
            'Designation',
            'Original Date of appointment',
            'Date of Appointment at Current Designation',
            'Date of cessation (if applicable)'
          ]).font = {
            bold: true
          };

          for (let details of director.companyData) { // Add Company Data

            if (details.companyType && details.companyType.toLowerCase() === 'company') {
              worksheet.addRow([
                details['ucin'],
                details['nameOfTheCompany'],
                details['designation'],

                details['roleEffectiveDate'] ? `${new Date(details['roleEffectiveDate']).getDate().toString().padStart(2, '0')}/${(new Date(details['roleEffectiveDate']).getMonth() + 1).toString().padStart(2, '0')}/${new Date(details['roleEffectiveDate']).getFullYear()}` : '',

                details['currentDesignationDate'] ? `${new Date(details['currentDesignationDate']).getDate().toString().padStart(2, '0')}/${(new Date(details['currentDesignationDate']).getMonth() + 1).toString().padStart(2, '0')}/${new Date(details['currentDesignationDate']).getFullYear()}` : '',

                details['cessationDate'] ? `${new Date(details['cessationDate']).getDate().toString().padStart(2, '0')}/${(new Date(details['cessationDate']).getMonth() + 1).toString().padStart(2, '0')}/${new Date(details['cessationDate']).getFullYear()}` : '',
              ])
            }

            if (details.accountType && details.accountType.toLowerCase() === 'llp') {
              llpDetails.push(details)
            }

          }

          for (let details of director.mcaSignatoryCessationMasterHistory) { // Add Company Data

            worksheet.addRow([
              details['cin'],
              details['accountName'],
              details['designation'],
              details['-'],

              details['appointmentDate'] ? `${new Date(details['appointmentDate']).getDate().toString().padStart(2, '0')}/${(new Date(details['appointmentDate']).getMonth() + 1).toString().padStart(2, '0')}/${new Date(details['appointmentDate']).getFullYear()}` : '',

              details['cessationDate'] ? `${new Date(details['cessationDate']).getDate().toString().padStart(2, '0')}/${(new Date(details['cessationDate']).getMonth() + 1).toString().padStart(2, '0')}/${new Date(details['cessationDate']).getFullYear()}` : '',
            ])

          }

        } else {
          worksheet.addRow(["No companies found."]);
          worksheet.mergeCells(`A${worksheet.lastRow['_number']}:F${worksheet.lastRow['_number']}`,);
          worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        }

        // Add LLP Companies Data
        if (llpDetails.length > 0) {

          worksheet.addRow([]);
          worksheet.addRow(['List of LLP']).font = {
            bold: true
          };
          worksheet.mergeCells(`A${worksheet.lastRow['_number']}:F${worksheet.lastRow['_number']}`,);
          worksheet.getCell(`F${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

          // ADD Director Master Data Header Details
          worksheet.addRow([
            'CIN/LLPIN',
            'LLP Name',
            'Designation',
            'Original Date of appointment',
            'Date of Appointment at Current Designation',
            'Date of cessation (if applicable)'
          ]).font = {
            bold: true
          };

          for (let value of llpDetails) { // Add LLP Data
            worksheet.addRow([
              value['ucin'],
              value['nameOfTheCompany'],
              value['designation'],

              value['roleEffectiveDate'] ? `${new Date(value['roleEffectiveDate']).getDate().toString().padStart(2, '0')}/${(new Date(value['roleEffectiveDate']).getMonth() + 1).toString().padStart(2, '0')}/${new Date(value['roleEffectiveDate']).getFullYear()}` : '',

              value['currentDesignationDate'] ? `${new Date(value['currentDesignationDate']).getDate().toString().padStart(2, '0')}/${(new Date(value['currentDesignationDate']).getMonth() + 1).toString().padStart(2, '0')}/${new Date(value['currentDesignationDate']).getFullYear()}` : '',

              value['cessationDate'] ? `${new Date(value['cessationDate']).getDate().toString().padStart(2, '0')}/${(new Date(value['cessationDate']).getMonth() + 1).toString().padStart(2, '0')}/${new Date(value['cessationDate']).getFullYear()}` : '',

            ])
          }

        } else {
          worksheet.addRow(['No LLP companies found.'])
          worksheet.mergeCells(`A${worksheet.lastRow['_number']}:E${worksheet.lastRow['_number']}`,);
          worksheet.getCell(`E${worksheet.lastRow['_number']}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        }

      }

    }

    // Generate Excel sheet
    workbook.xlsx.writeBuffer().then((data) => {

      const d = element.updatedAt ? new Date(element.updatedAt) : new Date(element.createdAt);
      const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
      const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(d)

      const fileName = `${element.companyId}_${ye}_${mo}_${da}_mca_${Date.now()}.xlsx`;
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    });
  }

  deleteMcaDetails(element: any) {

    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove MCA Detail",
      "message": "Are you sure you want to remove this MCA Detail permanently? <span class=\"font-medium\">This action cannot be undone!</span>",
      "icon": {
        "show": true,
        "name": "heroicons_outline:exclamation",
        "color": "warn"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Remove",
          "color": "warn"
        },
        "cancel": {
          "show": true,
          "label": "Cancel"
        }
      },
      "dismissible": false
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result === 'confirmed') {

        this.apiService.deleteMcaDetails(element._id).subscribe((resolve) => {

          this.data = this.data.filter((items: any) => {
            return items._id !== element._id
          });

          this._snackBar.open('Deleted Successfully', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-primary']
          });

        }, (err) => {

          console.log("Error", err);

        })

      }

    })

  }

}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './example-add-company-data.component.html',
})

export class DialogAnimationsExampleDialog implements OnInit {

  @ViewChild('mcaDetailsNgForm') mcaDetailsNgForm: NgForm;

  formFieldHelpers: string[] = [''];
  mcaDetailsForm: UntypedFormGroup;
  IMAGE_BASE_URI = environment.baseURI;
  signatoryCaptchaDetails: any;
  signatoryDetails: any;

  constructor(
    public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>,
    private _formBuilder: UntypedFormBuilder,
    private apiService: ExampleService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Create the MCA Details form
    this.mcaDetailsForm = this._formBuilder.group({
      cin: ['', [Validators.required]],
      // captcha: ['', Validators.required]
    });

    // this.getSignatoryCaptchaAndCookies();
  }

  /**
     * Get the form field helpers as string
     */
  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }

  getSignatoryCaptchaAndCookies() {
    this.apiService.getSignatoryCaptchaAndCookies().subscribe((resolve) => {

      if (resolve.status === 'success') {
        this.signatoryCaptchaDetails = resolve.data;
      }

      if (resolve.status === 'error') {
        this._snackBar.open(resolve.message, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }

    }, (err) => {
      this._snackBar.open(err.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    })
  }

  changeSignatoryCaptcha() {
    this.getSignatoryCaptchaAndCookies();
  }

  consolidateMcaData() {

    this.apiService.getMcaDetails({
      companyId: this.mcaDetailsForm.get('cin').value,
      // detailedSignatoryDetails: this.signatoryDetails
    }).subscribe((resolve) => {

      if (resolve.status === 'success') {
        this._snackBar.open(resolve.message, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['mat-toolbar', 'mat-primary']
        });
      }


      if (resolve.status === 'error') {
        this._snackBar.open(resolve.message, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }

    }, (err) => {
      this._snackBar.open(err.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    })

    // this.apiService.getSignatoryDetails({
    //   cookie: this.signatoryCaptchaDetails.cookie,
    //   deleteFilePath: this.signatoryCaptchaDetails.deleteFilePath,
    //   filePath: this.signatoryCaptchaDetails.filePath,
    //   companyId: this.mcaDetailsForm.get('cin').value,
    //   captcha: this.mcaDetailsForm.get('captcha').value,
    // }).subscribe((resolve) => {

    //   if (resolve.status === 'success') {
    //     this.signatoryDetails = resolve.data;

    //     this.apiService.getMcaDetails({
    //       companyId: this.mcaDetailsForm.get('cin').value,
    //       detailedSignatoryDetails: this.signatoryDetails
    //     }).subscribe((resolve) => {

    //       if (resolve.status === 'success') {
    //         this._snackBar.open(resolve.message, 'Close', {
    //           horizontalPosition: 'center',
    //           verticalPosition: 'top',
    //           panelClass: ['mat-toolbar', 'mat-primary']
    //         });
    //       }


    //       if (resolve.status === 'error') {
    //         this._snackBar.open(resolve.message, 'Close', {
    //           horizontalPosition: 'center',
    //           verticalPosition: 'top',
    //           panelClass: ['mat-toolbar', 'mat-warn']
    //         });
    //       }

    //     }, (err) => {
    //       this._snackBar.open(err.message, 'Close', {
    //         horizontalPosition: 'center',
    //         verticalPosition: 'top',
    //         panelClass: ['mat-toolbar', 'mat-warn']
    //       });
    //     })

    //   }

    //   if (resolve.status === 'error') {
    //     this._snackBar.open(resolve.message, 'Close', {
    //       horizontalPosition: 'center',
    //       verticalPosition: 'top',
    //       panelClass: ['mat-toolbar', 'mat-warn']
    //     });
    //   }

    // }, (err) => {
    //   this._snackBar.open(err.message, 'Close', {
    //     horizontalPosition: 'center',
    //     verticalPosition: 'top',
    //     panelClass: ['mat-toolbar', 'mat-warn']
    //   });
    // })
  }

  async getMcaDetails() {
    this.apiService.getMcaDetails({
      companyId: this.mcaDetailsForm.get('cin').value,
      detailedSignatoryDetails: JSON.stringify(this.signatoryDetails)
    }).subscribe((resolve) => {

      if (resolve.status === 'success') {
        this._snackBar.open(resolve.message, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['mat-toolbar', 'mat-primary']
        });
      }


      if (resolve.status === 'error') {
        this._snackBar.open(resolve.message, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }

    }, (err) => {
      console.log("MCA Details Error", err);
      this._snackBar.open(err.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    })
  }

}

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}


