import { Routes } from '@angular/router';
import { AuthGuard } from '@angular/fire/auth-guard';
import { authGuard } from './guards/auth-guard';
import { Register } from './pages/register/register';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent : () => import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'dashboard',
    loadComponent : () => import('./pages/dashboard/dashboard').then(m => m.Dashboard ),
    canActivate: [AuthGuard ]
  },
  {
    path: 'cursos',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent : () => import('./pages/cursos-list/cursos-list').then(m => m.CursosList )
      },
      {
        path: 'nuevo',
        loadComponent : () => import('./pages/curso-form/curso-form').then(m => m.CursoForm )
      },
      {
        path: 'editar/:id',
        loadComponent : () => import('./pages/curso-form/curso-form').then(m => m.CursoForm )
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./pages/curso-detalle/curso-detalle').then(m => m.CursoDetalle)
      }
    ]
  },
  {
    path: 'estudiantes',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/estudiantes-list/estudiantes-list').then(m => m.EstudiantesList )
      },
      {
        path: 'nuevo',
        loadComponent : () => import('./pages/estudiante-form/estudiante-form').then(m => m.EstudianteForm )
      },
      {
        path: 'editar/:id',
        loadComponent : () => import('./pages/estudiante-form/estudiante-form').then(m => m.EstudianteForm )
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./pages/estudiante-detalle/estudiante-detalle').then(m => m.EstudianteDetalle)
      }
    ]
  },
  {
    path: 'estadisticas',
    loadComponent: () => import('./pages/estadisticas/estadisticas').then(m => m.Estadisticas),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound)
  }
];