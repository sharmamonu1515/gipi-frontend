import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'app/interfaces/common';
import { PromptData } from 'app/interfaces/ai-summary';
import { PromptService } from '../../custom-report/services/prompt.service';

@Component({
  selector: 'app-adverse-media-prompt',
  templateUrl: './adverse-media-prompt.component.html',
  styleUrls: ['./adverse-media-prompt.component.scss']
})
export class AdverseMediaPromptComponent implements OnInit {

 fields = [
         { key: 'aboutCompany', label: 'About Company' },
         { key: 'director', label: 'Directors' },
     ];
 
     selectedField: string = this.fields[0].key;
     promptText: string = '';
     isLoading: boolean = false;
     topK: number; 
     topP: number;
     maxOutputTokens: number;
     temperature: number;
 
     constructor(
         private promptService: PromptService,
         private toast: ToastrService
     ) { }
 
     ngOnInit() {
         this.loadPrompt();
     }
 
     loadPrompt() {
         if (!this.selectedField) return;
 
         this.isLoading = true;
 
         this.promptService.getPrompt(this.selectedField).subscribe({
             next: (response: ApiResponse<PromptData>) => {
                 this.promptText = response?.data?.prompt || '';
                 this.temperature=response?.data?.temperature;
                 this.maxOutputTokens=response?.data?.maxOutputTokens;
                 this.topP=response?.data?.topP;
                 this.topK=response?.data?.topK;
                 this.isLoading = false;
             },
             error: (error) => {
                 console.log('Failed to load prompt: ' + (error.message || 'Unknown error'));
                 this.isLoading = false;
             }
         });
     }
 
     savePrompt() {
         if (!this.promptText.trim()) return;
 
         this.promptService.savePrompt(this.selectedField, this.promptText, this.temperature,this.maxOutputTokens,this.topP, this.topK).subscribe({
             next: () => this.toast.success('Prompt saved successfully'),
             error: (err) => this.toast.error(err.error.message || "Error occurred while summarizing")
         });
     }
 
     resetPrompt() {
         this.promptText = '';
     }
 

}
