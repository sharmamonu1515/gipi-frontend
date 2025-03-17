
import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GipiApiService } from './gipi-api.service';
import { MatTableDataSource } from '@angular/material/table'
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-gipi-api',
  templateUrl: './gipi-api.component.html',
  styleUrls: ['./gipi-api.component.scss'],
})
export class GipiApiComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FinancialFormComponent, {
      width: '50%',
      disableClose: false,
      data: {
       
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      
    })
  }

}

//Create financial dialog
@Component({
  selector: 'app-financial-form',
  templateUrl: './financial-form.component.html',
  styleUrls: ['./financial-form.component.scss']
})

export class FinancialFormComponent implements OnInit {
  
 
  constructor(
    public dialogRef: MatDialogRef<FinancialFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data_dialog: any,
  ) {
  }

  ngOnInit() {
    
  }

  submitData() {
    
  }

  closeDialog() {
    this.dialogRef.close();
  }

}

