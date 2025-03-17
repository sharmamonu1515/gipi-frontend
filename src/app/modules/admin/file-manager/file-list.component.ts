import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FileDetailComponent } from './file-detail.component';
import { FileManagerService } from './file-manager.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
})
export class FileListComponent  {
    folders: any[] = [];
    files: any[] = [];
    fileData = new MatTableDataSource<any>([]); // Using MatTableDataSource
    displayedColumns: string[] = ['name', 'type'];
    resultsLength = 0;
    
    
    constructor(public dialog: MatDialog, private FileService: FileManagerService,
         private cdr: ChangeDetectorRef,      @Inject(MAT_DIALOG_DATA) public data: any,) {
      FileService.getBucketObjectList(data.folderPath||'', 50).subscribe((res) => {
        this.processFilesAndFolders(res.data);
        this.fileData.data=this.files;
        this.resultsLength = this.files.length; // Updated for MatTableDataSource
        this.cdr.detectChanges();
      
      });
    }
    
    // Open the FileDetailComponent dialog and pass the file data
    openFileDetail(file: any): void {
      this.dialog.open(FileDetailComponent, {
        width: '400px',
        data: file
      });
    }
  
    processFilesAndFolders(data: string[]): void {
        data.forEach((item) => {
            if (item.endsWith('/')) {
                this.addFolder(item); // Add folder path
            } else if(!item.endsWith('/') && /\.[0-9a-z]+$/i.test(item)) {
                this.addFile(item); // Add file path
            }
        });
    }

    
    getFileExtension(fileName: string): string {
      return fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';
    }
    
// Add a folder to the structure
addFolder(folderPath: string): void {
    console.log(folderPath)
    const parts = folderPath
        .split('/')
        .filter((part) => part.trim() !== ''); // Clean up any empty parts
    let currentFolder = this.folders;

    parts.forEach((part) => {
        let folderIndex = currentFolder.findIndex(
            (folder: any) => folder.name === part
        );
        if (folderIndex === -1) {
            // Folder doesn't exist, create new
            const newFolder = {
                name: part,
                subfolders: [],
                files: [], // Initialize an empty files array
            };
            currentFolder.push(newFolder);
            currentFolder = newFolder.subfolders; // Move to the newly created folder
        } else {
            // Move into the existing folder
            currentFolder = currentFolder[folderIndex].subfolders;
        }
    });
}

// Add a file to the folder structure
addFile(filePath: string): void {
    const parts = filePath.split('/').filter((part) => part.trim() !== ''); // Clean up empty parts
    const fullFileName = parts.pop(); // Get the last part as the file name

    // Ensure we have a valid file name
    if (!fullFileName || !fullFileName.includes('.')) {
        console.warn(`File name "${fullFileName}" does not have an extension. Skipping...`);
        return;
    }

    // Get the file name and extension
    const nameWithoutExtension = fullFileName.substring(0, fullFileName.lastIndexOf('.'));
    const fileType = fullFileName.split('.').pop(); // File extension

    let currentFolder = this.folders;
    let mainFolder: any = null; // To store the reference of the main folder
    let folderPath = '';

    // Traverse the folder structure
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        folderPath += (i > 0 ? '/' : '') + part; // Construct the folder path

        let folderIndex = currentFolder.findIndex((folder: any) => folder.name === part);
        if (folderIndex === -1) {
            // Folder doesn't exist, create new
            const newFolder = {
                name: part,
                subfolders: [],
                files: [],
            };
            currentFolder.push(newFolder);
            currentFolder = newFolder.subfolders; // Move to the newly created folder

            if (i === 0) {
                mainFolder = newFolder; // Capture the main folder (e.g., 'test')
            }
        } else {
            if (i === 0) {
                mainFolder = currentFolder[folderIndex]; // Capture the main folder (e.g., 'test')
            }
            currentFolder = currentFolder[folderIndex].subfolders; // Move into the existing subfolder
        }
    }

    // Add the file to the current folder's file list (not subfolders)
    const fileWithDetails = {
        name: nameWithoutExtension, // Name without extension
        folder: folderPath, // Include folder path
        type: fileType, // File extension/type
    };

    // If there are no subfolders, it's the correct place to add the file
    if (Array.isArray(currentFolder)) {
        // Add file to the leaf folder's files array
        const parentFolder = currentFolder.find(
            (folder: any) => folder.name === parts[parts.length - 1]
        );
        if (parentFolder) {
            parentFolder.files.push(fileWithDetails);
        } else if (mainFolder) {
            mainFolder.files.push(fileWithDetails); // Add file to main folder if subfolder doesn't exist
        }
    }
    // Add the file to the global file array
    this.files.push(fileWithDetails);
}
}
