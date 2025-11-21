export interface Curso {
  id?: string;
  nombre: string;
  descripcion: string;
  instructor: string;
  duracion: number; // en horas
  precio: number;
  categoria: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'activo' | 'finalizado' | 'cancelado';
  estudiantesInscritos: number;
  userId: string; // ID del usuario que creó el curso
  createdAt: Date;
  updatedAt: Date;
}