import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AiResearchService } from '../ai-research.service';

@Component({
    selector: 'app-add-url',
    templateUrl: './add-url.component.html',
    styleUrls: ['./add-url.component.scss'],
})
export class AddUrlComponent implements OnInit {
    urlForm: FormGroup;
    isEdit = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<AddUrlComponent>,
        private fb: FormBuilder,
        private researchService: AiResearchService
    ) {}

    ngOnInit(): void {
        this.urlForm = this.fb.group({
            url: [this.data?.urlLabelData?.url || '', [Validators.required]],
            name: [this.data?.urlLabelData?.label || '', [Validators.required]],
        });
        this.isEdit = this.data.isEdit;
    }

    addUrl(): void {
        if (this.urlForm.valid) {
            const url = this.urlForm.get('url')?.value;
            const name = this.urlForm.get('name')?.value;
            if (this.isEdit) {
                this.researchService
                    .updateUrlLabel(this.data?.urlLabelData?.id, url, name)
                    .subscribe((response) => {
                        console.log('Keyword added successfully:', response);
                        this.dialogRef.close(true);
                    });
            } else {
                this.researchService.addUrl(url, name).subscribe(
                    (response) => {
                        console.log('Url added successfully:', response);
                        this.dialogRef.close(true);
                    },
                    (error) => {
                        console.error('Error adding keyword:', error);
                    }
                );
            }
        }
    }
    closeDialog() {
        this.dialogRef.close();
    }
}
