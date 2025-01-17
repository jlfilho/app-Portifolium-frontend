import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage  } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Atividade } from '../../../../shared/models/atividade.model';


@Component({
  selector: 'acadmanage-card-atividade',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatGridListModule, NgOptimizedImage, MatDividerModule, MatIconModule, MatTooltipModule],
  templateUrl: './card-atividade.component.html',
  styleUrl: './card-atividade.component.css'
})
export class CardAtividadeComponent {
  @Input("atividade") atividade!: Atividade;


  urlBase = 'http://localhost:8080/api/files';
}
