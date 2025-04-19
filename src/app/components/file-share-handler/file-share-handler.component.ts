import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-share-handler',
  templateUrl: './file-share-handler.component.html',
  styleUrls: ['./file-share-handler.component.scss']
})
export class FileShareHandlerComponent implements OnInit {
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.processSharedFile();
  }

  private processSharedFile(): void {
    this.route.queryParams.subscribe(params => {
      try {
        const requiredParams = ['file', 'key', 'date', 'expires', 'signature'];
        const missingParams = requiredParams.filter(p => !params[p]);
        
        if (missingParams.length > 0) {
          throw new Error(`Missing parameters: ${missingParams.join(', ')}`);
        }

        const awsUrl = this.buildAwsUrl(params);
        this.downloadFile(awsUrl);
      } catch (error) {
        this.handleError(error instanceof Error ? error.message : 'Invalid share link');
      }
    });
  }

  private buildAwsUrl(params: any): string {
    return [
      `https://ov-operation-drive.s3.ap-south-1.amazonaws.com/${decodeURIComponent(params['file'])}`,
      `?X-Amz-Algorithm=AWS4-HMAC-SHA256`,
      `&X-Amz-Credential=${decodeURIComponent(params['key'])}`,
      `&X-Amz-Date=${decodeURIComponent(params['date'])}`,
      `&X-Amz-Expires=${decodeURIComponent(params['expires'])}`,
      `&X-Amz-Signature=${decodeURIComponent(params['signature'])}`,
      `&X-Amz-SignedHeaders=host`
    ].join('');
  }

  private downloadFile(url: string): void {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        // Create object URL from blob
        const objectUrl = URL.createObjectURL(blob);
        
        // Create anchor element
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        
        // Extract filename from URL
        const filename = this.extractFilenameFromUrl(url);
        anchor.download = filename || 'download';
        
        // Append to body, click and remove
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        
        // Clean up the object URL
        URL.revokeObjectURL(objectUrl);
        
        // Redirect after download starts
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/files/file-manager']);
        }, 1000);
      })
      .catch(error => {
        this.handleError(`Failed to download file: ${error.message}`);
      });
  }

  private extractFilenameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch {
      return 'download';
    }
  }

  private handleError(message: string): void {
    this.loading = false;
    this.error = message;
    this.snackBar.open(message, 'Close', { duration: 5000 });
    setTimeout(() => this.router.navigate(['/']), 5000);
  }
}