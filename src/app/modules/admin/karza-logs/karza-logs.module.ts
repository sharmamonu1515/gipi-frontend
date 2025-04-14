import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KarzaLogsComponent } from './karza-logs.component'; // Correctly imported
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

const LLPRoutes: Route[] = [
    {
        path: '',
        component: KarzaLogsComponent
    }
];

@NgModule({
    declarations: [
        KarzaLogsComponent,
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
        RouterModule.forChild(LLPRoutes),
    ],
    exports: [
        RouterModule
    ]
})
export class KarzaLogsModule { }