import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-summarize-popup',
  templateUrl: './summarize-popup.component.html',
  styleUrls: ['./summarize-popup.component.scss']
})
export class SummarizePopupComponent implements OnInit {

  constructor(

    public dialogRef: MatDialogRef<SummarizePopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
  }
  closeDialog(): void {
    this.dialogRef.close();
}
copyToClipboard(content: string | null) {
  if (content) {
      navigator.clipboard.writeText(content)
  }
}
}
