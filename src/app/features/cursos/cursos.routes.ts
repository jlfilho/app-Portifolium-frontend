import { Routes } from '@angular/router';
import { CardsCursosComponent } from './components/cards-cursos/cards-cursos.component';
import { FormCursoComponent } from './components/form-curso/form-curso.component';
import { ListaCategoriasComponent } from './components/lista-categorias/lista-categorias.component';
import { FormCategoriaComponent } from './components/form-categoria/form-categoria.component';
import { adminGuard } from '../../shared/guards/admin.guard';

export const CURSOS_ROUTES: Routes = [
  {
    path: 'cursos',
    component: CardsCursosComponent
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
    component: ListaCategoriasComponent
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
];

