import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReportDataService } from '../services/report-data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { SummarizedPopupComponent } from '../components/summarized-popup/summarized-popup.component';
import { PromptService } from '../services/prompt.service';
import { Subscription } from 'rxjs';
import { ApiResponse } from 'app/interfaces/common';
import { SummaryData } from 'app/interfaces/ai-summary';

@Component({
    selector: 'app-executive-summary',
    templateUrl: './executive-summary.component.html',
    styleUrls: ['./executive-summary.component.scss'],
})
export class ExecutiveSummaryComponent implements OnInit {
    @ViewChild('riskDropdown') riskDropdown!: ElementRef;
    selectedRiskBand: string = '';
    riskBandColor: string = '';
    executiveForm: FormGroup;
    colourBandForm: FormGroup;
    sustainibilityBandForm: FormGroup;
    private originalData: string = '';
    companyData: any;
    description:any;
    isLoading: boolean = false;
    selectField: string = '';
    private modelSubscription: Subscription;
    currentModel: string;
    suggestiveBand: string | null = null;

    constructor(
        private fb: FormBuilder,
        private dataService: ReportDataService,
        private toastr: ToastrService,
        private http: HttpClient,
        private dialog: MatDialog,
        private promptService: PromptService
    ) {}

    private quillEditorFields: string[] = [
        'aboutEntity',
        'managementAssessment',
        'operationalAssessment',
        'financialAssessment',
        'complianceAssessment',
        'commentsDisclaimer'
    ];
    
    private quillEditors: {[key: string]: any} = {};
    
    onEditorCreated(editor: any, fieldName: string) {
        this.quillEditors[fieldName] = editor;
        
        const currentValue = this.executiveForm.get(fieldName)?.value;
        if (currentValue) {
            this.setQuillContent(fieldName, currentValue);
        }
    }
  
