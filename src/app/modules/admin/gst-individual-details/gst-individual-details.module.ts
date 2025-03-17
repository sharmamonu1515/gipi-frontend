import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Route, RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialManualModule } from 'material.component';
import { GstIndividualDetailsComponent } from './gst-individual-details.component';

const exampleRoutes: Route[] = [
  {
    path: 'details/:docId/:gstin',
    component: GstIndividualDetailsComponent
  }
];

@NgModule({
  declarations: [
    GstIndividualDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(exampleRoutes),
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    FuseCardModule,
    SharedModule,
    MaterialManualModule,
    MatTabsModule
  ]
})
export class GstIndividualDetailsModule {
}
