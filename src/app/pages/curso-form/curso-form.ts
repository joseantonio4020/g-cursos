import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso';
import { Curso } from '../../models/curso';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './curso-form.html',
  styleUrls: ['./curso-form.css']
})
export class CursoForm implements OnInit {
  private fb = inject(FormBuilder);
  private cursoService = inject(CursoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  cursoForm: FormGroup;
  isEditMode = false;
  cursoId: string | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  categorias = ['Programación', 'Diseño', 'Marketing', 'Negocios', 'Idiomas', 'Matemáticas', 'Ciencias'];
  
  constructor() {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      instructor: ['', [Validators.required]],
      duracion: [0, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      estado: ['activo', [Validators.required]],
      estudiantesInscritos: [0, [Validators.min(0)]]
    });
  }
  
  ngOnInit() {
    this.cursoId = this.route.snapshot.paramMap.get('id');
    
    if (this.cursoId) {
      this.isEditMode = true;
      this.loadCurso();
    }
  }
  
  loadCurso() {
    if (!this.cursoId) return;
    
    this.loading = true;
    this.cursoService.getCursoById(this.cursoId).subscribe({
      next: (curso) => {
        this.cursoForm.patchValue({
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          instructor: curso.instructor,
          duracion: curso.duracion,
          precio: curso.precio,
          categoria: curso.categoria,
          fechaInicio: this.formatDate(curso.fechaInicio),
          fechaFin: this.formatDate(curso.fechaFin),
          estado: curso.estado,
          estudiantesInscritos: curso.estudiantesInscritos
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar curso:', error);
        this.errorMessage = 'Error al cargar el curso';
        this.loading = false;
      }
    });
  }
  
  formatDate(date: any): string {
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
  }
  
  get nombre() { return this.cursoForm.get('nombre'); }
  get descripcion() { return this.cursoForm.get('descripcion'); }
  get instructor() { return this.cursoForm.get('instructor'); }
  get duracion() { return this.cursoForm.get('duracion'); }
  get precio() { return this.cursoForm.get('precio'); }
  get categoria() { return this.cursoForm.get('categoria'); }
  get fechaInicio() { return this.cursoForm.get('fechaInicio'); }
  get fechaFin() { return this.cursoForm.get('fechaFin'); }
  get estado() { return this.cursoForm.get('estado'); }
  get estudiantesInscritos() { return this.cursoForm.get('estudiantesInscritos'); }
  
  async onSubmit() {
    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      const formValue = this.cursoForm.value;
      const cursoData = {
        ...formValue,
        fechaInicio: new Date(formValue.fechaInicio),
        fechaFin: new Date(formValue.fechaFin)
      };
      
      if (this.isEditMode && this.cursoId) {
        await this.cursoService.updateCurso(this.cursoId, cursoData);
        this.successMessage = 'Curso actualizado exitosamente';
      } else {
        await this.cursoService.addCurso(cursoData as any);
        this.successMessage = 'Curso creado exitosamente';
      }
      
      setTimeout(() => {
        this.router.navigate(['/cursos']);
      }, 1500);
      
    } catch (error) {
      console.error('Error al guardar curso:', error);
      this.errorMessage = 'Error al guardar el curso. Intenta nuevamente.';
      this.loading = false;
    }
  }
}