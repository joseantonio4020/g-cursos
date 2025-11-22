import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
`,
  styles: [`
    .main-content {
      padding: 30px;
      min-height: calc(100vh - 80px);
      background: #f5f7fa;
    }
    
    @media (max-width: 768px) {
      .main-content {
        padding: 15px;
      }
    }
  `]
})
export class App{
  title = 'gestor-cursos';
}