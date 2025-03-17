import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Route, RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { DialogAnimationsExampleDialog, ExampleComponent } from 'app/modules/admin/example/example.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialManualModule } from 'material.component';

const exampleRoutes: Route[] = [
    {
        path: 'mca-list',
        component: ExampleComponent
    }
];

@NgModule({
    declarations: [
        ExampleComponent,
        DialogAnimationsExampleDialog
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(exampleRoutes),
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
    ],
    entryComponents:[DialogAnimationsExampleDialog]
})
export class ExampleModule {
}
