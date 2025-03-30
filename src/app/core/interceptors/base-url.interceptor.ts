import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const cleanUrl = req.url.replace(environment.apiUrl, '');
  const apiReq = req.clone({
    url: `${environment.apiUrl}${cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl}`
  });
  
  return next(apiReq).pipe(
    catchError(error => {
      if (error.error?.errors) {
        const firstError = Object.values(error.error.errors)[0];
        return throwError(() => new Error(Array.isArray(firstError) ? firstError[0] : firstError));
      }
      return throwError(() => error);
    })
  );
};