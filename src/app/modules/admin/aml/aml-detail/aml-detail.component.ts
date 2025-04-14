import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AMLService } from '../aml.service';
import { MatTableDataSource } from '@angular/material/table';
import { FuseUtilsService } from '@fuse/services/utils';
import { MatDialog } from '@angular/material/dialog';
import { TablePopupComponent } from 'app/layout/common/table-popup/table-popup.component';

export interface AMLDetails {
    name: string;
    candidateAffidavit: any[];
    legislativeAssembly: any[];
    legislativeCouncil: any[];
    parliamentOfIndia: any[];
}

@Component({
    selector: 'app-aml-detail',
    templateUrl: './aml-detail.component.html',
    styleUrls: ['./aml-detail.component.scss'],
})
export class AMLDetailComponent implements OnInit {
    amlId: string;
    amlDetails: any;
    isLoading: boolean = false;
    errorMessage: string = '';

    dataSource = new MatTableDataSource<AMLDetails>([]);

    dataKeysToShow: string[] = [
        'legislativeAssembly',
        'legislativeCouncil',
        'parliamentOfIndia',
        'candidateAffidavit',
    ];

    constructor(
        private route: ActivatedRoute,
        private apiService: AMLService,
        private utils: FuseUtilsService,
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.amlId = this.route.snapshot.paramMap.get('id');
        if (this.amlId) {
            this.getAMLDetails();
        }
    }

    getObjectKeys(key: string): any[] {
        return this.dataSource.data[0][key].length ? Object.keys(this.dataSource.data[0][key][0]) : [];
    }

    getColumnValue(data: any, col: string): string {
        const value = data[col] || '';

        return value;
    }

    openDialog(nestedData: any[]): void {
        this.dialog.open(TablePopupComponent, {
            width: '80vw',
            data: this.utils.parseNestedData(nestedData),
        });
    }

    getAMLDetails(): void {
        this.isLoading = true;
        this.apiService.getAMLById(this.amlId).subscribe({
            next: (response) => {
                if (response && response.data) {
                    console.log(response.data)
                    this.dataSource.data = [response.data]; // Convert object to array
                } else {
                    this.dataSource.data = [];
                }
            },
            error: (error) => {
                console.error('Error fetching AML details:', error);
                this.errorMessage = 'Failed to fetch AML details.';
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }
}
