import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso';
import { EstudianteService } from '../../services/estudiante';
import { Curso } from '../../models/curso';
import { Estudiante } from '../../models/estudiante';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-curso-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, Loading],
  templateUrl: './curso-detalle.html',
  styleUrls: ['./curso-detalle.css']
})
export class CursoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private cursoService = inject(CursoService);
  private estudianteService = inject(EstudianteService);
  
  curso: Curso | null = null;
  estudiantes: Estudiante[] = [];
  loading = true;
  cursoId: string | null = null;
  
  ngOnInit() {
    this.cursoId = this.route.snapshot.paramMap.get('id');
    
    if (this.cursoId) {
      this.loadCursoDetalle();
    }
  }
  
  loadCursoDetalle() {
    if (!this.cursoId) return;
    
    this.loading = true;
    
    this.cursoService.getCursoById(this.cursoId).subscribe({
      next: (curso) => {
        this.curso = curso;
        this.loadEstudiantes();
      },
      error: (error) => {
        console.error('Error al cargar curso:', error);
        this.loading = false;
      }
    });
  }
  
  loadEstudiantes() {
    if (!this.cursoId) return;
    
    this.estudianteService.getEstudiantesByCurso(this.cursoId).subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
        this.loading = false;
      }
    });
  }
  
  getDiasRestantes(): number {
    if (!this.curso) return 0;
    const hoy = new Date();
    const fechaFin = new Date(this.curso.fechaFin);
    const diff = fechaFin.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
  
  getEstudiantesActivos(): number {
    return this.estudiantes.filter(e => e.estado === 'activo').length;
  }
  
  getEstudiantesGraduados(): number {
    return this.estudiantes.filter(e => e.estado === 'graduado').length;
  }
}