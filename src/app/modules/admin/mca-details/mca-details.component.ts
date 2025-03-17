import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ActivatedRoute } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { McaDetailService } from './mca-detail.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mca-details',
  templateUrl: './mca-details.component.html',
  styleUrls: [
    './mca-details.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class McaDetailsComponent implements OnInit {
  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;

  mcaSignatoryDisplayedColumns: string[] = ['din', 'name', 'beginDate', 'endDate', 'surrenderedDin'];
  chargesDisplayedColumns: string[] = ['SRN', 'chargeId', 'chargeHolderName', 'chargeAmount', 'dateOfCreation', 'dateOfModification', 'status'];
  signatoryDisplayedColumns: string[] = ['serialNumber', 'dinPanValue', 'name', 'designation', 'dateOfAppointment', 'cessationDate', 'signatory'];
  companySignatoryDetails = new MatTableDataSource<any>([]);
  companyChargesDetails = new MatTableDataSource<any>([]);
  signatoryDetails: [] = [];

  companyId: any;
  companyDetails: any = {};

  /**
   * Constructor
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: McaDetailService
  ) {
    this.companyId = this.activatedRoute.snapshot.paramMap.get('companyId');

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.getCompanyDetails();
  }

  getCompanyDetails() {
    this.apiService.getMcaIndividualDetails(this.companyId).subscribe((resolve) => {
      
      this.companyDetails = resolve.data;
      this.companySignatoryDetails.data = resolve.data.filteredDirectorData;
      let companyChargesDetails = resolve.data.chargesValue;

      // Update Charges Details
      for(let charge of companyChargesDetails) {
        let chargeDetails = {}
        chargeDetails['SRN'] = charge['SRN'];
        chargeDetails['chargeId'] = charge['chargeId'];
        chargeDetails['chargeHolderName'] = charge['chargeHolderName'];
        chargeDetails['chargeAmount'] = charge['amount'];
        chargeDetails['dateOfCreation'] = charge['dateOfCreation'];
        chargeDetails['dateOfModification'] = charge['dateOfModification'];
        chargeDetails['dateOfSatisfaction'] = charge['dateOfSatisfaction'];
        chargeDetails['status'] = charge['chargeStatus'];

        this.companyChargesDetails.data.push(chargeDetails)
      }

      this.companySignatoryDetails._updateChangeSubscription();
      this.companyChargesDetails._updateChangeSubscription();


    }, (err) => {

      console.log("Error", err);

    })
  }

}
