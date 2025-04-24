import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const BASE_URI = environment.baseURI;

@Injectable({
    providedIn: 'root',
})
export class FileManagerService {
    constructor(private _httpClient: HttpClient) {}

    getBucketObjectList(directoryPath, limit): Observable<any> {
        const params = new HttpParams().set('prefix', directoryPath).set('limit', limit);
        const requestUrl = `${BASE_URI}/user/get-bucket-object-list`;
        return this._httpClient.get<any>(requestUrl, { params });
    }
    updateBucketObject(payload): Observable<any> {
        const requestUrl = `${BASE_URI}/user/update-bucket-object`;
        return this._httpClient.post<any>(requestUrl, payload);
    }
    deleteBucketObject(payload): Observable<any> {
        const fileName = encodeURIComponent(payload.fileName); // Ensure the fileName is properly encoded
        const requestUrl = `${BASE_URI}/user/delete-file?fileName=${fileName}`;

        return this._httpClient.delete<any>(requestUrl);
    }

    getPreSignedURL(fileName, expiresIn): Observable<any> {
        const requestUrl = `${BASE_URI}/user/generate-file-pre-signed-url`;
        const params = new HttpParams().set('fileName', fileName).set('expiresIn', expiresIn);

        // Pass params as the second argument
        return this._httpClient.get<any>(requestUrl, { params });
    }

    initiateUpload(fileName: string, fileType: string) {
        const requestUrl = `${BASE_URI}/user/initiate-multipart-upload`;
        return this._httpClient.post<{ uploadId: string }>(requestUrl, { fileName, fileType });
    }

    generatePresignedUrls(fileName: string, uploadId: string, partNumbers: number[]) {
        const requestUrl = `${BASE_URI}/user/generate-presigned-urls`;
        return this._httpClient.post<{ urls: any }>(requestUrl, { fileName, uploadId, partNumbers });
    }

    completeUpload(fileName: string, uploadId: string, parts: any[]) {
        const requestUrl = `${BASE_URI}/user/complete-multipart-upload`;
        return this._httpClient.post(requestUrl, { fileName, uploadId, parts });
    }

    /**
     * Upload a file chunk to S3 using a pre-signed URL.
     * @param url The pre-signed URL for the S3 part upload.
     * @param chunk The file chunk to be uploaded.
     * @returns An observable with the ETag and PartNumber on success.
     */
    uploadPart(url: string, chunk: Blob): Observable<{ PartNumber: number; ETag: string }> {
        // Upload the chunk using HttpClient
        return new Observable((observer) => {
            this._httpClient
                .put(url, chunk, {
                    headers: new HttpHeaders({
                        'Content-Type': chunk.type, // Set the content type of the file chunk
                    }),
                    reportProgress: true,
                    observe: 'events',
                })
                .subscribe({
                    next: (event) => {
                        if (event.type === HttpEventType.Response) {
                            const eTag = event.headers.get('ETag');
                            if (eTag) {
                                observer.next({ PartNumber: -1, ETag: eTag }); // PartNumber to be set by caller
                                observer.complete();
                            } else {
                                observer.error(new Error('Missing ETag in the response'));
                            }
                        }
                    },
                    error: (err) => {
                        observer.error(err);
                    },
                });
        });
    }
}
