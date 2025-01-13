import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';


import { ApiService } from './../../shared/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'acadmanage-home',
  imports: [RouterOutlet, RouterModule, MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, MatListModule, MatMenuModule, CommonModule, MatCardModule  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isCollapsed = false;
  userName = 'Usuário';

  constructor(private apiService: ApiService, private router: Router) {}


  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }


  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']); // Redireciona para a tela de login
  }

}
