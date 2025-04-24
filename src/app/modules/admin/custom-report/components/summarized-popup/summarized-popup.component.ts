import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-summarized-popup',
  templateUrl: './summarized-popup.component.html',
  styleUrls: ['./summarized-popup.component.scss']
})
export class SummarizedPopupComponent implements OnInit {
  selectedSummaries: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<SummarizedPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  closePopup(): void {
    this.dialogRef.close();
  }

  toggleSelection(option: string): void {
    const index = this.selectedSummaries.indexOf(option);
    if (index > -1) {
      this.selectedSummaries.splice(index, 1); // Deselect
    } else {
      this.selectedSummaries.push(option); // Select
    }
  }

  submit(): void {
    this.dialogRef.close(this.selectedSummaries);
  }

  isSelected(option: string): boolean {
    return this.selectedSummaries.includes(option);
  }
}
