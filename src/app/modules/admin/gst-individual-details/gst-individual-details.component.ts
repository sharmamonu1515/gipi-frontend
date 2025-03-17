import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { GstIndividualListService } from './gst-individual-list.service';

@Component({
  selector: 'app-gst-individual-details',
  templateUrl: './gst-individual-details.component.html',
  styleUrls: ['./gst-individual-details.component.css']
})
export class GstIndividualDetailsComponent implements OnInit {

  dealingInGoodsDisplayedColumns: string[] = ['hsncd', 'gdes'];
  dealingInServicesDisplayedColumns: string[] = ['saccd', 'sdes'];
  businessPlacesDisplayedColumns: string[] = ['addressType', 'ntr', 'adr'];
  filingTableDisplayedColumns: string[] = ['fy', 'taxp', 'dof', 'status'];
  liabiltyTableDisplayedColumns: string[] = ['year', 'taxperiod', 'liab_pct'];

  docId: any;
  gstin: any;
  gstDetails: any;
  dealingInGoodsDetails: [] = [];
  dealingInServicesDetails: [] = [];
  nameOfProprietorDetails: [] = [];
  natureOfBusinessActivitiesDetails: [] = [];
  placeOfBusinessDetails: any[] = [];
  currentTab = 'profile';
  filingTabsName: string[] = [];
  filingTableDetails: {} = {};
  liabilityTabsName: string[] = ['Current Financial Year', 'Previous Financial Year'];
  liabilityTableDetails: {} = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: GstIndividualListService,
    private _snackBar: MatSnackBar
  ) {
    this.docId = this.activatedRoute.snapshot.paramMap.get('docId');
    this.gstin = this.activatedRoute.snapshot.paramMap.get('gstin');
  }

  ngOnInit(): void {
    this.getGstDetails()
  }

  getGstDetails() {

    this.apiService.getGstDetails(this.docId, this.gstin).subscribe((resolve: any) => {

      this.gstDetails = resolve.data;
      this.dealingInGoodsDetails = resolve.data.gstNumbers.secondTabValue.bzgddtls;
      this.dealingInServicesDetails = resolve.data.gstNumbers.secondTabValue.bzsdtls;
      this.nameOfProprietorDetails = resolve.data.gstNumbers.firstTabValue.mbr;
      this.natureOfBusinessActivitiesDetails = resolve.data.gstNumbers.firstTabValue.nba;

      let additionalAddressValue = [];
      additionalAddressValue.push({
        adr: resolve.data.gstNumbers.additionalAddressDetails.pradr.adr,
        ntr: resolve.data.gstNumbers.additionalAddressDetails.pradr.ntr,
        addressType: 'Principal'
      });

      for (let additional of resolve.data.gstNumbers.additionalAddressDetails.adadr) {
        additionalAddressValue.push({
          adr: additional.adr,
          ntr: additional.ntr,
          addressType: 'Additional'
        })
      }

      this.placeOfBusinessDetails = additionalAddressValue;

      // For FILING Details
      for (let filing of resolve.data.gstNumbers.gstFilingDetails.filingStatus[0]) {
        if (this.filingTabsName.indexOf(filing.rtntype) === -1) {
          this.filingTabsName.push(filing.rtntype);
          this.filingTableDetails[filing.rtntype] = [];
          this.filingTableDetails[filing.rtntype].push(filing);
        } else {
          this.filingTableDetails[filing.rtntype].push(filing);
        }
      }

      // For LIABILITY Current FY Details
      this.liabilityTableDetails['Current Financial Year'] = [];
      this.liabilityTableDetails['Previous Financial Year'] = [];
      for(let current of resolve.data.gstNumbers.gstLiabilityDetails.curdtls) {
        let data = {
          year: `${resolve.data.gstNumbers.gstLiabilityDetails.curfy} - ${Number(resolve.data.gstNumbers.gstLiabilityDetails.curfy) + 1}`,
          taxperiod: current.taxperiod,
          liab_pct: current.liab_pct ? current.liab_pct : current.flag
        }

        this.liabilityTableDetails['Current Financial Year'].push(data);
      }

      // For LIABILITY Previous FY Details
      for(let previous of resolve.data.gstNumbers.gstLiabilityDetails.prevdtls) {
        let data = {
          year: `${resolve.data.gstNumbers.gstLiabilityDetails.prevfy} - ${Number(resolve.data.gstNumbers.gstLiabilityDetails.prevfy) + 1}`,
          taxperiod: previous.taxperiod,
          liab_pct: previous.liab_pct ? previous.liab_pct : previous.flag
        }

        this.liabilityTableDetails['Previous Financial Year'].push(data);
      }

      this.liabilityTableDetails['Current Financial Year'].push({
        year: `${resolve.data.gstNumbers.gstLiabilityDetails.curfy} - ${Number(resolve.data.gstNumbers.gstLiabilityDetails.curfy) + 1}`,
        taxperiod: 'Total',
        liab_pct: Number(resolve.data.gstNumbers.gstLiabilityDetails.curtotal)
      });

      this.liabilityTableDetails['Previous Financial Year'].push({
        year: `${resolve.data.gstNumbers.gstLiabilityDetails.prevfy} - ${Number(resolve.data.gstNumbers.gstLiabilityDetails.prevfy) + 1}`,
        taxperiod: 'Total',
        liab_pct: Number(resolve.data.gstNumbers.gstLiabilityDetails.prevtotal)
      });

    }, (err) => {
      console.log("GST Details Error", err);
      this._snackBar.open(err.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    })

  }

  firstTabSwitch(event) {

    event.index === 0 ? this.currentTab = 'profile' : this.currentTab = 'placeOfBusiness';

  }
}
