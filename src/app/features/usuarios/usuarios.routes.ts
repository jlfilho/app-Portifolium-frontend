import { Routes } from '@angular/router';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { FormUsuarioComponent } from './components/form-usuario/form-usuario.component';
import { adminGuard } from '../../shared/guards/admin.guard';

export const USUARIOS_ROUTES: Routes = [
  {
    path: 'usuarios',
    component: ListaUsuariosComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'usuarios/novo',
    component: FormUsuarioComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'usuarios/editar/:id',
    component: FormUsuarioComponent,
    canActivate: [adminGuard]
  }
];

