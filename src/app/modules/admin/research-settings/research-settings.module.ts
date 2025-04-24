import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchSettingComponent } from './research-setting.component';
import { ResearchSettingsRoutingModule } from './research-settings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    ResearchSettingComponent
  ],
  imports: [
    CommonModule,
    ResearchSettingsRoutingModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatPaginatorModule,
        MatDialogModule,
        MatTooltipModule,
        MatTableModule
  ]
})
export class ResearchSettingsModule { }
