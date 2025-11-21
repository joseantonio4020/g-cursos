import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  
  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
  
  get email() {
    return this.registerForm.get('email');
  }
  
  get password() {
    return this.registerForm.get('password');
  }
  
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  
  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    try {
      const { email, password } = this.registerForm.value;
      await this.authService.register(email, password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.loading = false;
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'Este correo ya está registrado.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'Correo electrónico inválido.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'La contraseña es muy débil.';
          break;
        default:
          this.errorMessage = 'Error al registrarse. Intenta nuevamente.';
      }
    }
  }
}