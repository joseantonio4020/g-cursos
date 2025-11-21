import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
         signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router = inject(Router);
  
  user$: Observable<User | null> = user(this.auth);
  
  async register(email: string, password: string) {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      return credential;
    } catch (error) {
      throw error;
    }
  }
  
  async login(email: string, password: string) {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
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
}