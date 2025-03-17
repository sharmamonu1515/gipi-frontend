
import { SanctionUploaderComponent } from './sanction-uploader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';



const SanctionUploaderRoutes: Route[] = [
  {
    path: 'sanction-uploader',
    component: SanctionUploaderComponent
  }
];

@NgModule({
  declarations: [
    SanctionUploaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SanctionUploaderRoutes),
    MaterialManualModule,
    
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FuseCardModule,
    FuseAlertModule,
    SharedModule,

    
  ]
})
export class SanctionUploaderModule { }
