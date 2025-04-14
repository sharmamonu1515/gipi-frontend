import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { BasicUdyamService } from './basic-udyam.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-basic-udyam-dialog',
    templateUrl: './basic-udyam-dialog.component.html',
    styleUrls: ['./basic-udyam-dialog.component.scss'],
})
export class BasicUdyamDialogComponent implements OnInit {
    basicUdyamForm: UntypedFormGroup;

    constructor(
        public dialogRef: MatDialogRef<BasicUdyamDialogComponent>,
        private _formBuilder: UntypedFormBuilder,
        private apiService: BasicUdyamService,
        private _snackBar: MatSnackBar,
        private router: Router // Inject Router for navigation
    ) {}

    ngOnInit(): void {
        this.basicUdyamForm = this._formBuilder.group({
            entityId: ['', [Validators.required]], // Only Entity ID is required
        });
    }

    onSubmit(): void {
        if (this.basicUdyamForm.invalid) {
            return;
        }

        const entityId = this.basicUdyamForm.get('entityId').value;

        // Call the API to search for the entity
        this.apiService.searchUdyamDetail(entityId).subscribe({
            next: (response) => {
                if (response.data) {
                    this.router.navigate([`/basic-udyam/basic-udyam/${entityId}`]);
                    this.dialogRef.close(true); // Close the dialog
                } else {
                    this._snackBar.open(
                        'No entity found with the provided ID.',
                        'Close',
                        {
                            duration: 5000,
                            panelClass: ['error-snackbar'],
                        }
                    );
                }
            },
            error: (error) => {
                this._snackBar.open(
                    'Failed to search for the entity. Please try again.',
                    'Close',
                    {
                        duration: 5000,
                        panelClass: ['error-snackbar'],
                    }
                );
            },
        });
    }

    onCancel(): void {
        this.dialogRef.close(false); // Close dialog without any action
    }
}
