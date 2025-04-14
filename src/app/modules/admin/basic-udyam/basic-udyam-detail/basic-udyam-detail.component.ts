import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasicUdyamService } from '../basic-udyam.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-basic-udyam-detail',
    templateUrl: './basic-udyam-detail.component.html',
    styleUrls: ['./basic-udyam-detail.component.scss']
})
export class BasicUdyamDetailComponent implements OnInit {
    dataSource = new MatTableDataSource<any>([]); // Data source for the table
    isLoading: boolean = false;
    entityDisplayedColumns: string[] = ['entityId', 'name']; // Columns for entity details

    constructor(
        private route: ActivatedRoute,
        private apiService: BasicUdyamService
    ) {}

    ngOnInit(): void {
        const entityId = this.route.snapshot.paramMap.get('id');
        this.fetchUdyamDetail(entityId);
    }

    fetchUdyamDetail(entityId: string): void {
        this.isLoading = true;
        this.apiService.getUdyamDetailById(entityId).subscribe(
            (response) => {
                this.dataSource.data = [response.data]; // Assign the response data to the data source
                this.isLoading = false;
            },
            (error) => {
                console.error('Error fetching Udyam detail:', error);
                this.isLoading = false;
            }
        );
    }

    // Helper method to humanize camel case keys
    humanizeCamelCase(str: string): string {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    }

    // Helper method to get keys from the Udyam data object
    getUdyamDataKeys(udyamData: any): string[] {
        return Object.keys(udyamData);
    }
}