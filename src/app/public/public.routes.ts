import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: 'cursos-publicos',
    loadComponent: () => import('./components/cursos-publicos/cursos-publicos.component').then(m => m.CursosPublicosComponent),
    title: 'Cursos Disponíveis'
  },
  {
    path: 'atividades-publicas/curso/:cursoId',
    loadComponent: () => import('./components/atividades-publicas/atividades-publicas.component').then(m => m.AtividadesPublicasComponent),
    title: 'Atividades do Curso'
  },
  {
    path: 'atividade-publica/:atividadeId',
    loadComponent: () => import('./components/visualizar-atividade/visualizar-atividade.component').then(m => m.VisualizarAtividadeComponent),
    title: 'Visualizar Atividade'
  }
];

