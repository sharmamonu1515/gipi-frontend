import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiResearchComponent } from './ai-research.component';
import { ResearchSettingComponent } from './research-setting/research-setting.component';

const routes: Routes = [
  {
    path: "", component: AiResearchComponent
  },
  {
    path: "setting", component: ResearchSettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiResearchRoutingModule { }
