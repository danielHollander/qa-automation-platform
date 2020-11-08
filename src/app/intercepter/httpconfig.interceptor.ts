import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { UserService } from '../services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor() { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        debugger;
        // Get the auth token from localstorage.
        const authToken = localStorage.getItem('Token');
        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        if (authToken) {
            const authReq = req.clone({
                headers: req.headers.set('Authorization', authToken)
            });
            // send cloned request with header to the next handler.
            return next.handle(authReq);
        }
    }
}