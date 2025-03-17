import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FileManagerService } from './file-manager.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
})
export class FileUploaderComponent {
  fileForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;

  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FileUploaderComponent>,
    private FileService: FileManagerService, // Service to handle file upload
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    this.fileForm = this.fb.group({
      directoryPath: ['', Validators.required], // String input for directoryPath
    });
  }

  // Trigger hidden file input click event
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  // Store the selected file
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file ? file : null;
    this.uploadProgress = 0; // Reset progress
  }

  // Upload the selected file
  async onSubmit() {
    if (!this.selectedFile) return;

    this.isUploading = true;

    const file = this.selectedFile;
    const fileName = file.name;
    const fileType = file.type;
    const partSize = 5 * 1024 * 1024; // 5MB
    const partNumbers = Array.from(
      { length: Math.ceil(file.size / partSize) },
      (_, i) => i + 1
    );

    try {
      const fullFileName = `${this.fileForm.get('directoryPath').value}/${fileName}`;
      // Step 1: Initiate multipart upload
      const { uploadId } = await lastValueFrom(
        this.FileService.initiateUpload(fullFileName, fileType)
      )

      // Step 2: Generate pre-signed URLs
      const { urls } = await lastValueFrom(
        this.FileService.generatePresignedUrls(fullFileName, uploadId, partNumbers)
      )

      const uploadPromises = urls.map((url: string, index: number) => {
        const start = index * partSize;
        const end = Math.min(start + partSize, file.size);
        const chunk = file.slice(start, end);
  
        return lastValueFrom(
          this.FileService.uploadPart(url, chunk)
        ).then((res) => ({
          PartNumber: index + 1,
          ETag: res.ETag,
        }));
      });

      // // Track progress for all parts
      let completedParts = 0;
      for (const promise of uploadPromises) {
        await promise;
        completedParts++;
        this.uploadProgress = Math.floor((completedParts / urls.length) * 100);
      }

      const parts = await Promise.all(uploadPromises);

      // // Step 3: Complete multipart upload
      await lastValueFrom(
        this.FileService.completeUpload(fullFileName, uploadId, parts)
      )

      this.dialogRef.close(); // Close dialog after upload
      this._snackBar.open("File Uploaded Successfully", 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-primary']
      });
    } catch (error) {
      this._snackBar.open(error.message, 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    } finally {
      this.isUploading = false;
      this.uploadProgress = 0; // Reset progress after upload
    }
  }

}
