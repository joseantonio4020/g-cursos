import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, 
         doc, collectionData, docData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Estudiante } from '../models/estudiante';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private firestore: Firestore = inject(Firestore);
  public authService = inject(AuthService);  // ← CAMBIAR DE private A public
  private estudiantesCollection = collection(this.firestore, 'estudiantes');
  
  getEstudiantes(): Observable<Estudiante[]> {
    const user = this.authService.getCurrentUser();
    if (!user) return new Observable(observer => observer.next([]));
    
    const q = query(this.estudiantesCollection, where('userId', '==', user.uid));
    return collectionData(q, { idField: 'id' }) as Observable<Estudiante[]>;
  }
  
  getEstudiantesByCurso(cursoId: string): Observable<Estudiante[]> {
    const user = this.authService.getCurrentUser();
    if (!user) return new Observable(observer => observer.next([]));
    
    const q = query(
      this.estudiantesCollection, 
      where('userId', '==', user.uid),
      where('cursoId', '==', cursoId)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Estudiante[]>;
  }
  
  getEstudianteById(id: string): Observable<Estudiante> {
    const estudianteDoc = doc(this.firestore, `estudiantes/${id}`);
    return docData(estudianteDoc, { idField: 'id' }) as Observable<Estudiante>;
  }
  
  async addEstudiante(estudiante: Omit<Estudiante, 'id'>) {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('Usuario no autenticado');
    
    const estudianteData = {
      ...estudiante,
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return await addDoc(this.estudiantesCollection, estudianteData);
  }
  
  async updateEstudiante(id: string, estudiante: Partial<Estudiante>) {
    const estudianteDoc = doc(this.firestore, `estudiantes/${id}`);
    return await updateDoc(estudianteDoc, { ...estudiante, updatedAt: new Date() });
  }
  
  async deleteEstudiante(id: string) {
    const estudianteDoc = doc(this.firestore, `estudiantes/${id}`);
    return await deleteDoc(estudianteDoc);
  }
}