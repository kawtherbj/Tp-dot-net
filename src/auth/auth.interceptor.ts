import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/do';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('No-Auth') === 'True') {
            console.log('not cloned');
            return next.handle(req.clone());
        }
        if (localStorage.getItem('userToken') != null) {
            const clonedreq = req.clone({
                headers: req.headers.set('Authorization', 'Token ' + localStorage.getItem('userToken'))
            });
            console.log('cloned');
            return next.handle(clonedreq)
                .do(
                succ => { },
                err => {
                    if (err.status === 401) {
                        this.router.navigateByUrl('/login');
                    }
                }
                );
        } else {
            this.router.navigateByUrl('/login');
        }
    }
}
