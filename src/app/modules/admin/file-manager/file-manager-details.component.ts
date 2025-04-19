import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileManagerService } from './file-manager.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-manager-details',
  templateUrl: './file-manager-details.component.html',
  styleUrls: ['./file-manager-details.component.scss']
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy {
  file: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  url: string = '';
  showSharePopup: boolean = false;
  shareableUrl: string = '';
  
  // Added for expiry time functionality
  expiryTimeHours: number = 1; // Default value
  expiryTimeInvalid: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fileManagerService: FileManagerService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._route.params.pipe(takeUntil(this._unsubscribeAll)).subscribe(params => {
        const fileName = params.name;
        const type = this._route.snapshot.queryParamMap.get('type');
        const folder = this._route.snapshot.queryParamMap.get('folder');
        
        // Create file object from route params
        this.file = {
            name: fileName,
            fileType: type,
            type: type,
            folder: folder,
            size: 'N/A'
        };

        // If coming from shared link, auto-download
        if (this._route.snapshot.queryParamMap.has('shared')) {
          setTimeout(() => this.downloadFile(this.file), 500);
        }
    });
  }

  // Validate expiry time input
  validateExpiryTime(): void {
    if (this.expiryTimeHours < 1) {
      this.expiryTimeHours = 1;
      this.expiryTimeInvalid = true;
    } else {
      this.expiryTimeInvalid = false;
    }
  }

  shareFile(file: any): void {
    if (!file) return;
    
    // Validate expiry time before proceeding
    this.validateExpiryTime();
    if (this.expiryTimeInvalid) {
      this._snackBar.open('Expiry time must be at least 1 hour', 'Close', { duration: 3000 });
      return;
    }
    
    const folderPath = file.folder ? file.folder.replace(/^\/|\/$/g, '') : '';
    const filePath = folderPath ? `${folderPath}/${file.name}.${file.type}` : `${file.name}.${file.type}`;
    
    // Convert hours to seconds for the API
    const expiryTimeSeconds = this.expiryTimeHours * 3600;
    console.log(expiryTimeSeconds);
    // Pass the custom expiry time to the service
    this._fileManagerService.getPreSignedURL(filePath, expiryTimeSeconds).subscribe(
      (res) => {
        const awsUrl = new URL(res.data);
        const params = new URLSearchParams(awsUrl.search);
        // Make sure we're using the actual expiry time from the response
        const expiresParam = params.get('X-Amz-Expires') || (expiryTimeSeconds.toString());
        
        this.shareableUrl = `${window.location.origin}/file/share?` +
          `file=${encodeURIComponent(filePath)}&` +
          `key=${encodeURIComponent(params.get('X-Amz-Credential'))}&` +
          `date=${encodeURIComponent(params.get('X-Amz-Date'))}&` +
          `expires=${encodeURIComponent(expiresParam)}&` +
          `signature=${encodeURIComponent(params.get('X-Amz-Signature'))}`;
        
        this.showSharePopup = true;
      },
      (error) => {
        this._snackBar.open('Error generating share link', 'Close', { duration: 3000 });
      }
    );
  }

  copyShareUrl(inputEl: HTMLInputElement): void {
    inputEl.select();
    document.execCommand('copy');
    this._snackBar.open('Link copied to clipboard!', 'Close', { duration: 2000 });
  }

  downloadFile(file: any): void {
    if (!file) return;
  
    const filePath = `${file.folder}/${file.name}.${file.type}`.replace(/\/+/g, '/');
    
    // Use the default expiry time for downloads (1 hour)
    this._fileManagerService.getPreSignedURL(filePath, 3600).subscribe(
      (res) => {
        this.forceFileDownload(res.data, `${file.name}.${file.type}`);
      },
      (error) => {
        this._snackBar.open('Error downloading file', 'Close', { duration: 3000 });
      }
    );
  }
  
  private forceFileDownload(url: string, fileName: string): void {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.blob();
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Download error:', error);
        this._snackBar.open('Failed to download file', 'Close', { duration: 3000 });
      });
  }

  closeSidebar(): void {
    // Close the sidebar by navigating to null outlet
    this._router.navigate([{ outlets: { sidebar: null } }], {
        relativeTo: this._route.parent,
        queryParamsHandling: 'preserve'
    }).then(() => {
        // Tell the parent component to close the drawer
        if (this._route.parent && this._route.parent.component) {
            const parentInstance = this._route.parent.component as any;
            if (parentInstance && typeof parentInstance.closeSidebar === 'function') {
                parentInstance.closeSidebar();
            }
        }
    });
  }

  forceRefresh(): void {
      // Navigate to the same URL to force refresh
      const currentUrl = this._router.url.split('(')[0]; // Remove the sidebar part
      this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this._router.navigate([currentUrl]);
      });
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
        this._snackBar.open('File deleted successfully', 'Close', {
          duration: 3000
        });
        this.closeSidebar();
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}