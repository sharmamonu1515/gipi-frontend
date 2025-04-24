import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { FinancialAssessmentComponent } from './financial-assessment/financial-assessment.component';
import { EvidenceAnnexureComponent } from './evidence-annexure/evidence-annexure.component';
import { ForensicAssessmentComponent } from './forensic-assessment/forensic-assessment.component';
import { CustomReportService } from './services/custom-report.service';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, map, Subject, switchMap, takeUntil } from 'rxjs';
import { ExecutiveSummaryComponent } from './executive-summary/executive-summary.component';
import { CurrencyConversionService } from './financial-assessment/currency-conversion.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ReportDataService } from './services/report-data.service';
import { ExportPopupComponent } from './components/export-popup/export-popup.component';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { PromptService } from './services/prompt.service';
import { AdverseMediaComponent } from './adverse-media/adverse-media.component';

@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
  styleUrls: ['./custom-report.component.scss']
})
export class CustomReportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent: ViewContainerRef;
  userTabs: { TabName: string; Component: any; }[];
  selectedIndex: number = 0;
  isLastActiveTab: boolean = false;
  hasReachedLastTab: boolean = false;
  hasSearchedCompany: boolean = false;
  cinOrPan: string = '';
  companyData: any;
  cinSearchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private loadedComponents: { [key: string]: any } = {};
  searchType = 'cin';
  companyType = 'company';
  
  visitedTabs: Set<string> = new Set();
  currentTabName: string = 'Company Profile';
  currentModel: string = '';
  companyName: string='';

  constructor(
    private cfr: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef,
    private dataService: ReportDataService,
    private currencyService : CurrencyConversionService,
    private dialog: MatDialog,
    private exportService: CustomReportService,
    private route: ActivatedRoute,
    private promptService: PromptService
  ) { 
    this.userTabs = [
      { TabName: 'Company Profile', Component: CompanyProfileComponent },
      { TabName: 'Executive Summary', Component: ExecutiveSummaryComponent},
      { TabName: 'Financial Assessment', Component: FinancialAssessmentComponent },
      { TabName: 'Forensic Assessment', Component: ForensicAssessmentComponent },
      { TabName: 'Evidence Annexure', Component: EvidenceAnnexureComponent },
      { TabName: 'Adverse Media', Component: AdverseMediaComponent },

    ];
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadChild(this.userTabs[0].TabName);
      this.visitedTabs.add(this.userTabs[0].TabName);
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchType = params['searchType'] || 'cin';
      this.companyType = params['companyType'] || 'company';
      this.cinOrPan = params['cinOrPan'] || '';
      this.dataService.clearData();
      this.dataService?.setCompanyData(null);
  
      if (this.cinOrPan) {
        this.fetchCompanyDetails(this.cinOrPan);
      }
    });

    this.promptService.unit$.subscribe((model) => {
      setTimeout(() => {
        this.currentModel = model;
      });
    });
  }

  fetchCompanyDetails(query: string): void {
    this.dataService.getCompanyDetail(query, this.searchType, this.companyType)
      .subscribe({
        next: (data) => {
          if (data?.data) {
            this.companyName = data?.data?.data.company?.legal_name;
            this.hasSearchedCompany = true;
            this.dataService.setCompanyData(data.data);
            this.loadChild('Company Profile');
            this.selectedIndex = 0;
            this.visitedTabs.add('Company Profile');
            this.dataService.setCompanyType(this.companyType)
          }
        },
        error: (error) => {
          console.error('Error fetching company details:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onUnitChange(event: Event) {
    const unit = (event.target as HTMLSelectElement).value;
    this.currencyService.setUnit(unit);
  }
  onModelChange(event : Event){
    const model = (event.target as HTMLSelectElement).value;
    this.promptService.setModel(model);
  }

  loadComponent(eventType: any): any {
    const newTabName = eventType.tab?.textLabel;
    const newTabIndex = eventType.index;
    
    if (!newTabName || newTabName === this.currentTabName) {
      return;
    }
        
    const targetTab = {name: newTabName, index: newTabIndex};
    
    const currentComponent = this.loadedComponents[this.currentTabName];
    
    if (
      currentComponent &&
      'hasUnsavedChanges' in currentComponent &&
      typeof currentComponent.hasUnsavedChanges === 'function' &&
      currentComponent.hasUnsavedChanges()
    ) {
      setTimeout(() => {
        this.selectedIndex = this.userTabs.findIndex(tab => tab.TabName === this.currentTabName);
        this.cdRef.detectChanges();
        
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '400px',
          data: { message: 'You have unsaved changes. Do you want to leave without saving?' }
        });
        
        dialogRef.afterClosed().subscribe((confirmed) => {
          if (confirmed) {
            typeof currentComponent.saveData === 'function' && currentComponent.saveData()
            this.switchTab(targetTab.name, targetTab.index);
          }
          else{
            this.switchTab(targetTab.name, targetTab.index);
          }
        });
      });
    } else {
      this.switchTab(newTabName, newTabIndex);
    }
  }

  private switchTab(tabName: string, index: number): void {
    this.loadChild(tabName);
    this.selectedIndex = index;
    this.currentTabName = tabName;
    this.visitedTabs.add(tabName);
    this.checkAllTabsVisited();
  }

  loadChild(childName: string) {
    const tab = this.userTabs.find((x) => x.TabName === childName);
    if (!tab) return;
    
    this.tabContent?.clear();
    const factory = this.cfr.resolveComponentFactory(tab.Component);
    const compRef: ComponentRef<any> = this.tabContent?.createComponent(factory);
    this.loadedComponents[childName] = compRef.instance;
    this.visitedTabs.add(childName);
    
    this.checkAllTabsVisited();
  }

  checkAllTabsVisited() {
    const requiredTabs = this.userTabs.slice(0, this.userTabs.length - 2);
    
    const allVisited = requiredTabs.every(tab => this.visitedTabs.has(tab.TabName));
    
    if (allVisited) {
      this.hasReachedLastTab = true;
      this.cdRef.detectChanges();
    }
  }

  
  exportToWord() {
  const sectionsData = {
    'Company Profile': [
      'Company Details',
      'Operational Details',
      'GST Details',
      'EPFO Filing Details',
      'Key Managerial Persons',
      'Past Directors / Past Signatories',
      'Credit Rating',
      'Ownership Summary',
      'Ownership Details',
      `Director's Shareholding Details`,
      'Particulars of Holding',
      'MCA Filings',
      'Key Managerial Person Information',
      'Bank Wise Charges',
      'Auditor Details'
    ],
    'Executive Summary': [
      'Executive Summary',
      'Background Risk Band',
      'Sustainability Score',
      'Sustainability Risk Bands'
    ],
    'Financial Assessment': [
      'Financial Highlights & Recommendations',
      'Financial Analyst Observations',
      'Profit and Loss Account Summary',
      'Balance Sheet',
      'Assets',
      'Ratio Analysis'
    ],
    'Forensic Assessment': [
      'Risk Assessment Section',
    ],
  };

  const dialogRef = this.dialog.open(ExportPopupComponent, {
    width: '800px',
    data: { sectionsData }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.exportSelectedSections(result);
    }
  });
}
exportSelectedSections(selectedSections: string[]) {
  const data = {
    companyProfile: this.loadedComponents['Company Profile']?.getData(),
    executiveSummary: this.loadedComponents['Executive Summary']?.getData(),
    financialAssessment: this.loadedComponents['Financial Assessment']?.getData(),
    forensicAssessment: this.loadedComponents['Forensic Assessment']?.getData(),
  };
  
  this.exportService.exportToWord(data, selectedSections);
}


  canExport(): boolean {
    return this.hasSearchedCompany && this.hasReachedLastTab;
  }

  onCompanyTypeChange(event: MatSelectChange): void {
    this.dataService.setCompanyType(event.value);
  }
}
