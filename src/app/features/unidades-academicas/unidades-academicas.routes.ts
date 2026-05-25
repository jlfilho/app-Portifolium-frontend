import { Routes } from '@angular/router';
import { adminGuard } from '../../shared/guards/admin.guard';
import { ListaUnidadesAcademicasComponent } from './components/lista-unidades-academicas/lista-unidades-academicas.component';
import { FormUnidadeAcademicaComponent } from './components/form-unidade-academica/form-unidade-academica.component';

export const UNIDADES_ACADEMICAS_ROUTES: Routes = [
  {
    path: 'unidades-academicas',
    component: ListaUnidadesAcademicasComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'unidades-academicas/novo',
    component: FormUnidadeAcademicaComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'unidades-academicas/editar/:id',
    component: FormUnidadeAcademicaComponent,
    canActivate: [adminGuard]
  }
];


