export interface Estudiante {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: Date;
  cursoId: string; // Relación con Curso
  fechaInscripcion: Date;
  estado: 'activo' | 'inactivo' | 'graduado';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}