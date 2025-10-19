import { Routes } from '@angular/router';
import { CardsCursosComponent } from './components/cards-cursos/cards-cursos.component';
import { FormCursoComponent } from './components/form-curso/form-curso.component';
import { ListaCategoriasComponent } from './components/lista-categorias/lista-categorias.component';
import { FormCategoriaComponent } from './components/form-categoria/form-categoria.component';

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
    component: FormCategoriaComponent
  },
  {
    path: 'categorias/editar/:id',
    component: FormCategoriaComponent
  }
];

