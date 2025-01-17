import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { GraficosComponent } from './dashboard/graficos/graficos.component';
import { HomeComponent } from './dashboard/home/home.component';
import { CardsAtividadesComponent } from './features/cursos/components/cards-atividades/cards-atividades.component';
import { CardsCursosComponent } from './features/cursos/components/cards-cursos/cards-cursos.component';
import { FormCategoriaComponent } from './features/cursos/components/form-categoria/form-categoria.component';
import { ListaCategoriasComponent } from './features/cursos/components/lista-categorias/lista-categorias.component';
import { FormUsuarioComponent } from './features/usuarios/components/form-usuario/form-usuario.component';
import { ListaUsuariosComponent } from './features/usuarios/components/lista-usuarios/lista-usuarios.component';
import { authGuard } from './shared/auth.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { DetalheAtividadeComponent } from './features/cursos/components/detalhe-atividade/detalhe-atividade.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard],
    children: [                    // Rotas filhas do Dashboard
      { path: 'dashboard', component: GraficosComponent },
      { path: 'cursos', component: CardsCursosComponent },
      { path: 'atividades/:id', component: CardsAtividadesComponent },
      { path: 'atividades/detalhe/:id', component: DetalheAtividadeComponent, pathMatch: 'full' },
      { path: 'categorias', component: ListaCategoriasComponent },
      { path: 'formcategoria', component: FormCategoriaComponent },
      { path: 'usuarios', component: ListaUsuariosComponent },
      { path: 'formusuario', component: FormUsuarioComponent },
      { path: '**', component: NotFoundComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Rota padrão dentro do dashboard
    ],
   },
   { path: '**', redirectTo: 'login' },
];

