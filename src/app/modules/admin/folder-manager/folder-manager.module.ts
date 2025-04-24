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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { FolderManagerComponent } from './folder-manager.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FolderDetailComponent } from './folder-detail/folder-detail.component';
import { FileManagerDetailsComponent } from '../file-manager/file-manager-details/file-manager-details.component';

const FolderManagerRoutes: Route[] = [
    {
        path: 'folder-manager',
        component: FolderManagerComponent,
        children: [
            {
                path: 'file-details/:name',
                component: FileManagerDetailsComponent,
                outlet: 'sidebar',
            },
            {
                path: 'folder-details/:name',
                component: FolderDetailComponent,
                outlet: 'sidebar',
            },
        ],
    },
];

@NgModule({
    declarations: [FolderManagerComponent, FolderDetailComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(FolderManagerRoutes),
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
        MatGridListModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatDialogModule,
        MatSidenavModule,
    ],
})
export class FolderManagerModule {}
