import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DirectorService } from '../director.service';
import { MatTableDataSource } from '@angular/material/table';
import { FuseUtilsService } from '@fuse/services/utils';
import { MatDialog } from '@angular/material/dialog';
import { TablePopupComponent } from 'app/layout/common/table-popup/table-popup.component';

@Component({
    selector: 'app-director-detail',
    templateUrl: './director-detail.component.html',
    styleUrls: ['./director-detail.component.scss'],
})
export class DirectorDetailComponent implements OnInit {
    directorId: string;
    directorDetails: any;
    entities: string[] = ['entities', 'formerEntities'];
    isLoading: boolean = false;
    errorMessage: string = '';

    dataSource = new MatTableDataSource<any>([]);

    constructor(
        private route: ActivatedRoute,
        private apiService: DirectorService,
        private utils: FuseUtilsService,
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.directorId = this.route.snapshot.paramMap.get('id');
        if (this.directorId) {
            this.getDirectorDetails();
        }
    }

    getObjectKeys(data: any): any[] {
        return Object.keys(data).filter(k => k !== 'entities' && k !== 'formerEntities'); // entities and former entities will have separate table
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

    getDirectorDetails(): void {
        this.isLoading = true;
        this.apiService.getDirectorById(this.directorId).subscribe({
            next: (response) => {
                if (response && response.data) {
                    console.log(response.data)
                    this.dataSource.data = [response.data]; // Convert object to array
                } else {
                    this.dataSource.data = [];
                }
            },
            error: (error) => {
                console.error('Error fetching Director details:', error);
                this.errorMessage = 'Failed to fetch Director details.';
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }
}
