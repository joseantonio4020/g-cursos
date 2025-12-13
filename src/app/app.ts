import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { Router } from '@angular/router';


export const routes: Routes = [

  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent),
    canActivate: [authGuard, adminGuard] // ✅ Ambos guards
  },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .main-content {
      padding: 30px;
      min-height: calc(100vh - 80px);
      background: #f5f7fa;
    }
    
    @media (max-width: 768px) {
      .main-content {
        padding: 15px;
      }
    }
  `]
})
export class AppComponent {
  constructor(public router: Router) {}

  mostrarHeader(): boolean {
    const rutasOcultas = ['/login', '/registro'];
    return !rutasOcultas.includes(this.router.url);
  }
}