

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
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { FolderManagerComponent } from './folder-manager.component';



const FolderManagerRoutes: Route[] = [
  {
    path: 'folder-manager',
    component: FolderManagerComponent
  }
];

@NgModule({
  declarations: [
FolderManagerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(FolderManagerRoutes),
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
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,

    
  ]
})
export class FolderManagerModule { }
