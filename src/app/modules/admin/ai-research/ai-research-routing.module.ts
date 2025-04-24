import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiResearchComponent } from './ai-research.component';

const routes: Routes = [
  {
    path: "", component: AiResearchComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiResearchRoutingModule { }
