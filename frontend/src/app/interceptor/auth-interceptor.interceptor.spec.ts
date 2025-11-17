import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth-interceptor.interceptor';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../service/auth.service';

describe('AuthInterceptor', () => {
  
  // Mock AuthService vì AuthInterceptor phụ thuộc vào nó
  const mockAuthService = {
    getToken: () => 'mock-token'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Cần module này
      providers: [
        AuthInterceptor, // Cung cấp interceptor thật
        { provide: AuthService, useValue: mockAuthService } // Cung cấp mock service
      ]
    });
  });

  it('should be created', () => {
    // Inject class Interceptor
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});