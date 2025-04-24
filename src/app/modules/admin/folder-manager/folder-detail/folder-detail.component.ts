import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileManagerService } from '../../file-manager/file-manager.service';

@Component({
    selector: 'app-folder-detail',
    templateUrl: './folder-detail.component.html',
    styleUrls: ['./folder-detail.component.scss'],
})
export class FolderDetailComponent implements OnInit, OnDestroy {
    folder: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _route: ActivatedRoute, private _router: Router, private _fileManagerService: FileManagerService, private _fuseConfirmationService: FuseConfirmationService, private _snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this._route.params.pipe(takeUntil(this._unsubscribeAll)).subscribe((params) => {
            this.folder = {
                name: params.name,
                path: this._route.snapshot.queryParamMap.get('path'),
                filesCount: this._route.snapshot.queryParamMap.get('filesCount'),
                subfoldersCount: this._route.snapshot.queryParamMap.get('subfoldersCount'),
            };
        });
    }

    navigateToFolder(): void {
        if (this.folder?.path) {
            this._router.navigate(['/folders/folder-manager'], {
                queryParams: { path: this.folder.path },
            });
        }
        this.closeSidebar();
    }

    closeSidebar(): void {
        this._router.navigate([{ outlets: { sidebar: null } }], {
            relativeTo: this._route.parent,
            queryParamsHandling: 'preserve',
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
