import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GipiApiComponent, FinancialFormComponent } from './gipi-api.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialManualModule } from 'material.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { FuseCardModule } from '@fuse/components/card';


const GipiApiRoutes: Route[] = [
  {
    path: 'gipi-api',
    component: GipiApiComponent
  }
];

@NgModule({
  declarations: [
    GipiApiComponent,
    FinancialFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(GipiApiRoutes),
    MaterialManualModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    FuseCardModule
  ]
})
export class GipiApiModule { }

