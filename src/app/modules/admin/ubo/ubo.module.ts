import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UBOComponent, UBODialogComponent } from './ubo.component';
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
import { UboDetailComponent } from './ubo-detail/ubo-detail.component';

const UBORoutes: Route[] = [
  {
    path: 'ubo',
    component: UBOComponent
  },
  {
    path: 'ubo/:id',
    component: UboDetailComponent
  }
];

@NgModule({
  declarations: [
    UBOComponent,
    UBODialogComponent,
    UboDetailComponent
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
    RouterModule.forChild(UBORoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class UBOModule { }
