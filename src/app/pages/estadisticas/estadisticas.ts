import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso';
import { EstudianteService } from '../../services/estudiante';
import { Curso } from '../../models/curso';
import { Estudiante } from '../../models/estudiante';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, RouterLink, Loading],
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css']
})
export class Estadisticas implements OnInit {
  private cursoService = inject(CursoService);
  private estudianteService = inject(EstudianteService);
  
  cursos: Curso[] = [];
  estudiantes: Estudiante[] = [];
  loading = true;
  
  totalCursos = 0;
  cursosActivos = 0;
  cursosFinalizados = 0;
  cursosCancelados = 0;
  
  totalEstudiantes = 0;
  estudiantesActivos = 0;
  estudiantesInactivos = 0;
  estudiantesGraduados = 0;
  
  precioPromedio = 0;
  duracionPromedio = 0;
  
  categorias: { nombre: string; cantidad: number }[] = [];
  cursosPopulares: Curso[] = [];
  
  ngOnInit() {
    this.loadEstadisticas();
  }
  
  loadEstadisticas() {
    this.loading = true;
    
    this.cursoService.getCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.calcularEstadisticasCursos();
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
        this.calcularEstadisticasEstudiantes();
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
        this.checkLoadingComplete();
      }
    });
  }
  
  calcularEstadisticasCursos() {
    this.totalCursos = this.cursos.length;
    this.cursosActivos = this.cursos.filter(c => c.estado === 'activo').length;
    this.cursosFinalizados = this.cursos.filter(c => c.estado === 'finalizado').length;
    this.cursosCancelados = this.cursos.filter(c => c.estado === 'cancelado').length;
    
    if (this.cursos.length > 0) {
      this.precioPromedio = this.cursos.reduce((sum, c) => sum + c.precio, 0) / this.cursos.length;
      this.duracionPromedio = this.cursos.reduce((sum, c) => sum + c.duracion, 0) / this.cursos.length;
    }
    
    this.calcularCategorias();
    this.calcularCursosPopulares();
  }
  
  calcularEstadisticasEstudiantes() {
    this.totalEstudiantes = this.estudiantes.length;
    this.estudiantesActivos = this.estudiantes.filter(e => e.estado === 'activo').length;
    this.estudiantesInactivos = this.estudiantes.filter(e => e.estado === 'inactivo').length;
    this.estudiantesGraduados = this.estudiantes.filter(e => e.estado === 'graduado').length;
  }
  
  calcularCategorias() {
    const categoriasMap = new Map<string, number>();
    
    this.cursos.forEach(curso => {
      const count = categoriasMap.get(curso.categoria) || 0;
      categoriasMap.set(curso.categoria, count + 1);
    });
    
    this.categorias = Array.from(categoriasMap.entries())
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }
  
  calcularCursosPopulares() {
    this.cursosPopulares = [...this.cursos]
      .sort((a, b) => b.estudiantesInscritos - a.estudiantesInscritos)
      .slice(0, 5);
  }
  
  checkLoadingComplete() {
    if (this.cursos !== undefined && this.estudiantes !== undefined) {
      this.loading = false;
    }
  }
  
  getPorcentajeCursosActivos(): number {
    return this.totalCursos > 0 ? (this.cursosActivos / this.totalCursos) * 100 : 0;
  }
  
  getPorcentajeEstudiantesActivos(): number {
    return this.totalEstudiantes > 0 ? (this.estudiantesActivos / this.totalEstudiantes) * 100 : 0;
  }
}