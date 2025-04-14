import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PEPService } from '../pep.service';
import { MatTableDataSource } from '@angular/material/table';
import { FuseUtilsService } from '@fuse/services/utils';
import { MatDialog } from '@angular/material/dialog';
import { TablePopupComponent } from 'app/layout/common/table-popup/table-popup.component';

export interface PEPDetails {
    name: string;
    candidateAffidavit: any[];
    legislativeAssembly: any[];
    legislativeCouncil: any[];
    parliamentOfIndia: any[];
}

type BeneColumns = Record<string, string>;

@Component({
    selector: 'app-pep-detail',
    templateUrl: './pep-detail.component.html',
    styleUrls: ['./pep-detail.component.scss'],
})
export class PEPDetailComponent implements OnInit {
    pepId: string;
    pepDetails: any;
    isLoading: boolean = false;
    errorMessage: string = '';
    expandedBene2Rows: boolean[] = [];

    dataSource = new MatTableDataSource<PEPDetails>([]);

    dataKeysToShow: string[] = [
        'legislativeAssembly',
        'legislativeCouncil',
        'parliamentOfIndia',
        'candidateAffidavit',
    ];

    constructor(
        private route: ActivatedRoute,
        private apiService: PEPService,
        private utils: FuseUtilsService,
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.pepId = this.route.snapshot.paramMap.get('id');
        if (this.pepId) {
            this.getPEPDetails(this.pepId);
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
        if (Array.isArray(nestedData) && nestedData.length > 0) {
            this.dialog.open(TablePopupComponent, {
                width: '80vw',
                data: nestedData,
            });
        }
    }

    getPEPDetails(id: string): void {
        this.isLoading = true;
        this.apiService.getPEPById(id).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.dataSource.data = [response.data]; // Convert object to array
                } else {
                    this.dataSource.data = [];
                }
            },
            error: (error) => {
                console.error('Error fetching PEP details:', error);
                this.errorMessage = 'Failed to fetch PEP details.';
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }
}
