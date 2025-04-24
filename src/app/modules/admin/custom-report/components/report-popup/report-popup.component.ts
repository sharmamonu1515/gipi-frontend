import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment';
import { ReportDataService } from '../../services/report-data.service';

@Component({
  selector: 'app-report-popup',
  templateUrl: './report-popup.component.html',
  styleUrls: ['./report-popup.component.scss']
})
export class ReportPopupComponent {
  popupForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReportPopupComponent>,
    private dataService: ReportDataService,
    private http: HttpClient,
    private toastr : ToastrService
  ) {
    this.popupForm = this.fb.group({
      companyType: ['company'],
      searchType: ['cin'], 
      value: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    const trimmedValue = this.popupForm.value.value?.trim();
    const apiUrl = `${environment.baseURI}/custom-report/add-company-log`;
    const requestBody = {
      company_type: this.popupForm.value.companyType,
      search_type: this.popupForm.value.searchType,
      cinOrPan: trimmedValue
    };

    this.http.post(apiUrl, requestBody).subscribe({
      next: (response: any) => {
        if(response && response.data && !response.data.isExisting){
          this.toastr.success('Request received. We are processing the data please wait a moment and refresh the page shortly...')
        }else{
          this.toastr.success('Company log added successfully!', 'Success');
        } 
        this.dialogRef.close(response); 
      },
      error: (error) => {
        this.toastr.error(error?.error?.message || 'Error adding company log. Try again!', 'Error');
        console.error('API Error:', error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCompanyTypeChange(event: MatSelectChange): void {
    this.dataService.setCompanyType(event.value);
  }
}