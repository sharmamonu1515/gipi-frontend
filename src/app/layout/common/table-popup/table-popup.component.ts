import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-table-popup',
    templateUrl: './table-popup.component.html',
    styleUrls: ['./table-popup.component.scss'],
})
export class TablePopupComponent implements OnInit {
    tableData: any[] = [];
    displayedColumns: string[] = [];

    constructor(
        public dialogRef: MatDialogRef<TablePopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.prepareTableData(data);
    }

    ngOnInit(): void {}

    prepareTableData(data: any): void {
        if (Array.isArray(data) && data.length > 0) {
            this.tableData = data;
            this.displayedColumns = Object.keys(data[0]);
        }
    }

    close(): void {
        this.dialogRef.close();
    }
}
