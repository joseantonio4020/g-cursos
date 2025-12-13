import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { RolService } from '../../services/rol';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  rolService = inject(RolService);
  router = inject(Router);
  
  isMenuOpen = false;
  
  async ngOnInit() {
    this.authService.user$.subscribe(async (user) => {
      if (user) {
        await this.authService.cargarRolUsuarioActual();
      }
    });
  }
  esRutaAuth(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/registro');
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
  
  esAdmin(): boolean {
    return this.rolService.esAdmin();
  }
}