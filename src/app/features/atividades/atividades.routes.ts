import { Routes } from '@angular/router';
import { ListaAtividadesComponent } from './components/lista-atividades/lista-atividades.component';
import { FormAtividadeComponent } from './components/form-atividade/form-atividade.component';

export const atividadesRoutes: Routes = [
  {
    path: 'atividades/curso/:cursoId',
    component: ListaAtividadesComponent,
    title: 'Atividades do Curso'
  },
  {
    path: 'atividades/nova/:cursoId',
    component: FormAtividadeComponent,
    title: 'Nova Atividade'
  },
  {
    path: 'atividades/editar/:id',
    component: FormAtividadeComponent,
    title: 'Editar Atividade'
  }
];


