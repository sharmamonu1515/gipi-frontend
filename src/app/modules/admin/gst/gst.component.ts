import { Component, ViewEncapsulation, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { merge, Observable, of as observableOf, Subject } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import * as moment from 'moment';
import { GstService } from './gst.service';

var delayedGstDetails = [];
var checkFillingStatus = {};

/**
 * @title Table retrieving data through HTTP
 */

@Component({
  selector: 'app-gst',
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class GstComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['createdAt', 'panNumber', 'mandateName', 'action'];
  data: [] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private apiService: GstService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoadingResults = true;
          return this.apiService.getGstList(
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

      this.getEmplainceCheckData()
  }

  ngAfterViewInit() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apiService.getGstList(
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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(GstAddDataComponent, {
      width: '50%',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe((result) => {
      window.location.reload();
    })
  }

  gstListByPan(id: any) {
    this.router.navigateByUrl(`/gst-list-by-pan/details/${id}`)
  }

  openGstLoginDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(GstLoginComponent, {
      width: '50%',
      height: '68%',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    });
  }

  async exportExcelInOneSheet(gstData, panNumber) {
    // Create workbook and worksheet
    const workbook = new Excel.Workbook();;
    const worksheet = workbook.addWorksheet('GST Details', {
      properties: { tabColor: { argb: 'B8F9A7' } },
    });

    /**
     * EXCEL HEADIND
     */

    worksheet.addRow([`Search Result based on PAN :: ${panNumber}`]);
    // merge a range of cells
    worksheet.mergeCells('A1:G1');
    // for the wannabe graphic designers out there
    worksheet.getCell('A1').font = {
      name: 'Comic Sans MS',
      family: 4,
      size: 12,
      underline: true,
      bold: true,
      width: '30px'
    };
    // Cell Alignment
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

    // fill A4 with blue-white-blue gradient from left to right
    worksheet.getCell('A1').fill = {
      type: 'gradient',
      gradient: 'angle',
      degree: 0,
      stops: [
        { position: 0, color: { argb: 'FF0000FF' } },
        { position: 0.5, color: { argb: 'FFFFFFFF' } },
        { position: 1, color: { argb: 'FF0000FF' } }
      ]
    };

    /**
     * GST LIST TABLE STARTED
     */
    worksheet.addTable({
      name: 'gstListTable',
      ref: 'A3',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleLight21',
        showRowStripes: true,
      },
      columns: [
        { name: 'Sr. No.', filterButton: false },
        { name: 'GSTIN/UIN', filterButton: true },
        { name: 'GSTIN/UIN Status', filterButton: true },
        { name: 'State', filterButton: true },
      ],
      rows: getGstList(gstData),
    });

    /**
     * GST LIST TABLE ENDED
     */
    delayedGstDetails = [];
    // Loop Started For All GST List
    for (let gst of gstData) {

      worksheet.addRow([]);
      worksheet.addRow([]);
      worksheet.addRow([`Legal Name of Business :: ${gst.firstTabValue.lgnm}.\n Search Result based on GSTIN/UIN :: ${gst.firstTabValue.gstin}`]);

      // merge a range of cells
      worksheet.mergeCells(`A${worksheet.lastRow['_number']}:O${worksheet.lastRow['_number']}`);

      // for the wannabe graphic designers out there
      worksheet.getCell(`A${worksheet.lastRow['_number']}`).font = {
        name: 'Comic Sans MS',
        family: 4,
        size: 12,
        underline: true,
        bold: true,
        width: '30px'
      };

      // Cell Alignment
      worksheet.getCell(`A${worksheet.lastRow['_number']}`).alignment = { vertical: 'middle', horizontal: 'center' };

      // fill A4 with blue-white-blue gradient from left to right
      worksheet.getCell(`A${worksheet.lastRow['_number']}`).fill = {
        type: 'pattern',
        pattern: 'darkTrellis',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      };
      worksheet.getRow(worksheet.lastRow['_number']).height = 80;

      worksheet.addRow([]);
      worksheet.addRow([]);

      worksheet.addRow(['Date of Registration', gst.firstTabValue.rgdt]);
      worksheet.addRow(['GSTIN / UIN Status', gst.firstTabValue.sts]);
      worksheet.addRow(['Trade Name', gst.firstTabValue.tradeNam]);

      worksheet.addRow([]);
      worksheet.addRow([]);
      worksheet.addRow([]);

      /**
       * PROPRIETOR TABLE STARTED
       */
      if (gst.firstTabValue.mbr && gst.firstTabValue.mbr.length > 0) {
        worksheet.addTable({
          name: `proprietorTable${gst.gstin}`,
          ref: `A${worksheet.lastRow['_number']}`,
          headerRow: true,
          totalsRow: false,
          style: {
            theme: 'TableStyleLight21',
            showRowStripes: true,
          },
          columns: [
            { name: 'Sr. No.', filterButton: false },
            { name: 'Name of the Proprietor / Director(s) / Promoter(s)' },
          ],
          rows: getProprietorDetails(gst.firstTabValue.mbr),
        });

      } else {
        worksheet.addRow(['Name of the Proprietor / Director(s) / Promoter(s) Details']).font = { bold: true };
        worksheet.addRow(['No Records Found.']).font = { bold: true };

      }

      worksheet.addRow([]);
      worksheet.addRow([]);

      /*
        * PROPRIETOR TABLE ENDED
        */


      /**
       * NATURE OF BUSINESS TABLE STARTED
       */
      if (gst.firstTabValue.nba || gst.firstTabValue.nba && gst.firstTabValue.nba.length > 0) {
        worksheet.addTable({
          name: `natureOfusinessTable${gst.gstin}`,
          ref: `A${worksheet.lastRow['_number']}`,
          headerRow: true,
          totalsRow: false,
          style: {
            theme: 'TableStyleLight21',
            showRowStripes: true,
          },
          columns: [
            { name: 'Sr. No.', filterButton: false },
            { name: 'Nature of Business Activities' },
          ],
          rows: getNatureOfBusinessDetails(gst.firstTabValue.nba),
        });
      } else {
        worksheet.addRow(['Nature of Business Activities Details']).font = { bold: true };
        worksheet.addRow(['No Records Found.']).font = { bold: true };
      }

      worksheet.addRow([]);
      worksheet.addRow([]);
      /**
        * NATURE OF BUSINESS TABLE ENDED
        */

      /**
       * Filing TABLE STARTED
       */
      if (gst.gstFilingDetails.filingStatus) {
        let fillingDetails = await getFillingTableDetails(gst.gstFilingDetails.filingStatus[0], gst.gstin);

        for (let table in fillingDetails) {
          /**
         * Filling TABLE STARTED
         */
          worksheet.addRow([`Filing Details of ${table}`]).font = { bold: true };
          worksheet.addRow([]);
          worksheet.addTable({
            name: `${table}Table${gst.gstin}`,
            ref: `A${worksheet.lastRow['_number']}`,
            headerRow: true,
            totalsRow: false,
            style: {
              theme: 'TableStyleLight21',
              showRowStripes: true,
            },
            columns: [
              { name: 'Table of', filterButton: false },
              { name: 'Financial Year', filterButton: true },
              { name: 'Tax Period', filterButton: true },
              { name: 'Date of filing', filterButton: true },
              { name: 'Status', filterButton: true },
              { name: 'Empliance Check', filterButton: true },
            ],
            rows: fillingDetails[table],
          });

          worksheet.addRow([]);
          worksheet.addRow([]);
          worksheet.addRow([]);

          /**
            * Filling TABLE ENDED
            */
        }
      } else {
        worksheet.addRow(['Filing Details']).font = { bold: true };
        worksheet.addRow(['No Records Found.']).font = { bold: true };
        worksheet.addRow([]);
        worksheet.addRow([]);
      }
      /**
       * Filing TABLE STARTED
       */

      /**
       * LIABILITY TABLE STARTED
       */
      if (
        gst.gstLiabilityDetails.curdtls &&
        gst.gstLiabilityDetails.curfy ||
        gst.gstLiabilityDetails.prevdtls &&
        gst.gstLiabilityDetails.prevfy
      ) {

        let liabilityDetails: any = getLiabilityDetails(
          gst.gstLiabilityDetails.curdtls,
          gst.gstLiabilityDetails.curfy,
          gst.gstLiabilityDetails.prevdtls,
          gst.gstLiabilityDetails.prevfy
        );

        /**
       * CURRENT LIABILITY TABLE STARTED
       */
        worksheet.addRow([`Current Liability Details`]).font = { bold: true };
        worksheet.addRow([]);
        worksheet.addRow([]);

        if (liabilityDetails.curFyData) {

          worksheet.addTable({
            name: `currnetLiabilityTable${gst.gstin}`,
            ref: `A${worksheet.lastRow['_number']}`,
            headerRow: true,
            totalsRow: false,
            style: {
              theme: 'TableStyleLight21',
              showRowStripes: true,
            },
            columns: [
              { name: 'Financial Year', filterButton: true },
              { name: 'Tax Period', filterButton: true },
              { name: '% of Liability Paid', filterButton: true }
            ],
            rows: liabilityDetails['Current Financial Year'],
          });

          worksheet.addRow([]);
          worksheet.addRow([]);
          worksheet.addRow([]);

        } else {
          worksheet.addRow([]);
          worksheet.addRow(['No Current Liabilty Found']);
          worksheet.addRow([]);
        }
        /**
       * CURRENT LIABILITY TABLE ENDED
       */

        /**
       * PREVIOUS LIABILITY TABLE STARTED
       */
        worksheet.addRow([`Previous Liability Details`]).font = { bold: true };
        worksheet.addRow([]);
        worksheet.addRow([]);

        if (liabilityDetails.curFyData) {

          worksheet.addTable({
            name: `previousLiabilityTable${gst.gstin}`,
            ref: `A${worksheet.lastRow['_number']}`,
            headerRow: true,
            totalsRow: false,
            style: {
              theme: 'TableStyleLight21',
              showRowStripes: true,
            },
            columns: [
              { name: 'Financial Year', filterButton: true },
              { name: 'Tax Period', filterButton: true },
              { name: '% of Liability Paid', filterButton: true }
            ],
            rows: liabilityDetails['Previous Financial Year'],
          });

          worksheet.addRow([]);
          worksheet.addRow([]);
          worksheet.addRow([]);

        } else {
          worksheet.addRow([]);
          worksheet.addRow(['No Previous Liabilty Found']);
          worksheet.addRow([]);
        }
        /**
       * PREVIOUS LIABILITY TABLE ENDED
       */
      } else {

        worksheet.addRow([`Liability Details`]).font = { bold: true };
        worksheet.addRow([`No Current & Previous Liability Found`]).font = { bold: true };
        worksheet.addRow([]);
        worksheet.addRow([]);
      }

      /**
       * LIABILITY TABLE STARTED
       */

      /**
       * DEALING IN GOODS TABLE STARTED
       */
      if (gst.secondTabValue.bzgddtls) {

        let dealsInGoodDetails = getDealingInGoodsDetails(gst.secondTabValue.bzgddtls)
        worksheet.addRow(['Dealing in Services Details']).font = { bold: true };
        worksheet.addRow([]);
        worksheet.addTable({
          name: `dealsInGoodsTable${gst.gstin}`,
          ref: `A${worksheet.lastRow['_number']}`,
          headerRow: true,
          totalsRow: false,
          style: {
            theme: 'TableStyleLight21',
            showRowStripes: true,
          },
          columns: [
            { name: 'HSN', filterButton: true },
            { name: 'Description', filterButton: true }
          ],
          rows: dealsInGoodDetails,
        });

        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);

      } else {

        worksheet.addRow([`Dealing In Goods Details`]).font = { bold: true };
        worksheet.addRow([`No Records Found`]).font = { bold: true };
        worksheet.addRow([]);
        worksheet.addRow([]);

      }

      /**
       * DEALING IN GOODS TABLE STARTED
       */

      /**
       * DEALING IN SERVICES TABLE STARTED
       */
      if (gst.secondTabValue.bzsdtls) {

        let dealsInSeviceDetails = getDealingInSevicesDetails(gst.secondTabValue.bzsdtls)
        worksheet.addRow(['Dealing in Services Details']).font = { bold: true };
        worksheet.addRow([]);
        worksheet.addTable({
          name: `dealsInSevicesTable${gst.gstin}`,
          ref: `A${worksheet.lastRow['_number']}`,
          headerRow: true,
          totalsRow: false,
          style: {
            theme: 'TableStyleLight21',
            showRowStripes: true,
          },
          columns: [
            { name: 'HSN', filterButton: true },
            { name: 'Description', filterButton: true }
          ],
          rows: dealsInSeviceDetails,
        });

        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);

      } else {

        worksheet.addRow([`Dealing In Services Details`]).font = { bold: true };
        worksheet.addRow([`No Records Found`]).font = { bold: true };
        worksheet.addRow([]);
        worksheet.addRow([]);

      }

      /**
       * DEALING IN SERVICES TABLE STARTED
       */

      /**
       * PLACE OF BUSINESS TABLE STARTED
       */
      if (gst.additionalAddressDetails &&
        gst.additionalAddressDetails.pradr
      ) {

        let placeOfBusinessDetails = getPlaceOfBusinessDetails(gst.additionalAddressDetails);
        worksheet.addRow(['Place Of Business Details']).font = { bold: true };
        worksheet.addRow([]);
        worksheet.addTable({
          name: `placeOfBusinessTable${gst.gstin}`,
          ref: `A${worksheet.lastRow['_number']}`,
          headerRow: true,
          totalsRow: false,
          style: {
            theme: 'TableStyleLight21',
            showRowStripes: true,
          },
          columns: [
            { name: 'Type', filterButton: true },
            { name: 'Nature of Business Activities being Carried out at Place of Business', filterButton: true },
            { name: 'Address', filterButton: true },
          ],
          rows: placeOfBusinessDetails,
        });

        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);

      } else {

        worksheet.addRow([`Place Of Business Details`]).font = { bold: true };
        worksheet.addRow([`No Records Found`]).font = { bold: true };
        worksheet.addRow([]);
        worksheet.addRow([]);

      }


      /**
       * PLACE OF BUSINESS TABLE STARTED
       */

    }

    // COLUMN WIDTH

    // worksheet.getColumn(1).width = 20;
    worksheet.getColumn(1).width = 18;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 18;
    worksheet.getColumn(4).width = 18;

    // Delayed WorkSheet Started
    if (delayedGstDetails.length > 0) {

      const delayedWorksheet = workbook.addWorksheet('Delayed Filing Details', {
        properties: { tabColor: { argb: 'F9AFA7' } },
      });

      delayedWorksheet.addRow([`Delayed Filing Details For PAN :: ${panNumber}`]);
      // merge a range of cells
      delayedWorksheet.mergeCells('A1:G1');
      // for the wannabe graphic designers out there
      delayedWorksheet.getCell('A1').font = {
        name: 'Comic Sans MS',
        family: 4,
        size: 12,
        underline: true,
        bold: true,
        width: '30px'
      };
      // Cell Alignment
      delayedWorksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

      // fill A4 with blue-white-blue gradient from left to right
      delayedWorksheet.getCell('A1').fill = {
        type: 'gradient',
        gradient: 'angle',
        degree: 0,
        stops: [
          { position: 0, color: { argb: 'EE1616' } },
          { position: 0.5, color: { argb: 'FFFFFFFF' } },
          { position: 1, color: { argb: 'EE1616' } }
        ]
      };

      delayedWorksheet.addRow([]);
      delayedWorksheet.addRow([]);

      delayedWorksheet.addTable({
        name: `delayedTable`,
        ref: `A${delayedWorksheet.lastRow['_number']}`,
        headerRow: true,
        totalsRow: false,
        style: {
          theme: 'TableStyleLight21',
          showRowStripes: true,
        },
        columns: [
          { name: 'Table of', filterButton: true },
          { name: 'GSTIN', filterButton: true },
          { name: 'Financial Year', filterButton: true },
          { name: 'Tax Period', filterButton: true },
          { name: 'Date of Filing', filterButton: true },
          { name: 'Status', filterButton: true },
          { name: 'Empliance Check', filterButton: true },
        ],
        rows: delayedGstDetails,
      });

      // Delayed Worksheet Column Width;
      delayedWorksheet.getColumn(1).width = 18;
      delayedWorksheet.getColumn(2).width = 25;
      delayedWorksheet.getColumn(3).width = 18;
      delayedWorksheet.getColumn(4).width = 18;
      delayedWorksheet.getColumn(5).width = 18;
      delayedWorksheet.getColumn(6).width = 18;
      delayedWorksheet.getColumn(7).width = 18;

    }

    // Generate Excel sheet
    workbook.xlsx.writeBuffer().then((data) => {

      const d = new Date();
      const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
      const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(d)

      const fileName = `${panNumber}_${ye}_${mo}_${da}_${Date.now()}.xlsx`;

      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    });
  }

  createProduct() {
    console.log("Akshay Pratap")
  }

  getEmplainceCheckData() {
    this.apiService.getCheckDateList().subscribe(async (resolve) => {

      checkFillingStatus = resolve.data.emplianceCheckDate;

    }, (err) => {

      console.log("Error", err);

    })
  }

}

