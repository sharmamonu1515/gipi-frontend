import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectorComponent, DirectorDialogComponent } from './director.component';
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
import { DirectorDetailComponent } from './director-detail/director-detail.component';

const DirectorRoutes: Route[] = [
  {
    path: 'director',
    component: DirectorComponent
  },
  {
    path: 'director/:id',
    component: DirectorDetailComponent
  }
];

@NgModule({
  declarations: [
    DirectorComponent,
    DirectorDialogComponent,
    DirectorDetailComponent
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
    RouterModule.forChild(DirectorRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class DirectorModule { }
