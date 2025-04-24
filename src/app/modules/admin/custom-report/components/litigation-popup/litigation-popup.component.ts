import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-litigation-popup',
    templateUrl: './litigation-popup.component.html',
    styleUrls: ['./litigation-popup.component.scss'],
})
export class LitigationPopupComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<LitigationPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string
    ) {}

    ngOnInit(): void {}

    closeDialog(): void {
        this.dialogRef.close();
    }

    copyToClipboard(htmlContent: string): void {
        if (!htmlContent) {
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        const textContent = tempDiv.textContent || tempDiv.innerText || '';

        const textarea = document.createElement('textarea');
        textarea.value = textContent;
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Could not copy text: ', err);
        }

        document.body.removeChild(textarea);
    }
}
