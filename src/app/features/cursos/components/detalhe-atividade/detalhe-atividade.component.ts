import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Location } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Atividade } from '../../../../shared/models/atividade.model';
import { CursosService } from '../../services/cursos.service';
import { ActivatedRoute } from '@angular/router';
import { Evidencia } from '../../../../shared/models/evidencia.model';

@Component({
  selector: 'acadmanage-detalhe-atividade',
  imports: [CommonModule, NgOptimizedImage, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './detalhe-atividade.component.html',
  styleUrl: './detalhe-atividade.component.scss'
})
export class DetalheAtividadeComponent {
  atividadeId!: number;
  atividade: Atividade = {id: 0, nome: ''};
  evidencias: Evidencia[] = [];
  errorMessage: string = ''; // Mensagem de erro (caso ocorra)
  urlBase = 'http://localhost:8080/api/files';

  constructor(private cursosService: CursosService, private route: ActivatedRoute, private location: Location) {
      // Extrai o parâmetro 'id' da URL
      this.route.params.subscribe(params => {
        this.atividadeId = +params['id'];
        this.loadAtividade();
        this.loadEvidencias();
      });
      }

      loadAtividade(): void {
        this.cursosService.getAtividadeById(this.atividadeId).subscribe({
          next: (data) => {
            this.atividade = data; // Atribui os cursos à variável
            console.log(this.atividade); // Para depuração
          },
          error: (error) => {
            this.errorMessage = 'Erro ao carregar o detalhe da atividade. Tente novamente.';
            console.error(error); // Para depuração
          },
        });
      }

      voltar(): void {
        this.location.back(); // Retorna para a tela anterior
      }

      loadEvidencias(): void {
        this.cursosService.getEvidenciasByAtividadeId(this.atividadeId).subscribe({
          next: (data) => {
            this.evidencias = data; // Atribui os cursos à variável
            console.log(this.evidencias); // Para depuração
          },
          error: (error) => {
            this.errorMessage = 'Erro ao carregar as evidências. Tente novamente.';
            console.error(error); // Para depuração
          },
        });
      }
}
