import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KarzaSettingsService } from './karza-settings.service';

@Component({
    selector: 'app-karza-settings',
    templateUrl: './karza-settings.component.html',
    styleUrls: ['./karza-settings.component.scss'],
})
export class KarzaSettingsComponent implements OnInit {
    isLoading: boolean = false;
    karzaSettingsForm: FormGroup;
    hideTest:boolean = true;
    hideTestApiKey: boolean = true;
    hideLive:boolean = true;
    hideLiveApiKey: boolean = true;

    constructor(
        private fb: FormBuilder,
        private apiService: KarzaSettingsService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.karzaSettingsForm = this.fb.group({
            testMode: [false], // Toggle default is false
            testUsername: [''],
            testPassword: [''],
            testApiKey: [''],
            liveUsername: [''],
            livePassword: [''],
            liveApiKey: [''],
        });

        this.getSettings(); // Load saved settings on component init
    }

    saveSettings(): void {
        if (this.karzaSettingsForm.invalid) return;

        const settingsData = this.karzaSettingsForm.value;

		this.isLoading = true;

		this.apiService.saveSettings(settingsData).subscribe({
            next: () => {
                this.snackBar.open('Settings saved successfully!', 'Close', {
                    duration: 5000,
					panelClass: ['mat-toolbar', 'mat-primary'],
                });
            },
            error: (error) => {
                console.error('Error saving settings:', error);
                this.snackBar.open('Failed to save settings.', 'Close', {
                    duration: 5000,
					panelClass: ['error-snackbar'],
                });
            },
			complete: () => {
				this.isLoading = false;
			}
        });
    }

    getSettings(): void {
		this.isLoading = true;

        this.apiService.getSettings().subscribe({
			next: (response) => {
				this.karzaSettingsForm.patchValue(response);
			},
			error: (error) => {
				console.error('Error saving settings:', error);
                this.snackBar.open('Failed to load settings.', 'Close', {
                    duration: 5000,
					panelClass: ['error-snackbar'],
                });
			},
			complete: () => {
				this.isLoading = false;
			}
		});
    }
}
