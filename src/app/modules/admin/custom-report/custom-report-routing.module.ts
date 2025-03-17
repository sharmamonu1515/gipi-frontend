import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomReportComponent } from './custom-report.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { FinancialAssessmentComponent } from './financial-assessment/financial-assessment.component';
import { ForensicAssessmentComponent } from './forensic-assessment/forensic-assessment.component';
import { EvidenceAnnexureComponent } from './evidence-annexure/evidence-annexure.component';


const routes: Routes = [
  {
    path: "", component: CustomReportComponent
  },
  {
    path: "company-profile", component: CompanyProfileComponent
  },
  {
    path: "financial-assessment", component: FinancialAssessmentComponent
  },
  {
    path: "forensic-assessment", component: ForensicAssessmentComponent
  },
  {
    path: "evidence-annexure", component: EvidenceAnnexureComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomReportRoutingModule { }
