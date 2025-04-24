import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResearchSettingComponent } from './research-setting.component';


const routes: Routes = [
  {
    path: '', component: ResearchSettingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResearchSettingsRoutingModule { }
