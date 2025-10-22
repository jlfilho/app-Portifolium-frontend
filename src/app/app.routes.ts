import { Routes } from '@angular/router';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cursos-publicos',
    loadComponent: () => import('./features/cursos/components/lista-cursos-publica/lista-cursos-publica.component').then(m => m.ListaCursosPublicaComponent),
    title: 'Cursos Disponíveis'
  },
  {
    path: 'atividades-publicas/curso/:cursoId',
    loadComponent: () => import('./features/atividades/components/lista-atividades-publica/lista-atividades-publica.component').then(m => m.ListaAtividadesPublicaComponent),
    title: 'Atividades do Curso'
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

