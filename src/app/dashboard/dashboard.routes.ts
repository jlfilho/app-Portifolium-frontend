import { Routes } from '@angular/router';
import { GraficosComponent } from './graficos/graficos.component';
import { SobreAdminComponent } from './sobre/sobre.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: GraficosComponent
  },
  {
    path: 'sobre',
    component: SobreAdminComponent
  }
];

