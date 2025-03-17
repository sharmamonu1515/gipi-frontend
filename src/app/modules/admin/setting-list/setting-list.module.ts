import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  SettingListComponent } from './setting-list.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialManualModule } from 'material.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';

const SettingListRoutes: Route[] = [
  {
    path: 'setting-list',
    component: SettingListComponent
  }
];

@NgModule({
  declarations: [
    SettingListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SettingListRoutes),
    MaterialManualModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule
  ]
})
export class SettingListModule { }

