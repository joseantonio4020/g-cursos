import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado',
  standalone: true
})
export class EstadoPipe implements PipeTransform {
  transform(value: string): string {
    const estados: { [key: string]: string } = {
      'activo': 'Activo',
      'inactivo': 'Inactivo',
      'graduado': 'Graduado',
      'finalizado': 'Finalizado',
      'cancelado': 'Cancelado'
    };
    
    return estados[value] || value;
  }
}