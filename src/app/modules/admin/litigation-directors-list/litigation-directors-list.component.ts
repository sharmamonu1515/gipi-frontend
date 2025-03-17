import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LitigationDirectorsService } from './litigation-directors.service';

@Component({
  selector: 'app-litigation-directors-list',
  templateUrl: './litigation-directors-list.component.html',
  styleUrls: ['./litigation-directors-list.component.css']
})
export class LitigationDirectorsListComponent implements OnInit {

  displayedColumns: string[] = ['din', 'pan', 'name', 'designation'];
  data: [] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  companyId: any;
  litigationDirectorsDetails: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: LitigationDirectorsService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { 

    this.companyId = this.activatedRoute.snapshot.paramMap.get('companyId');
  }

  ngOnInit(): void {
    this.getLitigationDirectorsList()
  }

  getLitigationDirectorsList() {
    this.apiService.getLitigationDirectorsList(this.companyId).subscribe((resolve) => {

      this.litigationDirectorsDetails = resolve.data;
      this.data = this.litigationDirectorsDetails.directors;
      this.resultsLength = this.litigationDirectorsDetails.directors.length;
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
    this.router.navigateByUrl(`/gst-individual/details/${this.companyId}/${gstin}`)
  }

}
