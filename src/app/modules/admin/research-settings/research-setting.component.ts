import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AiResearchService } from '../ai-research/ai-research.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddKeywordComponent } from '../ai-research/add-keyword/add-keyword.component';
import { AddUrlComponent } from '../ai-research/add-url/add-url.component';
import { ToastrService } from 'ngx-toastr';
import { DeletePopupComponent } from '../custom-report/components/delete-popup/delete-popup.component';

@Component({
    selector: 'app-research-setting',
    templateUrl: './research-setting.component.html',
    styleUrls: ['./research-setting.component.scss'],
})
export class ResearchSettingComponent implements OnInit {
    constructor(
        private dialog: MatDialog,
        private researchService: AiResearchService,
        private toast: ToastrService
    ) {}

    ngOnInit(): void {
        this.loadKeywords();
        this.loadNewsSiteUrls();
    }
    keywordsDisplayedColumns: string[] = ['keyword', 'actions'];
    keywordsDataSource = new MatTableDataSource<any>([]);

    urlLabelsDisplayedColumns: string[] = ['label', 'url', 'actions'];
    urlLabelsDataSource = new MatTableDataSource<any>([]);

    loadKeywords(): void {
        this.researchService.getKeywords().subscribe(
            (res) => {
                const formattedData = res.data.map((keyword: any) => ({
                    id: keyword._id,
                    keyword: keyword.value,
                    label: keyword.label,
                }));

                this.keywordsDataSource.data = formattedData;
            },
            (error) => {
                console.error('Error fetching keywords', error);
            }
        );
    }

    loadNewsSiteUrls(): void {
        this.researchService.getNewsSiteUrls().subscribe(
            (res) => {
                const formattedData = res.data.map((data: any) => ({
                    id: data._id,
                    url: data.url,
                    label: data.name,
                }));

                this.urlLabelsDataSource.data = formattedData;
            },
            (error) => {
                console.error('Error fetching news site URLs', error);
            }
        );
    }

    openKeywordDialog(keywordData: any = null, isEdit = false): void {
        const dialogRef = this.dialog.open(AddKeywordComponent, {
            width: '450px',
            height: '300px',
            data: { keywordData, isEdit },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.loadKeywords();
        });
    }

    openUrlLabelDialog(urlLabelData: any = null, isEdit = false): void {
        const dialogRef = this.dialog.open(AddUrlComponent, {
            width: '450px',
            height: '450px',
            data: { urlLabelData, isEdit },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.loadNewsSiteUrls();
        });
    }

    deleteKeyword(id: string): void {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            width: '350px',
            data: { message: 'Are you sure you want to delete this keyword?' },
        });
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.researchService.deleteKeyword(id).subscribe((res) => {
                    if (res.status == 'success') {
                        const data = this.keywordsDataSource.data.filter(
                            (item) => item.id !== id
                        );
                        this.keywordsDataSource.data = data;
                        this.toast.success('Record deleted successfully');
                    }
                });
            }
        });
    }

    deleteUrlLabel(id: string): void {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            width: '350px',
            data: { message: 'Are you sure you want to delete this url?' },
        });
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.researchService.deleteUrl(id).subscribe((res) => {
                    if (res.status == 'success') {
                        const data = this.urlLabelsDataSource.data.filter(
                            (item) => item.id !== id
                        );
                        this.urlLabelsDataSource.data = data;
                        this.toast.success('Record deleted successfully');
                    }
                });
            }
        });
    }
}
