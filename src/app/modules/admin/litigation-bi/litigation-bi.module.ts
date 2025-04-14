import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LitigationBiAddDataComponent, LitigationBiComponent } from './litigation-bi.component';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialManualModule } from 'material.component';
import { LitigationBiDetailComponent } from './litigation-bi-detail/litigation-bi-detail.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

const litigationBiRoutes: Route[] = [
  {
    path: 'litigation-bi',
    component: LitigationBiComponent
  },
  {
    path: 'litigation-bi/:id',
    component: LitigationBiDetailComponent
  }
];

@NgModule({
  declarations: [
    LitigationBiComponent,
    LitigationBiAddDataComponent,
    LitigationBiDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(litigationBiRoutes),
    MaterialManualModule,

    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FuseCardModule,
    FuseAlertModule,
    SharedModule
  ],
  entryComponents:[
    LitigationBiAddDataComponent
  ]
})
export class LitigationBiModule { }
