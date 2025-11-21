import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, 
         doc, collectionData, docData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private firestore: Firestore = inject(Firestore);
  public authService = inject(AuthService);  // ← CAMBIAR DE private A public
  private cursosCollection = collection(this.firestore, 'cursos');
  
  getCursos(): Observable<Curso[]> {
    const user = this.authService.getCurrentUser();
    if (!user) return new Observable(observer => observer.next([]));
    
    const q = query(this.cursosCollection, where('userId', '==', user.uid));
    return collectionData(q, { idField: 'id' }) as Observable<Curso[]>;
  }
  
  getCursoById(id: string): Observable<Curso> {
    const cursoDoc = doc(this.firestore, `cursos/${id}`);
    return docData(cursoDoc, { idField: 'id' }) as Observable<Curso>;
  }
  
  async addCurso(curso: Omit<Curso, 'id'>) {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('Usuario no autenticado');
    
    const cursoData = {
      ...curso,
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return await addDoc(this.cursosCollection, cursoData);
  }
  
  async updateCurso(id: string, curso: Partial<Curso>) {
    const cursoDoc = doc(this.firestore, `cursos/${id}`);
    return await updateDoc(cursoDoc, { ...curso, updatedAt: new Date() });
  }
  
  async deleteCurso(id: string) {
    const cursoDoc = doc(this.firestore, `cursos/${id}`);
    return await deleteDoc(cursoDoc);
  }
}