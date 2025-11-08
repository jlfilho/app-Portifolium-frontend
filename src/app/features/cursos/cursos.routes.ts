import { Routes } from '@angular/router';
import { CardsCursosComponent } from './components/cards-cursos/cards-cursos.component';
import { FormCursoComponent } from './components/form-curso/form-curso.component';
import { ListaCategoriasComponent } from './components/lista-categorias/lista-categorias.component';
import { FormCategoriaComponent } from './components/form-categoria/form-categoria.component';
import { adminGuard } from '../../shared/guards/admin.guard';
import { PermissoesCursoFormComponent } from './components/permissoes-curso-form/permissoes-curso-form.component';
import { ListaTiposCursoComponent } from './components/lista-tipos-curso/lista-tipos-curso.component';
import { FormTipoCursoComponent } from './components/form-tipo-curso/form-tipo-curso.component';

export const CURSOS_ROUTES: Routes = [
  {
    path: 'cursos',
    component: CardsCursosComponent
  },
  {
    path: 'cursos/:id/permissoes',
    component: PermissoesCursoFormComponent
  },
  {
    path: 'cursos/novo',
    component: FormCursoComponent
  },
  {
    path: 'cursos/editar/:id',
    component: FormCursoComponent
  },
  {
    path: 'categorias',
    component: ListaCategoriasComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'categorias/novo',
    component: FormCategoriaComponent,
    canActivate: [adminGuard] // Apenas ADMINISTRADOR pode criar categorias
  },
  {
    path: 'categorias/editar/:id',
    component: FormCategoriaComponent,
    canActivate: [adminGuard] // Apenas ADMINISTRADOR pode editar categorias
  }
  ,
  {
    path: 'tipos-curso',
    component: ListaTiposCursoComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'tipos-curso/novo',
    component: FormTipoCursoComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'tipos-curso/editar/:id',
    component: FormTipoCursoComponent,
    canActivate: [adminGuard]
  }
];

