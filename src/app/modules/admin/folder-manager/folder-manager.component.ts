import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FileDetailComponent } from '../file-manager/file-detail.component';
import { FileManagerService } from '../file-manager/file-manager.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Location } from '@angular/common';
import { FileListComponent } from '../file-manager/file-list.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-folder-manager',
  templateUrl: './folder-manager.component.html',
  styleUrls: ['./folder-manager.component.scss'],
})
export class FolderManagerComponent implements OnInit, OnDestroy, AfterViewInit {
  folders: any = [];
  files: Array<any> = [];
  folderObj: any = {};
  folder: any = {};
  storedFolder: any = {};
  
  @ViewChild('matDrawer') matDrawer: MatDrawer;
  drawerMode: 'over' = 'over';
  drawerOpened = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _drawerInitialized = false;

  constructor(
    public dialog: MatDialog,
    public FileService: FileManagerService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _router: Router,
    private _route: ActivatedRoute,
    private location: Location,
    private _snackBar: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.storedFolder = localStorage.getItem('folder');
    if (this.storedFolder) {
      this.storedFolder = JSON.parse(this.storedFolder);
      this.loadFolderContents();
    }
  }

  ngOnInit(): void {
    this._router.events.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.checkSidebarRoute();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._drawerInitialized = true;
      this.checkSidebarRoute();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  checkSidebarRoute(): void {
    if (!this._drawerInitialized) return;

    const sidebarRoute = this._route.snapshot.children.find(child => child.outlet === 'sidebar');
    
    if (sidebarRoute && sidebarRoute.routeConfig.path === 'file-details/:name') {
      const fileName = sidebarRoute.params['name'];
      const fileType = this._route.snapshot.queryParamMap.get('type');
      const folder = this._route.snapshot.queryParamMap.get('folder');

      if (fileName && fileType) {
        const file = {
          name: fileName,
          type: fileType,
          folder: folder || ''
        };
        
        if (!this.drawerOpened) {
          this.drawerOpened = true;
          this.matDrawer.open();
          this._changeDetectorRef.detectChanges();
        }
      }
    } else {
      if (this.drawerOpened) {
        this.drawerOpened = false;
        this.matDrawer.close();
        this._changeDetectorRef.detectChanges();
      }
    }
  }

  loadFolderContents(): void {
    this.FileService.getBucketObjectList(this.storedFolder?.folderPath, 50).subscribe(
      (res) => {
        this.files = [];
        this.folders = [];
        this.processFilesAndFolders(res.data);
        this._changeDetectorRef.markForCheck();
      },
      (err) => {
        this._snackBar.open('Error loading folder contents', 'Close', { duration: 3000 });
      }
    );
  }

  onBackdropClicked(): void {
    this.closeSidebar();
  }

  closeSidebar(): void {
    this.drawerOpened = false;
    this._router.navigate([{ outlets: { sidebar: null } }], {
      relativeTo: this._route.parent,
      queryParamsHandling: 'preserve'
    });
    this._changeDetectorRef.markForCheck();
  }

  openFileDetails(file: any): void {
    this._router.navigate(
      [{
        outlets: { 
          sidebar: ['file-details', file.name] 
        } 
      }], { 
        relativeTo: this._route,
        queryParams: {
          type: file.type,
          folder: file.folder
        },
        replaceUrl: false
      }
    ).then(() => {
      this.drawerOpened = true;
      this.matDrawer.open();
      this._changeDetectorRef.detectChanges();
    });
  }

  openFolders(folder: any): void {
    localStorage.setItem('folder', JSON.stringify(folder));
    this.storedFolder = folder;
    this.loadFolderContents();
    this._router.navigate(['/folders/folder-manager']);
  }

  fileUploader(): void {
    const dialogRef = this.dialog.open(FileDetailComponent, {
      width: '33.33%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadFolderContents();
    });
  }

  viewAll(type: string): void {
    this.dialog.open(FileListComponent, {
      width: '50%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      disableClose: true,
      data: {
        folderPath: this.storedFolder?.folderPath,
        type: type
      }
    });
  }

  processFilesAndFolders(data: string[]): void {
    data.forEach((item) => {
      if (item.endsWith('/')) {
        this.addFolder(item);
      } else if (!item.endsWith('/') && /\.[0-9a-z]+$/i.test(item)) {
        this.addFile(item);
      }
    });
  }

  addFolder(folderPath: string): void {
    const parts = folderPath.split('/').filter((part) => part.trim() !== '');
    let currentFolder = this.folders;

    parts.forEach((part) => {
      let folderIndex = currentFolder.findIndex(
        (folder: any) => folder.name === part
      );
      if (folderIndex === -1) {
        const newFolder = {
          name: part,
          subfolders: [],
          files: [],
        };
        currentFolder.push(newFolder);
        currentFolder = newFolder.subfolders;
      } else {
        currentFolder = currentFolder[folderIndex].subfolders;
      }
    });
  }

  addFile(filePath: string): void {
    const parts = filePath.split('/').filter((part) => part.trim() !== '');
    const fullFileName = parts.pop();
  
    if (!fullFileName || !fullFileName.includes('.')) {
      console.warn(`File name "${fullFileName}" does not have an extension. Skipping...`);
      return;
    }
  
    const nameWithoutExtension = fullFileName.substring(0, fullFileName.lastIndexOf('.'));
    const fileType = fullFileName.split('.').pop();
  
    let currentFolder = this.folders;
    let mainFolder: any = null;
    let folderPath = '';
  
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      folderPath += (i > 0 ? '/' : '') + part;
  
      let folderIndex = currentFolder.findIndex((folder: any) => folder.name === part);
      if (folderIndex === -1) {
        const newFolder = {
          name: part,
          subfolders: [],
          folderPath: folderPath,
          files: [],
        };
        currentFolder.push(newFolder);
        currentFolder = newFolder.subfolders;
  
        if (i === 0) {
          mainFolder = newFolder;
        }
      } else {
        if (i === 0) {
          mainFolder = currentFolder[folderIndex];
        }
        currentFolder = currentFolder[folderIndex].subfolders;
      }
    }
  
    const fileWithDetails = {
      name: nameWithoutExtension,
      folder: folderPath,
      type: fileType,
    };
  
    if (mainFolder) {
      if (parts.length === 0) {
        mainFolder.files.push(fileWithDetails);
      } else {
        let targetFolder = mainFolder;
        for (let part of parts) {
          const folderIndex = targetFolder.subfolders.findIndex((subfolder: any) => subfolder.name === part);
          if (folderIndex !== -1) {
            targetFolder = targetFolder.subfolders[folderIndex];
          }
        }
        targetFolder.files.push(fileWithDetails);
      }
    }
    
    this.files.push(fileWithDetails);
  }

  deleteFile(file: any): void {
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
        const payload = { fileName: file.folder + "/" + file.name + "." + file.type };
        
        this.FileService.deleteBucketObject(payload).subscribe(
          (res) => {
            this._snackBar.open('File deleted successfully', 'Close', { duration: 3000 });
            this.loadFolderContents();
          },
          (err) => {
            this._snackBar.open('Error deleting file', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}