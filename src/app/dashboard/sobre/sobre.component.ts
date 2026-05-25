import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { APP_VERSION } from '../../../environments/version';

@Component({
  selector: 'app-sobre-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.css'
})
export class SobreAdminComponent {
  versao = APP_VERSION;
  anoAtual = new Date().getFullYear();
}