// ADD GST INFO BY PAN //
@Component({
  selector: 'gst-add-data',
  templateUrl: './add-gst-data.component.html',
})

export class GstAddDataComponent implements OnInit {

  @ViewChild('gstByPanNgForm') gstByPanNgForm: NgForm;

  formFieldHelpers: string[] = [''];
  gstByPanForm: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<GstAddDataComponent>,
    private _formBuilder: UntypedFormBuilder,
    private apiService: GstService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Create the MCA Details form
    this.gstByPanForm = this._formBuilder.group({
      panNumber: ['', [Validators.required]],
    });
  }

  /**
     * Get the form field helpers as string
     */
  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }

  submitPan() {
    this.apiService.submitPan({
      panNumber: this.gstByPanForm.get('panNumber').value,
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

// GST LOGIN COMPONENT //
@Component({
  selector: 'gst-login',
  templateUrl: './gst-login.component.html',
})

export class GstLoginComponent implements OnInit {

  @ViewChild('gstLoginNgForm') gstLoginNgForm: NgForm;

  formFieldHelpers: string[] = [''];
  gstLoginForm: UntypedFormGroup;
  IMAGE_BASE_URI = environment.baseURI;
  gstCaptchaDetails: any;
  signatoryDetails: any;

  constructor(
    public dialogRef: MatDialogRef<GstLoginComponent>,
    private _formBuilder: UntypedFormBuilder,
    private apiService: GstService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Create the MCA Details form
    this.gstLoginForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      captcha: ['', Validators.required]
    });

    this.getGstCaptcha();
  }

  /**
     * Get the form field helpers as string
     */
  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }

  getGstCaptcha() {
    this.apiService.getGstCaptcha().subscribe((resolve) => {
      if (resolve.status === 'success') {
        this.gstCaptchaDetails = resolve.data;
      }

      if (resolve.status === 'error') {
        this._snackBar.open(resolve.message, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }

    }, (err) => {
      console.log("GST captcha Error", err);
      this._snackBar.open(err.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    });
  }

  changeGstCaptcha() {
    this.getGstCaptcha();
  }

  gstAuth() {

    this.apiService.gstAuth({
      username: this.gstLoginForm.get('username').value,
      password: this.gstLoginForm.get('password').value,
      captcha: this.gstLoginForm.get('captcha').value
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
      console.log("GST Login Error", err);
      this._snackBar.open(err.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    });

  }

}

// Excel Driver Functions

export function getGstList(data) {

  let returnGstDetails = [];

  data.forEach((element, index) => {

    let gstDetails = [];
    gstDetails.push(index + 1);
    gstDetails.push(element.gstin);
    gstDetails.push(element.authStatus);
    gstDetails.push(getStateNameFromCode(element.stateCd));
    returnGstDetails.push(gstDetails);

  });

  return returnGstDetails;
}

export function getStateNameFromCode(stateCode) {

  let stateObject = {
    "37": "Andhra Pradesh",
    "12": "Arunachal Pradesh",
    "18": "Assam",
    "10": "Bihar",
    "22": "Chattisgarh",
    "07": "Delhi",
    "30": "Goa",
    "24": "Gujarat",
    "06": "Haryana",
    "02": "Himachal Pradesh",
    "01": "Jammu and Kashmir",
    "20": "Jharkhand",
    "29": "Karnataka",
    "32": "Kerala",
    "31": "Lakshadweep Islands",
    "23": "Madhya Pradesh",
    "27": "Maharashtra",
    "14": "Manipur",
    "17": "Meghalaya",
    "15": "Mizoram",
    "13": "Nagaland",
    "21": "Odisha",
    "34": "Pondicherry",
    "03": "Punjab",
    "08": "Rajasthan",
    "11": "Sikkim",
    "33": "Tamil Nadu",
    "36": "Telangana",
    "16": "Tripura",
    "09": "Uttar Pradesh",
    "05": "Uttarakhand",
    "19": "West Bengal",
    "35": "Andaman and Nicobar Islands",
    "04": "Chandigarh",
    "26": "Dadra & Nagar Haveli and Daman & Diu",
    "38": "Ladakh",
    "97": "Other Territory",
  }

  return stateObject[stateCode] ? stateObject[stateCode] : 'NA';

}

export function getProprietorDetails(data) {

  let returnProprietorDetails = [];

  data.forEach((element, index) => {

    let proprietorDetails = [];
    proprietorDetails.push(index + 1);
    proprietorDetails.push(element);
    returnProprietorDetails.push(proprietorDetails);

  });

  return returnProprietorDetails;
}

export function getNatureOfBusinessDetails(data) {

  let returnNatureOfBusinessDetails = [];

  data.forEach((element, index) => {

    let natureOfBusinessDetails = [];
    natureOfBusinessDetails.push(index + 1);
    natureOfBusinessDetails.push(element);
    returnNatureOfBusinessDetails.push(natureOfBusinessDetails);

  });

  return returnNatureOfBusinessDetails;
}

export async function getFillingTableDetails(data, gstNumber) {

  let filingTableDetails: {} = {};

  // For FILING Details
  for (let filing of data) {
    console.log(filing)
    if (!filingTableDetails[filing.rtntype]) {
      filingTableDetails[filing.rtntype] = [];
      filingTableDetails[filing.rtntype].push([
        filing.rtntype,
        filing.fy,
        filing.taxp,
        filing.dof,
        filing.status,
        emplianceFilingCheck(filing.taxp, filing.dof, filing.rtntype, gstNumber, filing.fy, filing.status)
      ]);
    } else {
      filingTableDetails[filing.rtntype].push([
        filing.rtntype,
        filing.fy,
        filing.taxp,
        filing.dof,
        filing.status,
        emplianceFilingCheck(filing.taxp, filing.dof, filing.rtntype, gstNumber, filing.fy, filing.status)
      ]);
    }
  }

  return filingTableDetails;
}

export function emplianceFilingCheck(month: string, filingDate: string, filingType: string, gstNumber: string, financialYear: string, status: string) {


  // let checkFillingStatus = {
  //   GSTR1: {
  //     'January': '11/02/2023',
  //     'February': '11/03/2023',
  //     'March': '11/04/2022',
  //     'April': '11/05/2022',
  //     'May': '11/06/2022',
  //     'June': '11/07/2022',
  //     'July': '11/08/2022',
  //     'August': '11/09/2022',
  //     'September': '11/10/2022',
  //     'October': '11/11/2022',
  //     'November': '11/12/2022',
  //     'December': '11/01/2023',
  //   },
  //   GSTR6: {
  //     'January': '13/02/2023',
  //     'February': '13/03/2023',
  //     'March': '13/04/2022',
  //     'April': '13/05/2022',
  //     'May': '13/06/2022',
  //     'June': '13/07/2022',
  //     'July': '13/08/2022',
  //     'August': '13/09/2022',
  //     'September': '13/10/2022',
  //     'October': '13/11/2022',
  //     'November': '13/12/2022',
  //     'December': '13/01/2023',
  //   },
  //   GSTR3B: {
  //     'January': '20/02/2023',
  //     'February': '20/03/2022',
  //     'March': '20/04/2022',
  //     'April': '24/05/2022',
  //     'May': '20/06/2022',
  //     'June': '20/07/2022',
  //     'July': '20/08/2022',
  //     'August': '20/09/2022',
  //     'September': '21/10/2022',
  //     'October': '20/11/2022',
  //     'November': '20/12/2022',
  //     'December': '20/01/2023',
  //   },
  //   GSTR9: {
  //     '2020-2021': "28/02/2022",
  //     '2019-2020': "31/03/2021",
  //     '2018-2019': "31/12/2020",
  //     '2017-2018': "12/02/2021",
  //   },
  //   GSTR9C: {
  //     '2020-2021': "28/02/2022",
  //     '2019-2020': "31/03/2021",
  //     '2018-2019': "31/12/2020",
  //     '2017-2018': "12/02/2021",
  //   },
  //   GSTR10: {
  //     '2020-2021': "28/02/2022",
  //     '2019-2020': "31/03/2021",
  //     '2018-2019': "31/12/2021",
  //     '2017-2018': "12/02/2021",
  //   },
  // }

  // let getEmplianceFilingDate = month === 'Annual' ?
  // checkFillingStatus[filingType][financialYear] :
  // checkFillingStatus[filingType] ? checkFillingStatus[filingType][month] : 'NA';

  let getEmplianceFilingDate = month === 'Annual' ?
    checkFillingStatus[filingType][financialYear] :
    checkFillingStatus[filingType][month];

  if (!getEmplianceFilingDate) return 'NA';

  let momentFilingDate = moment(filingDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
  let momentEmplianceFilingDate = moment(getEmplianceFilingDate, 'DD/MM/YYYY').format('YYYY-MM-DD');


  !moment(momentFilingDate).isSameOrBefore(momentEmplianceFilingDate) ?
    delayedGstDetails.push([filingType, gstNumber, financialYear, month, filingDate, status, 'Delayed']) : '';

  return moment(momentFilingDate).isSameOrBefore(momentEmplianceFilingDate) ? 'On Time' : 'Delayed';

}

export function getLiabilityDetails(curdtls: any, curfy: any, prevdtls: any, prevfy: any) {

  let liabilityTableDetails = {};
  liabilityTableDetails['Current Financial Year'] = [];
  liabilityTableDetails['Previous Financial Year'] = [];

  // For LIABILITY Previous FY Details
  if (curdtls && curfy) {
    for (let current of curdtls) {

      liabilityTableDetails['Current Financial Year'].push([
        `${curfy} - ${Number(curfy) + 1}`,
        current.taxperiod,
        current.liab_pct ? current.liab_pct : current.flag
      ]);

    }
  }

  // For LIABILITY Previous FY Details
  if (prevdtls && prevfy) {
    for (let previous of prevdtls) {

      liabilityTableDetails['Previous Financial Year'].push([
        `${prevfy} - ${Number(prevfy) + 1}`,
        previous.taxperiod,
        previous.liab_pct ? previous.liab_pct : previous.flag
      ]);
    }
  }

  liabilityTableDetails['Current Financial Year'].length === 0 ?
    liabilityTableDetails['curFyData'] = false :
    liabilityTableDetails['curFyData'] = true;

  liabilityTableDetails['Previous Financial Year'].length === 0 ?
    liabilityTableDetails['perFyData'] = false :
    liabilityTableDetails['perFyData'] = true;

  return liabilityTableDetails;
}

export function getDealingInGoodsDetails(data) {

  let dealingInDetails = [];

  // Add Dealing In Goods Details
  for (let goods of data) {

    dealingInDetails.push([
      goods.hsncd,
      goods.gdes,
    ]);

  }

  return dealingInDetails;
}

export function getDealingInSevicesDetails(data) {

  let dealingInServicesDetails = [];

  // Add Dealing In Goods Details
  for (let services of data) {

    dealingInServicesDetails.push([
      services.saccd,
      services.sdes,
    ]);

  }

  return dealingInServicesDetails;
}

export function getPlaceOfBusinessDetails(data) {
  let additionalAddressValue = [];
  additionalAddressValue.push([
    'Principal',
    data.pradr.ntr,
    data.pradr.adr,
  ]);

  for (let additional of data.adadr) {
    additionalAddressValue.push([
      'Additional',
      additional.ntr,
      additional.adr,
    ])
  }
  return additionalAddressValue;
}
