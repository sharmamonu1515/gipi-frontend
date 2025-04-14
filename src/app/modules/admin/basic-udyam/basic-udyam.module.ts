import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicUdyamComponent } from './basic-udyam.component';
import { BasicUdyamDetailComponent } from './basic-udyam-detail/basic-udyam-detail.component';
import { Route, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BasicUdyamDialogComponent } from './basic-udyam-dialog.component';

const BasicUdyamRoutes: Route[] = [
    {
        path: 'basic-udyam',
        component: BasicUdyamComponent
    },
    {
        path: 'basic-udyam/:id',
        component: BasicUdyamDetailComponent
    }
];


@NgModule({
    declarations: [BasicUdyamComponent, BasicUdyamDetailComponent, BasicUdyamDialogComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(BasicUdyamRoutes),
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule
    ]
})
export class BasicUdyamModule { }