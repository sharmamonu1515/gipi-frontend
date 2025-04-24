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
import { FileManagerComponent } from './file-manager.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { FileDetailComponent } from './file-detail.component';
import { FileListComponent } from './file-list.component';
import { FileUploaderComponent } from './file-uploader.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FileShareHandlerComponent } from './file-share-handler/file-share-handler.component';
import { FileManagerDetailsComponent } from './file-manager-details/file-manager-details.component';

const FileManagerRoutes: Route[] = [
    {
        path: '',
        component: FileManagerComponent,
        children: [
            {
                path: 'details/:name',
                component: FileManagerDetailsComponent,
                outlet: 'sidebar',
            },
        ],
    },
    { path: 'share', component: FileShareHandlerComponent, data: { title: 'File Share', animation: 'sharePage' } },
];

@NgModule({
    declarations: [FileManagerComponent, FileDetailComponent, FileListComponent, FileUploaderComponent, FileManagerDetailsComponent, FileShareHandlerComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(FileManagerRoutes),
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
        MatGridListModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatDialogModule,
        MatSidenavModule,
    ],
})
export class FileManagerModule {}
