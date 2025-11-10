import { Routes } from '@angular/router';
import { ListaPessoasComponent } from './components/lista-pessoas/lista-pessoas.component';
import { FormPessoaComponent } from './components/form-pessoa/form-pessoa.component';
import { adminManagerSecretaryGuard } from '../../shared/guards/admin-manager-secretary.guard';
import { adminGuard } from '../../shared/guards/admin.guard';

export const PESSOAS_ROUTES: Routes = [
  {
    path: 'pessoas',
    component: ListaPessoasComponent,
    canActivate: [adminManagerSecretaryGuard]
  },
  {
    path: 'pessoas/novo',
    component: FormPessoaComponent,
    canActivate: [adminManagerSecretaryGuard]
  },
  {
    path: 'pessoas/editar/:id',
    component: FormPessoaComponent,
    canActivate: [adminGuard]
  }
];


