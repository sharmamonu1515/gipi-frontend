import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromptSettingComponent } from './prompt-setting.component';


const routes: Routes = [
  {
    path: '', component: PromptSettingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromptSettingRoutingModule { }
