import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
         signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RolService } from './rol';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router = inject(Router);
  private rolService = inject(RolService);
  
  user$: Observable<User | null> = user(this.auth);
  
  async register(email: string, password: string, rol: 'admin' | 'usuario' = 'usuario') {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      // Creamos el registro en Firestore
      await this.rolService.crearUsuarioEnFirestore(credential.user.uid, email, rol);
      return credential;
    } catch (error) {
      throw error;
    }
  }
  
  async login(email: string, password: string) {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      // Obtenemos el rol al loguearse
      await this.rolService.obtenerRolUsuario(credential.user.uid);
      return credential;
    } catch (error) {
      throw error;
    }
  }
  
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
  
  getCurrentUser() {
    return this.auth.currentUser;
  }
  
  async cargarRolUsuarioActual() {
    const user = this.getCurrentUser();
    if (user) {
      await this.rolService.obtenerRolUsuario(user.uid);
    }
  }
}