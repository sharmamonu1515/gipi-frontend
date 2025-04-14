import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PEPComponent, PEPDialogComponent } from './pep.component';
import { Route, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialManualModule } from 'material.component';
import { PEPDetailComponent } from './pep-detail/pep-detail.component';

const PEPRoutes: Route[] = [
  {
    path: 'pep',
    component: PEPComponent
  },
  {
    path: 'pep/:id',
    component: PEPDetailComponent
  }
];

@NgModule({
  declarations: [
    PEPComponent,
    PEPDialogComponent,
    PEPDetailComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MaterialManualModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    SharedModule,
    MatProgressSpinnerModule,
    FuseCardModule,
    FuseAlertModule,
    RouterModule.forChild(PEPRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class PEPModule { }
