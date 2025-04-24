
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ReportDataService } from '../services/report-data.service';
import { IKeyManagerPeron } from 'app/interfaces/custom-report';

import { Subscription } from 'rxjs';
import { PromptService } from '../services/prompt.service';

@Component({
    selector: 'app-adverse-media',
    templateUrl: './adverse-media.component.html',
    styleUrls: ['./adverse-media.component.scss'],
})
export class AdverseMediaComponent implements OnInit {
    companyName: string = '';
    generatedContent: string = '';
    referenceContent: string = '';
    companyData: any;
    keyManagerialPersons: any;
    selectedDirectors: any[] = [];
    private modelSubscription: Subscription;
    directorList: any;
    referenceLinks: string[] = [];
    selectField: string;
    isLoading: boolean;
    currentModel: string;
    constructor(
        private dataService: ReportDataService,
        private promptService: PromptService,
        private cdr:ChangeDetectorRef
    ) {}
    ngOnInit() {
        this.companyData = this.dataService.getCompanyData();
        this.companyName = this.companyData?.data?.company?.legal_name;
        this.keyManagerialPersons =
            this.companyData?.data?.authorized_signatories;

        this.extractKeyManagerialPersons(this.keyManagerialPersons);
        this.promptService.setModel('perplexity');
       // this.cdr.detectChanges();
        this.modelSubscription = this.promptService.unit$.subscribe((model) => {
            this.currentModel = model;
        });
    }

    extractKeyManagerialPersons(data: IKeyManagerPeron[]) {
        this.directorList = data
            .filter((detail) => detail?.date_of_cessation === null)
            .map((detail) => ({
                name: detail.name,
            }));
    }

    generateContent() {
        this.dataService
            .generateCompanyContent(
                this.companyName,
                'aboutCompany',
                this.currentModel,
                ''
            )
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.generatedContent = res.data.summary;
                        this.referenceLinks = res.data.referenceLinks;
                    } else {
                        console.warn('Generation failed:', res.message);
                    }
                },
                error: (err) => {
                    console.error('Error generating content:', err);
                },
            });
    }

    generateContentForDirector(director: any) {
        this.dataService
            .generateCompanyContent(
                this.companyName,
                'director',
                this.currentModel,
                director.name
            )
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        director.content = res.data.summary || '';
                        director.referenceLinks = res.data.referenceLinks || [];
                    } else {
                        console.warn(
                            `Director generation failed for ${director.name}:`,
                            res.message
                        );
                    }
                },
                error: (err) => {
                    console.error(
                        `Error generating content for ${director.name}:`,
                        err
                    );
                },
            });
    }

    onDirectorsSelected() {
        for (let director of this.selectedDirectors) {
            if (!director.content) {
                this.generateContentForDirector(director);
            }
        }
    }
    copyToClipboard(text: string) {
        navigator.clipboard
            .writeText(text)
            .then(() => {})
            .catch((err) => {
                console.error('Failed to copy:', err);
            });
    }

    copyText(htmlContent: string): void {
        if (!htmlContent) {
        return;
        }
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        const textarea = document.createElement('textarea');
        textarea.value = textContent;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Could not copy text: ', err);
        }
        
        document.body.removeChild(textarea);
  }
}
