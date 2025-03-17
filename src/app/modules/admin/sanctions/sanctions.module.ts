import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanctionsComponent } from './sanctions.component';
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

const SanctionRoutes: Route[] = [
  {
    path: 'sanction-list',
    component: SanctionsComponent
  }
];

@NgModule({
  declarations: [
    SanctionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SanctionRoutes),
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
  ]
})
export class SanctionsModule { }
