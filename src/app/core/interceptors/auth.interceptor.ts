import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${user.token}`)
    });
    return next(cloned);
  }
  return next(req);
};