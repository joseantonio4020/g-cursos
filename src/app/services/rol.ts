import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private firestore = inject(Firestore);

  // BehaviorSubject para mantener el estado del rol actual
  private rolActualSubject = new BehaviorSubject<string>('usuario');
  public rolActual$ = this.rolActualSubject.asObservable();

  // 1. Crear usuario en la base de datos (Se llama desde registro)
  async crearUsuarioEnFirestore(uid: string, email: string, rol: 'admin' | 'usuario' = 'usuario') {
    const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
    
    const usuarioData = {
      uid,
      email,
      rol,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(usuarioRef, usuarioData);
    return usuarioData;
  }

  // 2. Obtener el rol (Se llama desde login)
  async obtenerRolUsuario(uid: string): Promise<string> {
    try {
      const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
      const usuarioSnap = await getDoc(usuarioRef);
      
      if (usuarioSnap.exists()) {
        const rol = usuarioSnap.data()['rol'] || 'usuario';
        this.rolActualSubject.next(rol); // Actualizamos el estado
        return rol;
      }
      
      return 'usuario';
    } catch (error) {
      console.error('Error al obtener rol:', error);
      return 'usuario';
    }
  }

  // 3. Actualizar rol (Se llama desde el panel admin)
  // Eliminamos la dependencia de AuthService aquí para romper el ciclo
  async actualizarRol(uid: string, nuevoRol: 'admin' | 'usuario') {
    try {
      const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
      await updateDoc(usuarioRef, {
        rol: nuevoRol,
        updatedAt: new Date()
      });
      
      // Ya no verificamos el usuario actual aquí para evitar el error circular.
      // Si el usuario se actualiza a sí mismo, el cambio se reflejará al recargar.
      
      return true;
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      return false;
    }
  }

  esAdmin(): boolean {
    return this.rolActualSubject.value === 'admin';
  }

  getRolActual(): string {
    return this.rolActualSubject.value;
  }
}