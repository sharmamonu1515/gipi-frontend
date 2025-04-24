import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.scss']
})
export class ExportPopupComponent implements OnInit {
  tabs: string[] = [];
  selectedTab: string = '';
  sectionsMap: { [key: string]: { name: string, selected: boolean }[] } = {};
  selectedSections: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ExportPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this.tabs = Object.keys(this.data.sectionsData);
    
    if (this.tabs.length > 0) {
      this.selectedTab = this.tabs[0];
    }
    
    for (const tab in this.data.sectionsData) {
      this.sectionsMap[tab] = this.data.sectionsData[tab].map((section: string) => {
        return { name: section, selected: true };
      });
    }
    
    this.updateSelectedSections();
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  toggleSection(section: string): void {
    const sectionObj = this.sectionsMap[this.selectedTab].find(s => s.name === section);
    if (sectionObj) {
      sectionObj.selected = !sectionObj.selected;
      this.updateSelectedSections();
    }
  }

  updateSelectedSections(): void {
    this.selectedSections = [];

    for (const tab in this.sectionsMap) {
      this.sectionsMap[tab].forEach(section => {
        if (section.selected) {
          this.selectedSections.push(section.name); 
        }
      });
    }
  }

  export(): void {
    this.dialogRef.close(this.selectedSections);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
