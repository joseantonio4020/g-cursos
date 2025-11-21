import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EstudianteService} from '../../services/estudiante';
import { Estudiante } from '../../models/estudiante';
import { Loading} from '../../components/loading/loading';

@Component({
  selector: 'app-estudiantes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Loading],
  templateUrl: './estudiantes-list.html',
  styleUrls: ['./estudiantes-list.css']
})
export class EstudiantesList implements OnInit {
  private estudianteService = inject(EstudianteService);
  
  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  loading = true;
  
  searchTerm = '';
  filtroEstado = '';
  ordenamiento = 'nombre';
  
  showDeleteModal = false;
  estudianteToDelete: Estudiante | null = null;
  
  ngOnInit() {
    this.loadEstudiantes();
  }
  
  loadEstudiantes() {
    this.loading = true;
    this.estudianteService.getEstudiantes().subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes;
        this.estudiantesFiltrados = estudiantes;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
        this.loading = false;
      }
    });
  }
  
  aplicarFiltros() {
    let resultado = [...this.estudiantes];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(estudiante =>
        estudiante.nombre.toLowerCase().includes(term) ||
        estudiante.apellido.toLowerCase().includes(term) ||
        estudiante.email.toLowerCase().includes(term)
      );
    }
    
    if (this.filtroEstado) {
      resultado = resultado.filter(estudiante => estudiante.estado === this.filtroEstado);
    }
    
    resultado = this.ordenarEstudiantes(resultado);
    
    this.estudiantesFiltrados = resultado;
  }
  
  ordenarEstudiantes(estudiantes: Estudiante[]): Estudiante[] {
    return estudiantes.sort((a, b) => {
      switch (this.ordenamiento) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'apellido':
          return a.apellido.localeCompare(b.apellido);
        case 'fecha':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }
  
  limpiarFiltros() {
    this.searchTerm = '';
    this.filtroEstado = '';
    this.ordenamiento = 'nombre';
    this.aplicarFiltros();
  }
  
  confirmarEliminacion(estudiante: Estudiante) {
    this.estudianteToDelete = estudiante;
    this.showDeleteModal = true;
  }
  
  cancelarEliminacion() {
    this.showDeleteModal = false;
    this.estudianteToDelete = null;
  }
  
  async eliminarEstudiante() {
    if (!this.estudianteToDelete?.id) return;
    
    try {
      await this.estudianteService.deleteEstudiante(this.estudianteToDelete.id);
      this.showDeleteModal = false;
      this.estudianteToDelete = null;
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      alert('Error al eliminar el estudiante');
    }
  }
}