import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AiResearchService } from '../ai-research.service';

@Component({
    selector: 'app-add-keyword',
    templateUrl: './add-keyword.component.html',
    styleUrls: ['./add-keyword.component.scss'],
})
export class AddKeywordComponent implements OnInit {
    keywordForm: FormGroup;
    isEdit = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<AddKeywordComponent>,
        private fb: FormBuilder,
        private keywordService: AiResearchService
    ) {}

    ngOnInit(): void {
        this.keywordForm = this.fb.group({
            keyword: [
                this.data?.keywordData?.keyword || '',
                [Validators.required],
            ],
        });
        this.isEdit = this.data.isEdit;
    }

    addKeyword(): void {
        if (this.keywordForm.valid) {
            const keyword = this.keywordForm.get('keyword')?.value;
            if (this.isEdit) {
                this.keywordService
                    .updateKeyword(this.data.keywordData?.id, keyword)
                    .subscribe((response) => {
                        console.log('Keyword added successfully:', response);
                        this.dialogRef.close(true);
                    });
            } else {
                this.keywordService.addKeyword(keyword).subscribe(
                    (response) => {
                        console.log('Keyword added successfully:', response);
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
