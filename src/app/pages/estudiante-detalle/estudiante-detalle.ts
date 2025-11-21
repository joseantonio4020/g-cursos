import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EstudianteService } from '../../services/estudiante';
import { CursoService } from '../../services/curso';
import { Estudiante } from '../../models/estudiante';
import { Curso } from '../../models/curso';
import { Loading } from '../../components/loading/loading';


@Component({
  selector: 'app-estudiante-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, Loading],
  templateUrl: './estudiante-detalle.html',
  styleUrls: ['./estudiante-detalle.css']
})
export class EstudianteDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private estudianteService = inject(EstudianteService);
  private cursoService = inject(CursoService);
  
  estudiante: Estudiante | null = null;
  curso: Curso | null = null;
  loading = true;
  estudianteId: string | null = null;
  
  ngOnInit() {
    this.estudianteId = this.route.snapshot.paramMap.get('id');
    
    if (this.estudianteId) {
      this.loadEstudianteDetalle();
    }
  }
  
  loadEstudianteDetalle() {
    if (!this.estudianteId) return;
    
    this.loading = true;
    
    this.estudianteService.getEstudianteById(this.estudianteId).subscribe({
      next: (estudiante) => {
        this.estudiante = estudiante;
        this.loadCurso(estudiante.cursoId);
      },
      error: (error) => {
        console.error('Error al cargar estudiante:', error);
        this.loading = false;
      }
    });
  }
  
  loadCurso(cursoId: string) {
    this.cursoService.getCursoById(cursoId).subscribe({
      next: (curso) => {
        this.curso = curso;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar curso:', error);
        this.loading = false;
      }
    });
  }
  
  getEdad(): number {
    if (!this.estudiante) return 0;
    const hoy = new Date();
    const fechaNac = new Date(this.estudiante.fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  }
  
  getDiasInscritos(): number {
    if (!this.estudiante) return 0;
    const hoy = new Date();
    const fechaInscripcion = new Date(this.estudiante.fechaInscripcion);
    const diff = hoy.getTime() - fechaInscripcion.getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  }
}