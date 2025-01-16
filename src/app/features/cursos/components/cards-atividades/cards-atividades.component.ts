import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';


import { Categoria } from '../../../../shared/models/categoria.model';
import { Curso } from '../../../../shared/models/curso.model';
import { CursosService } from '../../services/cursos.service';
import { CardAtividadeComponent } from '../card-atividade/card-atividade.component';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'acadmanage-cards-atividades',
  imports: [CommonModule, CardAtividadeComponent, RouterModule, MatCardModule, MatButtonModule, MatGridListModule, MatDividerModule, MatIconModule, MatTooltipModule, MatButtonToggleModule, MatFormFieldModule, MatInputModule],
  templateUrl: './cards-atividades.component.html',
  styleUrl: './cards-atividades.component.css'
})
export class CardsAtividadesComponent implements OnInit {
  cursoId!: number; // Armazenará o ID da atividade
  curso: Curso = {id: 0, nome: ''}; // Armazena a atividade
  atividades: any[] = []; // Armazena a lista de atividades
  categorias: Categoria[] = []; // Armazena a lista de atividades
  errorMessage: string = ''; // Mensagem de erro (caso ocorra)


  constructor(private cursosService: CursosService, private route: ActivatedRoute) {
    // Extrai o parâmetro 'id' da URL
    this.route.params.subscribe(params => {
      this.cursoId = +params['id']; // Converte para número se necessário
      console.log('ID do curso:', this.cursoId);
      this.loadCurso();
    });
    }

    ngOnInit(): void {
      this.listCategorias();
    }

    listCategorias(): void {
      this.cursosService.getCategoriasPorCurso(this.cursoId).subscribe({
        next: (data) => {
          this.categorias = data;
          this.categorias.sort((a, b) => a.nome.localeCompare(b.nome));
          console.log(this.categorias); // Para depuração
        },
        error: (error) => {
          this.errorMessage = 'Erro ao carregar as atividades. Tente novamente.';
          console.error(error); // Para depuração
        },
      });

    }

    loadCurso(): void {
      this.cursosService.getCourseById(this.cursoId).subscribe({
        next: (data) => {
          this.curso = data; // Atribui os cursos à variável
          console.log(this.curso); // Para depuração
        },
        error: (error) => {
          this.errorMessage = 'Erro ao carregar as atividades. Tente novamente.';
          console.error(error); // Para depuração
        },
      });
    }

}
