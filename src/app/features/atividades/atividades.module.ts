import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Components
import { ListaAtividadesComponent } from './components/lista-atividades/lista-atividades.component';

// Services
import { AtividadesService } from './services/atividades.service';

// Routes
import { atividadesRoutes } from './atividades.routes';

// Models
export * from './models/atividade.model';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(atividadesRoutes),
    ListaAtividadesComponent
  ],
  providers: [
    AtividadesService
  ]
})
export class AtividadesModule { }
