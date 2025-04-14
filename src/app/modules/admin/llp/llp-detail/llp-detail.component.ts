import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LLPService } from '../llp.service';
import { MatTableDataSource } from '@angular/material/table';
import { FuseUtilsService } from '@fuse/services/utils';

@Component({
    selector: 'app-llp-detail',
    templateUrl: './llp-detail.component.html',
    styleUrls: ['./llp-detail.component.scss']
})
export class LLPDetailComponent implements OnInit {
    dataSource = new MatTableDataSource<any>([]);
    isLoading: boolean = false;
    entityDisplayedColumns: string[] = ['entityId', 'companyName', 'lastDownloaded'];

    constructor(
        private route: ActivatedRoute,
        private apiService: LLPService,
        private utils: FuseUtilsService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.fetchLLPDetails(id);
    }

    getObjectKeys(obj: any): string[] {
        return Object.keys(obj);
    }

    fetchLLPDetails(id: string): void {
        this.isLoading = true;
        this.apiService.getLLPById(id).subscribe({
            next: (response) => {
                this.dataSource.data = [response.data];
            },
            error: (error) => {
                console.error('Error fetching LLP details:', error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
}