import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeerComparisonService } from '../peer-comparison.service';
import { MatTableDataSource } from '@angular/material/table';
import { FuseUtilsService } from '@fuse/services/utils';
import { MatDialog } from '@angular/material/dialog';
import { TablePopupComponent } from 'app/layout/common/table-popup/table-popup.component';

@Component({
    selector: 'app-peer-comparison-detail',
    templateUrl: './peer-comparison-detail.component.html',
    styleUrls: ['./peer-comparison-detail.component.scss'],
})
export class PeerComparisonDetailComponent implements OnInit {
    directorId: string;
    directorDetails: any;
    financialSummaries: string[] = ['incomeState', 'ratAnalysis', 'balSheet'];
    isLoading: boolean = false;
    errorMessage: string = '';

    dataSource = new MatTableDataSource<any>([]);

    constructor(
        private route: ActivatedRoute,
        private apiService: PeerComparisonService,
        private utils: FuseUtilsService,
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.directorId = this.route.snapshot.paramMap.get('id');
        if (this.directorId) {
            this.getPeerComparisonDetails();
        }
    }

    getObjectKeys(data: any): any[] {
        const keysToExclude: string[] = ['businessActivity', 'currentFinancialSummary', 'metadata', 'kid'];
        return Object.keys(data).filter(k => !keysToExclude.includes(k));
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

    getPeerComparisonDetails(): void {
        this.isLoading = true;
        this.apiService.getPeerComparisonById(this.directorId).subscribe({
            next: (response) => {
                if (response && response.data) {
                    console.log(response.data)
                    this.dataSource.data = [response.data]; // Convert object to array
                } else {
                    this.dataSource.data = [];
                }
            },
            error: (error) => {
                console.error('Error fetching Peer Comparison details:', error);
                this.errorMessage = 'Failed to fetch Peer Comparison details.';
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }
}
