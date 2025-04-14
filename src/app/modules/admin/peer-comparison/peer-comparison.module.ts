import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeerComparisonComponent, PeerComparisonDialogComponent } from './peer-comparison.component';
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
import { PeerComparisonDetailComponent } from './peer-comparison-detail/peer-comparison-detail.component';

const PeerComparisonRoutes: Route[] = [
  {
    path: 'peer-comparison',
    component: PeerComparisonComponent
  },
  {
    path: 'peer-comparison/:id',
    component: PeerComparisonDetailComponent
  }
];

@NgModule({
  declarations: [
    PeerComparisonComponent,
    PeerComparisonDialogComponent,
    PeerComparisonDetailComponent
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
    RouterModule.forChild(PeerComparisonRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class PeerComparisonModule { }
