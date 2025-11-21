import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login{
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  get email() {
    return this.loginForm.get('email');
  }
  
  get password() {
    return this.loginForm.get('password');
  }
  
  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.loading = false;
      
      switch (error.code) {
        case 'auth/user-not-found':
          this.errorMessage = 'No existe una cuenta con este correo.';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Contraseña incorrecta.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'Correo electrónico inválido.';
          break;
        case 'auth/invalid-credential':
          this.errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
          break;
        default:
          this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
      }
    }
  }
}