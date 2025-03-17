import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    /**
     * Constructor
     */
    constructor(private _authService: AuthService) {
    }

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let newReq = req.clone();

        // Exclude S3 pre-signed URLs from adding the Authorization header
        if (!req.url.includes('amazonaws.com')) {
            if (this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken)) {
                newReq = req.clone({
                    headers: req.headers.set('Authorization', 'Bearer ' + this._authService.accessToken),
                });
            }
        }

        // Handle the request and catch errors
        return next.handle(newReq).pipe(
            catchError((error) => {
                // Handle 401 Unauthorized responses
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    this._authService.signOut();
                    location.reload();
                }
                return throwError(error);
            })
        );
    }
}
