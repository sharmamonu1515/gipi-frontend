
import { FormControl } from '@angular/forms';
import { Component, ViewEncapsulation, ViewChild, AfterViewInit, OnInit, Input } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SettingListService } from './setting-list.service';
import { MatTableDataSource } from '@angular/material/table'
import { MatSnackBar } from '@angular/material/snack-bar';


export interface PeriodicElement {

}

const ELEMENT_DATA: PeriodicElement[] = [


];

@Component({
  selector: 'app-setting-list',
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.scss'],
})
export class SettingListComponent implements OnInit {

  // @ViewChild('dateList') dateList: NgForm;

  formFieldHelpers: string[] = [''];
  dateListDetails: any;
  dateData: any;
  @Input() columns: Array<any>;

  displayedColumns: string[] = ['Date List'];
  chagesDataList: any;
  data: [] = [];
  dataSource = ELEMENT_DATA;
  constructor(
    public dialog: MatDialog, 
    private _formBuilder: UntypedFormBuilder, 
    private apiService: SettingListService,
    private _snackBar: MatSnackBar
    ) { }


  ngOnInit(): void {
    this.dateList();
  }

  dateList() {
    this.apiService.getCheckDateList().subscribe(async (resolve) => {

      let payloadData = resolve.data.emplianceCheckDate;
      let ELEMENT_DATA = [];

      for(let key in payloadData) {

        let renderDateData = {
          columnName: key,
          cells: []
        };

        for(let innerKey in payloadData[key]) {
          renderDateData.cells.push({
            month: innerKey,
            date: payloadData[key][innerKey]
          }) 
        }

        ELEMENT_DATA.push(renderDateData);

      }

      this.dateListDetails = new MatTableDataSource<any>(ELEMENT_DATA);


    }, (err) => {

      console.log("Error", err);

    })
  }

  changeMonth(event: any, el) {

    el.month = event.target.value;
  }

  changeDate(event: any, el) {

    el.date = event.target.value;

  }

  saveDatedata() {

    this.dateData = this.dateListDetails.filteredData;
    let obj = {
      dateData: this.dateData
    }

    this.apiService.editDateList(obj).subscribe(async (resolve) => {
      this.dateList();
      this._snackBar.open(resolve.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-primary']
      });
    })

  }
}


