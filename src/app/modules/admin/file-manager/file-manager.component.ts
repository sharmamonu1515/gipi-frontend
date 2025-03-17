import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileDetailComponent } from './file-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FileManagerService } from './file-manager.service';
import { FileUploaderComponent } from './file-uploader.component';
import { FileListComponent } from './file-list.component';
import { NavigationExtras, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-file-manager',
    templateUrl: './file-manager.component.html',
    styleUrls: ['./file-manager.component.scss'],
})
export class FileManagerComponent implements OnInit {
    folders: Array<any> = [];
    files: Array<any> = [];
    folderObj: any = {};

    gstByPanForm: FormGroup;
    constructor(
        public dialog: MatDialog,
        public FileService: FileManagerService,
        private _router: Router,
        private _fuseConfirmationService:FuseConfirmationService
    ) {

        FileService.getBucketObjectList('',20).subscribe((res) => {
            this.processFilesAndFolders(res.data);
            console.log(this.folders);
        });
    }

    ngOnInit(): void {}

    openDialog(file: any): void {
        this.dialog.open(FileDetailComponent, {
            width: '33.33%',
            // height: '68%',
            enterAnimationDuration: '500ms',
            exitAnimationDuration: '500ms',
            disableClose: true,
            data: {
                file: file// Passing the file data to the dialog
            },
        });
    }
    openFolders(folder: any): void {
      
        localStorage.setItem('folder', JSON.stringify(folder));
        // const navigationExtras = {
        //     queryParams: { folder: folder }
        //   };
      
        this._router.navigate(['/folders/folder-manager']);
      }
    fileUploader() {
        this.dialog.open(FileUploaderComponent, {
            width: '33.33%',
            // height: '68%',
            enterAnimationDuration: '500ms',
            exitAnimationDuration: '500ms',
            disableClose: true,
        });
        this.dialog.afterAllClosed.subscribe(() => {
            this.FileService.getBucketObjectList('', 20).subscribe(
              (res) => {
                // Reset files and folders before reprocessing the data
                this.files = [];
                this.folders = [];
                this.processFilesAndFolders(res.data); // Process the updated list
                console.log("Folders:", this.folders, "Files:", this.files);
              },
              (err) => {
                console.error("Error retrieving bucket object list:", err);
              }
            );
          });
          

    }
    viewAll(type) {
        this.dialog.open(FileListComponent, {
            width: '50%',
            // height: '68%',
            enterAnimationDuration: '500ms',
            exitAnimationDuration: '500ms',
            disableClose: true,
            data:{type}
        });
    }
    getFileType(file) {
        const lastDotIndex = file.lastIndexOf('.');

        // If no dot is found, return an empty string
        if (lastDotIndex === -1) {
            return '';
        }

        // Extract and return the file extension
        return file.substring(lastDotIndex + 1).toLowerCase();
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
                    folderPath:folderPath,
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
    deleteFile(file): void {
        const dialogRef = this._fuseConfirmationService.open({
          title: "Remove File",
          message: "Are you sure you want to remove this file permanently? <span class=\"font-medium\">This action cannot be undone!</span>",
          icon: {
            show: true,
            name: "heroicons_outline:exclamation",
            color: "warn",
          },
          actions: {
            confirm: {
              show: true,
              label: "Remove",
              color: "warn",
            },
            cancel: {
              show: true,
              label: "Cancel",
            },
          },
          dismissible: false,
        });
      
        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'confirmed') {
            // Prepare payload for deletion
            const payload = { fileName: file.folder + "/" + file.name + "." + file.type };
            
            // Call the delete API to remove the file
            this.FileService.deleteBucketObject(payload).subscribe(
              (res) => {
                // After successful deletion, refresh the file/folder list
                this.FileService.getBucketObjectList('', 20).subscribe(
                  (res) => {
                    // Reset files and folders before reprocessing the data
                    this.files = [];
                    this.folders = [];
                    this.processFilesAndFolders(res.data); // Process the updated list
                    console.log("Folders:", this.folders, "Files:", this.files);
                  },
                  (err) => {
                    console.error("Error retrieving bucket object list:", err);
                  }
                );
              },
              (err) => {
                console.error("Error deleting file:", err);
              }
            );
          }
        });
      }
      
    // convertFoldersToArray(folders: any): Array<any> {
    //   const folderArray: Array<any> = [];

    //   for (const folder in folders) {
    //     if (folders.hasOwnProperty(folder)) {
    //       const folderData = folders[folder];
    //       const subfolders = folderData.subfolders ? Object.keys(folderData.subfolders) : [];
    //       const files = folderData.files || [];

    //       folderArray.push({ name: folderName, subfolders, files });
    //     }
    //   }

    //   return folderArray;
    // }
}
