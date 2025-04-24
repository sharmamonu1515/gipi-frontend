import { Component, OnInit } from '@angular/core';
import { IRiskCategory } from 'app/interfaces/custom-report';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../components/delete-popup/delete-popup.component';
import { ToastrService } from 'ngx-toastr';
import { ReportDataService } from '../services/report-data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-forensic-assessment',
    templateUrl: './forensic-assessment.component.html',
    styleUrls: ['./forensic-assessment.component.scss'],
})
export class ForensicAssessmentComponent implements OnInit {
    riskCategories: IRiskCategory[] = [
        {
            category: 'Legal Assessments',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Taxation Diligence',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Defaults & Delays',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Secretarial Assessments',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Politically Exposed Persons (PEP)',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Global Sanctions',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Anti-Money Laundering & Bribery',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'FIU & Blacklisted',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Voluntary Reported Sources',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Tier 2 Related Part Assessment',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Adverse Media and Independent Source',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Politicly Affiliated Persons (PAP)',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Operational & Financial Default',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Credit & Tax Default',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Consumer Disputes',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Regulatory Defaults',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
        {
            category: 'Blacklisted & Suspended NGOs and Trusts',
            result: 'No Match Found',
            tags: '',
            actions: '',
        },
    ];

    private originalData: string = '';

    constructor(
        private reportService : ReportDataService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private http:HttpClient,
        private dataService: ReportDataService
    ) {}

    ngOnInit(): void {
        this.reportService.getForensicAssessmentData().subscribe((savedData: any) => {
            if (savedData && savedData.riskCategories) {
                this.riskCategories = savedData.riskCategories;
            }
    
            this.originalData = JSON.stringify(this.getData());
        });
    }      

    hasUnsavedChanges(): boolean {
        const currentData = JSON.stringify(this.getData());
        return this.originalData !== currentData;
    }

    onNext() {}

    getData() {
        const data = {
            riskCategories: this.riskCategories,
            matchFoundCount:this.matchFoundCount
        };
        return data;
    }
    get matchFoundCount(): number {
        return this.riskCategories.filter(item => item.result === 'Match Found').length;
      }
      
    addRow() {
        this.riskCategories.push({
            category: '',
            result: 'No Match Found',
            tags: '',
            actions: '',
        });
    }

    saveData() {
        const data = this.getData();
        const apiUrl = `${environment.baseURI}/custom-report/add-forensic-assessment`;
        const body = {company_id: this.dataService?.getCompanyId(), ...data};
        this.http.post(`${apiUrl}`,body).subscribe((response) => {
            if(response) {
                this.reportService.setData('forensicAssessment', data);
                this.toastr.success('Forensic assessment data saved successfully');
                this.originalData = JSON.stringify(data);
            }
        });
    }

    updateAction(item: IRiskCategory) {
        if (item.result === 'Match Found' || item.result==='Partial Match Found') {
            item.actions = 'Monitoring is recommended';
        } else {
            item.actions = '';
        }
    }

    openDeleteDialog(index: number) {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            width: '350px',
            data: { message: 'Are you sure you want to delete this row?' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.deleteRow(index);
            }
        });
    }
    deleteRow(index: number) {
        this.riskCategories.splice(index, 1);
        this.toastr.success('Row deleted successfully!');
    }
}
