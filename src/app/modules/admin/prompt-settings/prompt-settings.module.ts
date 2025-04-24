import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptSettingComponent } from './prompt-setting.component';
import { PromptSettingRoutingModule } from './prompt-settings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';

@NgModule({
    declarations: [PromptSettingComponent],
    imports: [
        CommonModule,
        PromptSettingRoutingModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        MatTooltipModule,
        MatSelectModule,
        MatListModule,
        MatCardModule,
    ],
})
export class PromptSettingsModule {}
