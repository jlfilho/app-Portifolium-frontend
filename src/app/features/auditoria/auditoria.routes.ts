import { Routes } from '@angular/router';
import { adminGuard } from '../../shared/guards/admin.guard';

export const AUDITORIA_ROUTES: Routes = [
  {
    path: 'auditoria',
    loadComponent: () => import('./pages/auditoria/auditoria.component').then(m => m.AuditoriaComponent),
    canActivate: [adminGuard],
    title: 'Auditoria'
  },
  {
    path: 'auditoria/entity/:entityName/:entityId/history',
    loadComponent: () => import('./pages/entity-history/entity-history.component').then(m => m.EntityHistoryComponent),
    canActivate: [adminGuard],
    title: 'Histórico da Entidade'
  }
];