    editorConfig = {
        readOnly: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], 
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }], 
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'header': [1, 2, 3, false] }], 
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link'],
        ]
      };
      
    sustainabilityData = [
        { parameter: 'Management Evaluation', weight: 20, score: '' },
        { parameter: 'Operational Assessment', weight: 25, score: '' },
        { parameter: 'Financial Assessment', weight: 25, score: '' },
        { parameter: 'Legal/Compliance Screening', weight: 30, score: '' },
        { parameter: 'Sub-Total', weight: 100, score: '' },
        { parameter: 'Overriding Factors', weight: '', score: '' },
        { parameter: 'Partner Sustainability Score', weight: 100, score: '' },
        { parameter: 'Risk Score Range', weight: null, score: 0 },
    ];

    riskOptions = [
        {   label: 'Secure', 
            value: 'Secure', 
            color: '#008000' 
        },
        {   label: 'Stable', 
            value: 'Stable', 
            color: '#59b300' 
        },
        {
            label: 'Normal',
            value: 'Normal',
            color: '#ffbf00',
        },
        {
            label: 'Caution',
            value: 'Caution',
            color: '#ea580c',
        },
        {
            label: 'Critical',
            value: 'Critical',
            color: '#B20000',
        },
        {
            label: 'NRI- No Risk Identified',
            value: 'NRI',
            color: '#ffffff',
        },
        {
            label: 'Out of Business (OOB)',
            value: 'OutOfBusiness',
            color: '#000000',
        },
    ];

    sustainabilityriskBands = [
        {
            score: '86-100',
            value: 'Our Assessment/Evaluation of the entity has identified low risk/secure for the subject entity. Our sustainability assessment identifies high sustainability of the entity and its progressive operations.',
            label: 'Low Risk',
            color: '#008000',
        },
        {
            score: '73-85',
            value: 'Our Assessment/Evaluation of the entity has identified stable elements of hampering sustainability for the subject entity. Our sustainability assessment identifies stable level of operational sustainability for the subject entity.',
            label: 'Moderate Risk',
            color: '#59b300',
        },
        {
            score: '56-72',
            value: 'Our Assessment/Evaluation of the entity has identified as average, owing to elements of hampering sustainability for the subject entity. Our sustainability assessment identifies average level sustainability of the entity, and advise empanelment with caution.',
            label: 'Average Risk',
            color: '#ffbf00',
        },
        {
            score: '34-55',
            value: 'Our Assessment/Evaluation of the entity has identified to be cautioned, owing to elements hampering long-term sustainability and has inherent risk associated with the subject entity. Our sustainability assessment identifies high level of sustainability risk associated with the subject entity, advise monitoring if empaneled.',
            label: 'Below Average Risk',
            color: '#ea580c',
        },
        {
            score: 'Less than 33',
            value: 'Our Assessment/Evaluation of the entity has identified catastrophically high-risk elements hampering sustainability and has inherent risk associated working with the subject entity. Our sustainability assessment identifies high level of sustainability risk associated with the entity and advise non-empanelment.',
            label: 'High Risk',
            color: '#B20000',
        },
    ];

    get riskAssessments(): FormArray {
        return this.executiveForm.get('riskAssessments') as FormArray;
    }

    updateRiskBandColor(value: string) {
        const selectedOption = this.riskOptions.find(
            (option) => option.value === value
        );
        this.selectedRiskBand = selectedOption ? selectedOption.label : '';
        this.riskBandColor = selectedOption ? selectedOption.color : '';
    }

    ngOnInit(): void {
        this.promptService.setModel('gemini');
        this.modelSubscription = this.promptService.unit$.subscribe((model) => {
            this.currentModel = model;
        });
        this.companyData = this.dataService.getCompanyData();
        this.description = this.companyData?.data?.description;
        this.colourBandForm = this.fb.group({});
        this.sustainibilityBandForm = this.fb.group({});

        this.riskOptions.forEach((band) => {
            this.colourBandForm.addControl(
                band.value,
                this.fb.control(this.getDefaultValue(band.value))
            );
        });

        this.executiveForm = this.createForm([
            'riskBand',
            'aboutEntity',
            'managementAssessment',
            'operationalAssessment',
            'financialAssessment',
            'complianceAssessment',
            'commentsDisclaimer',
        ]);
        const defaultValue = '<p>The assessment has been carried out based on available information. The activities of promoters & entities management have drawn our conclusion of analysis to Caution risk identified for the entity for their association with the type of industry. We recommend monitoring this entity owing to any statutory delay, non-filing and fines and penalties repercussion is borne by Operational Creditor.<br>The details of our assessment are comprehensively examined, and proof of records are listed in our Report Annexure for your reference. No further area of concerns was identified in connection with the names screened for this Report that would qualify as being “at risk” as per the information available in Empliance database.</p>';

        this.setQuillContent('commentsDisclaimer', defaultValue);

        this.loadData();
        this.originalData = JSON.stringify(this.getData());
    }    

    private setQuillContent(fieldName: string, content: string) {
        const editor = this.quillEditors[fieldName];
        if (editor && content) {
          editor.setText('');
          editor.clipboard.dangerouslyPasteHTML(content);
        }
    }
      
    loadData() {
        this.dataService.getExecutiveSummaryData().subscribe((savedData) => {
          if (savedData) {
            this.updateRiskBandColor(savedData.executiveSummaryForm?.riskBand);
            
            if (savedData.executiveSummaryForm) {
              const quillContents: {[key: string]: string} = {};
              this.quillEditorFields.forEach(field => {
                if (savedData.executiveSummaryForm[field]) {
                  quillContents[field] = savedData.executiveSummaryForm[field];
                }
              });
              
              this.executiveForm.patchValue(savedData.executiveSummaryForm);
              
              Object.keys(quillContents).forEach(field => {
                this.setQuillContent(field, quillContents[field]);
              });
            }
            if (savedData.sustainibilityBandScore) {
              this.sustainabilityData = savedData.sustainibilityBandScore;
            }
          }
        });
    }

    hasUnsavedChanges(): boolean {
        const currentData = JSON.stringify(this.getData());
        return this.originalData !== currentData;
    }

    getDefaultValue(bandValue: string): string {
        const defaultValues: { [key: string]: string } = {
            Secure: 'A Subject Entity or Key Managerial Person have updated compliance and no critical red flags observed under Management, Operations, Finance & Legal and Compliance or red flagged under regulatory or statutory sanctioned database.',
            Normal: 'A Subject Entity or Key Managerial Person is slightly non-compliant through delay in disclosures, or statutory filing. Also, the Entity or KMP is not cited in adverse media articles, Defaulter having unfair business practice, also is not involved in illegitimate businesses, not violating any statutory laws like FCPA, Bribery, Politically Exposed Person, Defaulter in Mandatory Compliance, Non-Compliance through disclosure, defaulter or red flagged under regulatory or statutory sanctioned database.',
            Stable: 'A Subject Entity or Key Managerial Person is not a non-compliant or delayed in disclosures or statutory filing. Also, the Entity or KMP is not cited in, adverse media articles, defaulter having unfair business practice, also is not involved in illegitimate businesses, not violating any statutory laws like FCPA, Bribery, Politically Exposed Person, Defaulter in Mandatory Compliance, Non-Compliance through disclosure, defaulter or red flagged under regulatory or statutory sanctioned database.',
            Critical:
                'A Subject Entity or Key Managerial Person is cited in legal litigation, Prosecution records, adverse media articles, have unfair business practice, also is involved in illegitimate businesses. Our classification covers involvement in violating statutory laws like FCPA, Bribery, Involvement with a Politically Exposed Person, Declared Defaulter in Following or Filing Mandatory Compliance, Non-Compliance through disclosure, defaulter or red flagged under regulatory or statutory sanctioned database.',
            Caution:
                'A Subject Entity or Key Managerial Person is cited with non-compliance through disclosures, Default in Compliance filing of related/associated businesses. Citation in disposed litigations against the entity or default in tax & filing statutory return obligated as per the companies act or law of the land.',
            NRI: 'A Subject Entity or Key Managerial Person under evaluation where we were unable to identify any risk owing to entity being recently incorporated or major laws are inapplicable, or any major default was unidentified against the subject entity or key managerial person.',
            OutOfBusiness:
                'A Subject Entity which is either out of current business owing to bankruptcy, No Financial Leverage, amalgamated, voluntarily closed down business, Death of KMP or have been Insolvent',
        };

        return defaultValues[bandValue] || '';
    }

    private createForm(fields: string[]): FormGroup {
        const formGroup = this.fb.group({});
        fields.forEach((field) => {
            let defaultValue = ''; 
            if (field === 'commentsDisclaimer') {
                defaultValue = 'The assessment has been carried out based on available information. The activities of promoters & entities management have drawn our conclusion of analysis to Caution risk identified for the entity for their association with the type of industry. We recommend monitoring this entity owing to any statutory delay, non-filing and fines and penalties repercussion is borne by Operational Creditor.<br>The details of our assessment are comprehensively examined, and proof of records are listed in our Report Annexure for your reference. No further area of concerns was identified in connection with the names screened for this Report that would qualify as being “at risk” as per the information available in Empliance database.';
            } 
            if( field === 'aboutEntity'){
                defaultValue=this.description?.desc_thousand_char;
            }
            formGroup.addControl(field, this.fb.control(defaultValue));
        });
        return formGroup;
    }

    updateSubtotal(): void {
        let total = this.sustainabilityData
            .filter(item => 
                item.parameter !== 'Sub-Total' &&
                item.parameter !== 'Overriding Factors' &&
                item.parameter !== 'Partner Sustainability Score' &&
                item.parameter !== 'Risk Score Range'
            )
            .reduce((acc, curr) => acc + (parseFloat(String(curr.score)) || 0), 0);
        const subTotalItem = this.sustainabilityData.find(item => item.parameter === 'Sub-Total');
        if (subTotalItem) {
            subTotalItem.score = total;
        }
        let overridingFactor = this.sustainabilityData.find(item => item.parameter === 'Overriding Factors')?.score || '';
        if (overridingFactor === '') {
            const partnerSustainabilityItem = this.sustainabilityData.find(item => item.parameter === 'Partner Sustainability Score');
            if (partnerSustainabilityItem) {
                partnerSustainabilityItem.score = total;
            }
        }
    }
    
    updatePartnerSustainabilityScore(): void {
        let subTotal = parseFloat(String(this.sustainabilityData.find(item => item.parameter === 'Sub-Total')?.score)) || 0;
        let overridingFactor = parseFloat(String(this.sustainabilityData.find(item => item.parameter === 'Overriding Factors')?.score)) || 0;
        const partnerSustainabilityItem = this.sustainabilityData.find(item => item.parameter === 'Partner Sustainability Score');
        if (partnerSustainabilityItem) {
            partnerSustainabilityItem.score = (subTotal + overridingFactor).toString();
        }
    }
    
    getRiskDetails(score: number | string | null | undefined): { color: string; label: string } | null {
        const numScore = parseFloat(String(score));
    
        if (!score || isNaN(numScore)) {
            return null; 
        }
    
        if (numScore >= 86) return { color: 'bg-green-700', label: 'Low Risk' };
        if (numScore >= 73) return { color: 'bg-green-500', label: 'Moderate Risk' };
        if (numScore >= 56) return { color: 'bg-yellow-500', label: 'Average Risk' };
        if (numScore >= 34) return { color: 'bg-orange-600', label: 'Below Average Risk' };
    
        return { color: 'bg-red-700', label: 'High Risk' };
    }
    
    getPartnerSustainabilityScore(): number {
        return parseFloat(String(this.sustainabilityData.find(item => item.parameter === 'Partner Sustainability Score')?.score || 0));
    }
    
    getData() {
        const data = {
            executiveSummaryForm: this.executiveForm.value,
            backgroundRiskBand: this.colourBandForm.value,
            sustainibilityBandScore: this.sustainabilityData,
            sustainibilityBandForm: this.sustainabilityriskBands,
        };
        return data;
    }

    saveData() {
        const data = this.getData();
        const body = {company_id: this.dataService?.getCompanyId(), ...data};
        const apiUrl = `${environment.baseURI}/custom-report/add-executive-summary`;
        this.http.post(`${apiUrl}`,body).subscribe((response) => {
            if(response) {
                this.dataService.setData('executiveSummary', data);
                this.toastr.success('Executive summary data saved successfully');
                this.originalData = JSON.stringify(data);
            }
        });
    }

    summarizeAssessment(fieldName: string) {
        this.selectField = fieldName;
        const content = this.executiveForm.get(fieldName)?.value;
    
        this.isLoading = true;
        this.dataService.summarizeContent(content,fieldName,this.currentModel).subscribe({
            next: (result: ApiResponse<SummaryData>) => {
                const summaryResult = result.data.modifiedData ? result.data.modifiedData : result.data;
                this.openPopup(summaryResult);
                this.isLoading = false;
            },
            error: (err) => {
                this.toastr.error(err.error.message || "Error occurred while summarizing");
                this.isLoading = false;
            },
        });
    }
    
    openPopup(summaryResult: any): void {
        const dialogRef = this.dialog.open(SummarizedPopupComponent, {
          disableClose: true,
          width: '700px',
          data: summaryResult,
        });
      
        dialogRef.afterClosed().subscribe((selectedSummaries: string[] | undefined) => {
          if (selectedSummaries && selectedSummaries.length > 0) {
            console.log('User selected:', selectedSummaries);
      
            const value = `<ol>${selectedSummaries
              .map(summary => `<li>${summary}</li>`)
              .join('')}</ol>`;
      
            this.setQuillContent(this.selectField, value);
          } else {
            console.log('Dialog closed without selection');
          }
        });
    }

    validateSections() {
        const managementAssessment = this.executiveForm.get('managementAssessment')?.value;
        const operationalAssessment = this.executiveForm.get('operationalAssessment')?.value;
        const complianceAssessment = this.executiveForm.get('complianceAssessment')?.value;
    
        return managementAssessment && operationalAssessment && complianceAssessment;
    }    

    getSuggestiveBand() {
        if (!this.validateSections()) {
            this.toastr.error('Please fill all the sections to generate the suggestive band');
            return;
        }

        const plainTextManagementAssessment = this.quillEditors['managementAssessment']?.getText() || '';
        const plainTextOperationalAssessment = this.quillEditors['operationalAssessment']?.getText() || '';
        const plainTextLegalAssessment = this.quillEditors['complianceAssessment']?.getText() || '';

        const requestBody = {
            managementAssessment: plainTextManagementAssessment,
            operationalAssessment: plainTextOperationalAssessment,
            legalAssessment: plainTextLegalAssessment,
            model: this.promptService.getCurrentModel()
        };

        this.http.post(`${environment.baseURI}/ai/risk-band`, requestBody).subscribe(
            (response: any) => {
                this.suggestiveBand = response.data.riskBand;
            },
            (error) => {
                console.error('Error fetching suggestive band:', error);
                this.toastr.error('Failed to get suggestive band. Please try again later.');
            }
        );
    }

    getBandColor(label: string): string {
        const found = this.riskOptions.find(option => option.label === label);
        return found?.color || '#000000';
    }
}
