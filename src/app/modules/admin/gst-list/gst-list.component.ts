import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GstListService } from './gst-list.service';

@Component({
  selector: 'app-gst-list',
  templateUrl: './gst-list.component.html',
  styleUrls: ['./gst-list.component.css']
})
export class GstListComponent implements OnInit {

  displayedColumns: string[] = ['gstin', 'authStatus', 'stateCd'];
  data: [] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  docId: any;
  gstByPanDetails: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: GstListService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { 

    this.docId = this.activatedRoute.snapshot.paramMap.get('docId');
  }

  ngOnInit(): void {
    this.getGstListyPan()
  }

  getGstListyPan() {
    this.apiService.getGstListyPan(this.docId).subscribe((resolve) => {

      this.gstByPanDetails = resolve.data
      this.data = this.gstByPanDetails.gstNumbers;
      this.resultsLength = this.gstByPanDetails.gstNumbers.length;
      this.isLoadingResults = false

    }, (err) => {
      this._snackBar.open(err.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    });
  }

  gstDetailRouter(gstin: any) {
    this.router.navigateByUrl(`/gst-individual/details/${this.docId}/${gstin}`)
  }

}
