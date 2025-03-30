import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getUserRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  const createMockRoute = (role?: string): ActivatedRouteSnapshot => {
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', [], { data: { role } });
    return route;
  };

  it('should allow access for authenticated user with correct role', () => {
    const route = createMockRoute('master');

    authService.isAuthenticated.and.returnValue(true);
    authService.getUserRole.and.returnValue('master');

    expect(guard.canActivate(route)).toBe(true);
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it('should redirect to login for unauthenticated user', () => {
    const route = createMockRoute('master');

    authService.isAuthenticated.and.returnValue(false);

    expect(guard.canActivate(route)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(toastr.error).toHaveBeenCalledWith('Please login to access this page');
  });

  it('should redirect to home for incorrect role', () => {
    const route = createMockRoute('master');

    authService.isAuthenticated.and.returnValue(true);
    authService.getUserRole.and.returnValue('medecin');

    expect(guard.canActivate(route)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(toastr.error).toHaveBeenCalledWith('You do not have permission to access this page');
  });

  it('should handle missing role in route data', () => {
    const route = createMockRoute();

    authService.isAuthenticated.and.returnValue(true);

    expect(guard.canActivate(route)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(toastr.error).toHaveBeenCalledWith('You do not have permission to access this page');
  });
});
