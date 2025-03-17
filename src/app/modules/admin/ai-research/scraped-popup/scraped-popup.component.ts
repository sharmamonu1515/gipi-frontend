import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scraped-popup',
  templateUrl: './scraped-popup.component.html',
  styleUrls: ['./scraped-popup.component.scss']
})
export class ScrapedPopupComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ScrapedPopupComponent>
  ) { }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
