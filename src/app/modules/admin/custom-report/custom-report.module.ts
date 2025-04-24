import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { CustomReportComponent } from './custom-report.component';
import { CustomReportRoutingModule } from './custom-report-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { FinancialAssessmentComponent } from './financial-assessment/financial-assessment.component';
import { ForensicAssessmentComponent } from './forensic-assessment/forensic-assessment.component';
import { EvidenceAnnexureComponent } from './evidence-annexure/evidence-annexure.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ExecutiveSummaryComponent } from './executive-summary/executive-summary.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DeletePopupComponent } from './components/delete-popup/delete-popup.component';
import { MatRadioModule } from '@angular/material/radio';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MatListModule, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ExportPopupComponent } from './components/export-popup/export-popup.component';
import { ReportListComponent } from './report-list/report-list.component';
import { QuillModule } from 'ngx-quill';
import { ReportPopupComponent } from './components/report-popup/report-popup.component';
import { SummarizedPopupComponent } from './components/summarized-popup/summarized-popup.component';
import { MatCardModule } from '@angular/material/card';
import { AdverseMediaComponent } from './adverse-media/adverse-media.component';
import { LitigationPopupComponent } from './components/litigation-popup/litigation-popup.component';

@NgModule({
  declarations: [
  CustomReportComponent,
  CompanyProfileComponent,
  FinancialAssessmentComponent,
  ForensicAssessmentComponent,
  EvidenceAnnexureComponent,
  ExecutiveSummaryComponent,
  DeletePopupComponent,
  ConfirmationDialogComponent,
  ExportPopupComponent,
  ReportListComponent,
  ReportPopupComponent,
  SummarizedPopupComponent,
  AdverseMediaComponent,
  LitigationPopupComponent
  ],
  imports: [
    CommonModule,
    CustomReportRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatChipsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatPseudoCheckboxModule,
    FormsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule,
    MatTabsModule,
    AngularEditorModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
   QuillModule.forRoot()  

  ],
  providers: [DatePipe]
})

export class CustomReportModule { }