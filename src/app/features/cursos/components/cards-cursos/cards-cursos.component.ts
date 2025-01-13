import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage  } from '@angular/common';

import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


import { CursosService } from '../../services/cursos.service';

@Component({
  selector: 'acadmanage-cards-cursos',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatGridListModule, NgOptimizedImage, MatDividerModule, MatIconModule, MatTooltipModule],
  templateUrl: './cards-cursos.component.html',
  styleUrl: './cards-cursos.component.css'
})
export class CardsCursosComponent  {
  cursos: any[] = []; // Armazena a lista de cursos
  errorMessage: string = ''; // Mensagem de erro (caso ocorra)

  constructor(private cursosService: CursosService) {
    this.loadCourses();
  }



  // Método para carregar os cursos do usuário
  loadCourses(): void {
    this.cursosService.getUserCourses().subscribe({
      next: (data) => {
        this.cursos = data; // Atribui os cursos à variável
        console.log(this.cursos); // Para depuração
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os cursos. Tente novamente.';
        console.error(error); // Para depuração
      },
    });
  }

}
