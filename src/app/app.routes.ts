import { Routes } from '@angular/router';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  // Rotas públicas
  {
    path: 'cursos-publicos',
    loadComponent: () => import('./public/components/cursos-publicos/cursos-publicos.component').then(m => m.CursosPublicosComponent),
    title: 'Cursos Disponíveis'
  },
  {
    path: 'atividades-publicas/curso/:cursoId',
    loadComponent: () => import('./public/components/atividades-publicas/atividades-publicas.component').then(m => m.AtividadesPublicasComponent),
    title: 'Atividades do Curso'
  },
  {
    path: 'atividade-publica/:atividadeId',
    loadComponent: () => import('./public/components/visualizar-atividade/visualizar-atividade.component').then(m => m.VisualizarAtividadeComponent),
    title: 'Visualizar Atividade'
  },
  {
    path: '',
    loadComponent: () => import('./dashboard/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: '',
        loadChildren: () => import('./features/cursos/cursos.routes').then(m => m.CURSOS_ROUTES)
      },
      {
        path: '',
        loadChildren: () => import('./features/usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES)
      },
      {
        path: '',
        loadChildren: () => import('./features/atividades/atividades.routes').then(m => m.atividadesRoutes)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

