import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AMLComponent, AMLDialogComponent } from './aml.component';
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
import { AMLDetailComponent } from './aml-detail/aml-detail.component';

const AMLRoutes: Route[] = [
  {
    path: 'aml',
    component: AMLComponent
  },
  {
    path: 'aml/:id',
    component: AMLDetailComponent
  }
];

@NgModule({
  declarations: [
    AMLComponent,
    AMLDialogComponent,
    AMLDetailComponent
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
    RouterModule.forChild(AMLRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class AMLModule { }
