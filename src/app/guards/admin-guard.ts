import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { RolService } from '../services/rol';
import { AuthService } from '../services/auth';

export const adminGuard = async () => {
  const rolService = inject(RolService);
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getCurrentUser();
  
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  
  await authService.cargarRolUsuarioActual();
  
  if (rolService.esAdmin()) {
    return true;
  } else {
    router.navigate(['/dashboard']);
    alert('No tienes permisos de administrador');
    return false;
  }
};