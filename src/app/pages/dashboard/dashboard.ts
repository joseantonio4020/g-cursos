import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso';
import { EstudianteService } from '../../services/estudiante';
import { Curso } from '../../models/curso';
import { Estudiante } from '../../models/estudiante';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  private cursoService = inject(CursoService);
  private estudianteService = inject(EstudianteService);
  
  cursos: Curso[] = [];
  estudiantes: Estudiante[] = [];
  loading = true;
  
  totalCursos = 0;
  cursosActivos = 0;
  totalEstudiantes = 0;
  estudiantesActivos = 0;
  
  ngOnInit() {
    this.loadDashboardData();
  }
  
  loadDashboardData() {
    this.loading = true;
    
    this.cursoService.getCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.totalCursos = cursos.length;
        this.cursosActivos = cursos.filter(c => c.estado === 'activo').length;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error al cargar cursos:', error);
        this.checkLoadingComplete();
      }
    });
    
    this.estudianteService.getEstudiantes().subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes;
        this.totalEstudiantes = estudiantes.length;
        this.estudiantesActivos = estudiantes.filter(e => e.estado === 'activo').length;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
        this.checkLoadingComplete();
      }
    });
  }
  
  checkLoadingComplete() {
    if (this.cursos !== undefined && this.estudiantes !== undefined) {
      this.loading = false;
    }
  }
  
  getUltimosCursos() {
    return this.cursos.slice(0, 5);
  }
}