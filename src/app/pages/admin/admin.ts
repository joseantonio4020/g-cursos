import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { RolService } from '../../services/rol';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  private firestore = inject(Firestore);
  private rolService = inject(RolService);
  
  usuarios$!: Observable<any[]>;
  loading = true;
  
  ngOnInit() {
    this.cargarUsuarios();
  }
  
  cargarUsuarios() {
    const usuariosCollection = collection(this.firestore, 'usuarios');
    this.usuarios$ = collectionData(usuariosCollection, { idField: 'id' });
    this.loading = false;
  }
  
  async cambiarRol(uid: string, rolActual: string) {
    const nuevoRol = rolActual === 'admin' ? 'usuario' : 'admin';
    
    const confirmacion = confirm(`¿Cambiar rol a ${nuevoRol}?`);
    if (!confirmacion) return;
    
    const exito = await this.rolService.actualizarRol(uid, nuevoRol);
    
    if (exito) {
      alert('Rol actualizado correctamente');
    } else {
      alert('Error al actualizar rol');
    }
  }
}