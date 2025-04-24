import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AiResearchRoutingModule } from './ai-research-routing.module';
import { AiResearchComponent } from './ai-research.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import {  MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SummarizePopupComponent } from './summarize-popup/summarize-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrapedPopupComponent } from './scraped-popup/scraped-popup.component';
import { MatTableModule } from '@angular/material/table';
import { AddKeywordComponent } from './add-keyword/add-keyword.component';
import { AddUrlComponent } from './add-url/add-url.component';



@NgModule({
  declarations: [
    AiResearchComponent,
    SummarizePopupComponent,
    ScrapedPopupComponent,
    AddKeywordComponent,
    AddUrlComponent
  ],
  imports: [
    CommonModule,
    AiResearchRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatChipsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatPseudoCheckboxModule,
    FormsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule
  ],
  providers: [DatePipe]
})
export class AiResearchModule { }
