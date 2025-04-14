import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { TablePopupComponent } from './table-popup.component';

@NgModule({
  declarations: [
    TablePopupComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule
  ],
  exports: [
    TablePopupComponent
  ]
})
export class TablePopupModule { }
