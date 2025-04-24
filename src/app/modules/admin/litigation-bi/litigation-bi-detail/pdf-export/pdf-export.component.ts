import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseUtilsService } from '@fuse/services/utils';
import { LitigationBiService } from '../../litigation-bi.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-pdf-export',
    templateUrl: './pdf-export.component.html',
    styleUrls: ['./pdf-export.component.scss'],
})
export class PdfExportComponent implements OnInit {
    templates: any;
    filters: any;
    id: string;
    entityType: 'company' | 'director';
    selectedTemplate: string;
    templateData: any;
    isLoading: boolean = false;
    downloadRequestSent: boolean = false;

    // create litigation_pdf_templates table
    constructor(@Inject(MAT_DIALOG_DATA) public injectedData: any, private utils: FuseUtilsService, private apiService: LitigationBiService, private _snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.id = this.injectedData.id;
        this.templates = this.injectedData.templates;
        this.filters = this.injectedData.filters;
        this.entityType = this.injectedData.entityType;
    }

    onTemplateChange() {
        this.isLoading = true;
        this.apiService.getTemplateData(this.selectedTemplate).subscribe({
            next: (response) => {
                if (response && response.template) {
                    this.templateData = response.template;
                }
            },
            error: (err) => {
                console.error('Error fetching Litigation BI details:', err);
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }

    generateReport() {
        if (!this.selectedTemplate) {
            this._snackBar.open('Please select template to download!', 'Close', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['mat-toolbar', 'mat-warn'],
            });

            return;
        }

        this.isLoading = true;

        this.apiService.exportPDF(this.id, this.templateData, this.entityType, this.filters).subscribe({
            next: (response) => {
                if (response && response.requestId) {
                    this.downloadRequestSent = true;
                } else {
                    this._snackBar.open('Some error occurred in generating report, please try again!', 'Close', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['mat-toolbar', 'mat-warn'],
                    });
                }
            },
            error: (err) => {
                console.error('Error fetching Litigation BI details:', err);
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }
}
