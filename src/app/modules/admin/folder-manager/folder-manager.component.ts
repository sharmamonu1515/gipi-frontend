import { Component, OnInit } from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FileDetailComponent } from '../file-manager/file-detail.component';
import { FileManagerService } from '../file-manager/file-manager.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Location } from '@angular/common';
import { FileListComponent } from '../file-manager/file-list.component';

@Component({
    selector: 'app-folder-manager',
    templateUrl: './folder-manager.component.html',
    styleUrls: ['./folder-manager.component.scss'],
})
export class FolderManagerComponent implements OnInit {
    folders: any = [];
    files: Array<any> = [];
    folderObj: any = {};
    folder: any = {};
    storedFolder:any={};
    constructor(
        public dialog: MatDialog,
        public FileService: FileManagerService,
private _fuseConfirmationService:FuseConfirmationService,
        private _router: Router,
        private route:ActivatedRoute,
        private location: Location,
        
    ) {
        // this.route.queryParams.subscribe((params) => {
        //     this.folder = JSON.parse(params['folder']);
        //     console.log(this.folder);
        // });
       
        this.storedFolder= localStorage.getItem('folder');
        if (this.storedFolder) {
            this.storedFolder = JSON.parse(this.storedFolder);
            // console.log(this.folder);
            FileService.getBucketObjectList(this.storedFolder?.folderPath,50).subscribe((res) => {
                this.processFilesAndFolders(res.data);
               console.log(this.folders)
            });
          }
    }

    ngOnInit(): void {}
    viewAll(type) {
        this.dialog.open(FileListComponent, {
            width: '50%',
            // height: '68%',
            enterAnimationDuration: '500ms',
            exitAnimationDuration: '500ms',
            disableClose: true,
            data:{folderPath:this.storedFolder?.folderPath,
                type:type}
        });
    }
    openDialog(file: any): void {
        this.dialog.open(FileDetailComponent, {
            width:  '33.33%',
            // height: '68%',
            enterAnimationDuration: '500ms',
            exitAnimationDuration: '500ms',
            disableClose: true,
            data: {
                file: file,
            },
        });
    }
    openFolders(folder: any): void {

        localStorage.setItem('folder', JSON.stringify(folder));
        this.storedFolder= folder;
        if (this.storedFolder) {
  //          this.storedFolder = JSON.parse(this.storedFolder);
            // console.log(this.folder);
            this.FileService.getBucketObjectList(this.storedFolder?.folderPath,50).subscribe((res) => {
                this.files=[];
                this.folders=[];
                this.processFilesAndFolders(res.data);
           this.folders=this.folders[0];
            });
          }
       
      
        this._router.navigate(['/folders/folder-manager']);
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
                    folderPath: folderPath,
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
    
        // Add the file to the last folder found
        const fileWithDetails = {
            name: nameWithoutExtension, // Name without extension
            folder: folderPath, // Include folder path
            type: fileType, // File extension/type
        };
    
        // Find the folder where the file should be added (the last folder in the path)
        if (mainFolder) {
            // Check if there are no subfolders left, meaning this is where the file belongs
            if (parts.length === 0) {
                mainFolder.files.push(fileWithDetails); // Add to the main folder
            } else {
                let targetFolder = mainFolder;
                for (let part of parts) {
                    const folderIndex = targetFolder.subfolders.findIndex((subfolder: any) => subfolder.name === part);
                    if (folderIndex !== -1) {
                        targetFolder = targetFolder.subfolders[folderIndex];
                    }
                }
                // Add the file to the appropriate subfolder
                targetFolder.files.push(fileWithDetails);
            }
        }
        
        // Optionally, you can also add the file to the global file array if needed
        this.files.push(fileWithDetails);
    }
    
    goBack(): void {
       // localStorage.setItem('folder', JSON.stringify(folder));
   
        this.location.back(); // Navigate to the previous page
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
                this.FileService.getBucketObjectList(this.storedFolder?.name, 50).subscribe(
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
      
}
