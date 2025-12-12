import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../services/curso';
import { Curso } from '../../models/curso';
import { Loading } from '../../components/loading/loading';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-cursos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Loading],
  templateUrl: './cursos-list.html',
  styleUrls: ['./cursos-list.css']
})
export class CursosList implements OnInit {
  private cursoService = inject(CursoService);
  
  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];
  loading = true;
  
  searchTerm = '';
  filtroEstado = '';
  filtroCategoria = '';
  ordenamiento = 'nombre';
  
  categorias: string[] = [];
  
  showDeleteModal = false;
  cursoToDelete: Curso | null = null;
  
  ngOnInit() {
    this.loadCursos();
  }
  
  loadCursos() {
    this.loading = true;
    this.cursoService.getCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.cursosFiltrados = cursos;
        this.extractCategorias();
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar cursos:', error);
        this.loading = false;
      }
    });
  }
  
  extractCategorias() {
    const categoriasSet = new Set(this.cursos.map(c => c.categoria));
    this.categorias = Array.from(categoriasSet).sort();
  }
  
  aplicarFiltros() {
    let resultado = [...this.cursos];
    
    // Filtro por búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(curso =>
        curso.nombre.toLowerCase().includes(term) ||
        curso.instructor.toLowerCase().includes(term) ||
        curso.descripcion.toLowerCase().includes(term)
      );
    }
    
    // Filtro por estado
    if (this.filtroEstado) {
      resultado = resultado.filter(curso => curso.estado === this.filtroEstado);
    }
    
    // Filtro por categoría
    if (this.filtroCategoria) {
      resultado = resultado.filter(curso => curso.categoria === this.filtroCategoria);
    }
    
    // Ordenamiento
    resultado = this.ordenarCursos(resultado);
    
    this.cursosFiltrados = resultado;
  }
  
  ordenarCursos(cursos: Curso[]): Curso[] {
    return cursos.sort((a, b) => {
      switch (this.ordenamiento) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'fecha':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'precio':
          return a.precio - b.precio;
        default:
          return 0;
      }
    });
  }
  
  limpiarFiltros() {
    this.searchTerm = '';
    this.filtroEstado = '';
    this.filtroCategoria = '';
    this.ordenamiento = 'nombre';
    this.aplicarFiltros();
  }
  
  confirmarEliminacion(curso: Curso) {
    this.cursoToDelete = curso;
    this.showDeleteModal = true;
  }
  
  cancelarEliminacion() {
    this.showDeleteModal = false;
    this.cursoToDelete = null;
  }
  
  async eliminarCurso() {
    if (!this.cursoToDelete?.id) return;
    
    try {
      await this.cursoService.deleteCurso(this.cursoToDelete.id);
      this.showDeleteModal = false;
      this.cursoToDelete = null;
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      alert('Error al eliminar el curso');
    }
  }
}