import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const cleanUrl = req.url.replace(environment.apiUrl, '');
  const apiReq = req.clone({
    url: `${environment.apiUrl}${cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl}`
  });
  return next(apiReq);
};