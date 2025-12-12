export interface Usuario {
  uid: string;
  email: string;
  displayName?: string;
  rol: 'admin' | 'usuario';
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}