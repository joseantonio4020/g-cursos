import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { EstudianteService } from '../../services/estudiante';
import { CursoService } from '../../services/curso';
import { Estudiante } from '../../models/estudiante';
import { Curso } from '../../models/curso';

@Component({
  selector: 'app-estudiante-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './estudiante-form.html',
  styleUrls: ['./estudiante-form.css']
})
export class EstudianteForm implements OnInit {
  private fb = inject(FormBuilder);
  private estudianteService = inject(EstudianteService);
  private cursoService = inject(CursoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  estudianteForm: FormGroup;
  isEditMode = false;
  estudianteId: string | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  cursos: Curso[] = [];
  
  constructor() {
    this.estudianteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      fechaNacimiento: ['', [Validators.required]],
      cursoId: ['', [Validators.required]],
      fechaInscripcion: ['', [Validators.required]],
      estado: ['activo', [Validators.required]]
    });
  }
  
  ngOnInit() {
    this.loadCursos();
    this.estudianteId = this.route.snapshot.paramMap.get('id');
    
    const cursoIdParam = this.route.snapshot.queryParamMap.get('cursoId');
    if (cursoIdParam) {
      this.estudianteForm.patchValue({ cursoId: cursoIdParam });
    }
    
    if (this.estudianteId) {
      this.isEditMode = true;
      this.loadEstudiante();
    }
  }
  
  loadCursos() {
    this.cursoService.getCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos.filter(c => c.estado === 'activo');
      },
      error: (error) => {
        console.error('Error al cargar cursos:', error);
      }
    });
  }
  
  loadEstudiante() {
    if (!this.estudianteId) return;
    
    this.loading = true;
    this.estudianteService.getEstudianteById(this.estudianteId).subscribe({
      next: (estudiante) => {
        this.estudianteForm.patchValue({
          nombre: estudiante.nombre,
          apellido: estudiante.apellido,
          email: estudiante.email,
          telefono: estudiante.telefono,
          fechaNacimiento: this.formatDate(estudiante.fechaNacimiento),
          cursoId: estudiante.cursoId,
          fechaInscripcion: this.formatDate(estudiante.fechaInscripcion),
          estado: estudiante.estado
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estudiante:', error);
        this.errorMessage = 'Error al cargar el estudiante';
        this.loading = false;
      }
    });
  }
  
  formatDate(date: any): string {
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
  }
  
  get nombre() { return this.estudianteForm.get('nombre'); }
  get apellido() { return this.estudianteForm.get('apellido'); }
  get email() { return this.estudianteForm.get('email'); }
  get telefono() { return this.estudianteForm.get('telefono'); }
  get fechaNacimiento() { return this.estudianteForm.get('fechaNacimiento'); }
  get cursoId() { return this.estudianteForm.get('cursoId'); }
  get fechaInscripcion() { return this.estudianteForm.get('fechaInscripcion'); }
  get estado() { return this.estudianteForm.get('estado'); }
  
  async onSubmit() {
    if (this.estudianteForm.invalid) {
      this.estudianteForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      const formValue = this.estudianteForm.value;
      const estudianteData = {
        ...formValue,
        fechaNacimiento: new Date(formValue.fechaNacimiento),
        fechaInscripcion: new Date(formValue.fechaInscripcion)
      };
      
      if (this.isEditMode && this.estudianteId) {
        await this.estudianteService.updateEstudiante(this.estudianteId, estudianteData);
        this.successMessage = 'Estudiante actualizado exitosamente';
      } else {
        await this.estudianteService.addEstudiante(estudianteData as any);
        this.successMessage = 'Estudiante registrado exitosamente';
      }
      
      setTimeout(() => {
        this.router.navigate(['/estudiantes']);
      }, 1500);
      
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
      this.errorMessage = 'Error al guardar el estudiante. Intenta nuevamente.';
      this.loading = false;
    }
  }
}