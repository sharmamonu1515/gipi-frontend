import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import {
    NgForm,
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GstAddDataComponent } from '../gst/gst.component';
import { FileManagerService } from './file-manager.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-file-detail',
    templateUrl: './file-detail.component.html',
})
export class FileDetailComponent implements OnInit {
    folders: Array<any> = [];
    files: Array<any> = [];
    formFieldHelpers: string[] = [''];
    fileForm: UntypedFormGroup;
    type: any = 'File';
    file: any = {};
    url = '';
    shareTypes: string[] = ['public', 'private'];
    constructor(
        public dialogRef: MatDialogRef<GstAddDataComponent>,
        private _formBuilder: UntypedFormBuilder,
        public FileService: FileManagerService,
        public _fuseConfirmationService:FuseConfirmationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.file = data.file;

       
        
      
    }

    ngOnInit() {
        // Create the MCA Details form
        this.fileForm = this._formBuilder.group({
            shareType: [this.file.shareType, [Validators.required]],
            fileName: [this.file.name, [Validators.required]],
            expiresIn: [1, [Validators.required]],
        });

    }

    openFile(file: any): void {
        // Construct the file path
        let filePath = file.folder +"/"+ file.name + '.' + file.type;

        // Get pre-signed URL using the FileService
        this.FileService.getPreSignedURL(
            filePath,
            file.expiresIn * 60 * 60
        ).subscribe((res) => {
            // Get the URL from the response
            this.url = res.data;

            window.open(this.url, '_blank');
        });
    }

    getFileUrl(file) {
        console.log(file);
        const expiresIn = this.fileForm.get('expiresIn').value; 
        let filePath = file.folder +"/"+ file.name + '.' + file.type;
        this.FileService.getPreSignedURL(
            filePath,
            expiresIn * 60 * 60
        ).subscribe((res) => {
            this.url = res.data;
            const dialogRef = this._fuseConfirmationService.open({
                title: `The URL expires in ${expiresIn} Hour`,
                message: `${res.data.substring(0,80)}`,
                icon: {
                  show: false,
                  name: "heroicons_outline:exclamation",
                  color: "warn",
                },
                actions: {
                  confirm: {
                    show: false,
                    label: "Remove",
                    color: "warn",
                  },
                  cancel: {
                    show: true,
                    label: "Close",
                  },
                },
                dismissible: false,
              });
            
              dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                }})
        });
    }



}
