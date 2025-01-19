import { Component, OnInit, viewChild, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { CursosService } from '../../services/cursos.service';
import { Permissao } from '../../../../shared/models/permissao.model';
import { RemoveRolePipe } from '../../../../shared/pipes/remove-role.pipe';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Usuario } from '../../../../shared/models/usuario.model';
import { map, Observable, startWith } from 'rxjs';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';

@Component({
  selector: 'acadmanage-permissao-usuario',
  imports: [MatDividerModule, FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatTooltipModule, RemoveRolePipe, MatExpansionModule, MatAutocompleteModule],
  templateUrl: './permissao-usuario.component.html',
  styleUrl: './permissao-usuario.component.scss'
})
export class PermissaoUsuarioComponent implements OnInit {
  usuarioControl = new FormControl<string | Usuario>('');
  usuarios: Usuario[] = [];
  filteredUsuarios!: Observable<Usuario[]>;
  usuarioSelecionado!: Usuario | undefined;;

  accordion = viewChild.required(MatAccordion);
  displayedColumns: string[] = ['usuario', 'permissao', 'acao'];
  dataSource: MatTableDataSource<Permissao> = new MatTableDataSource<Permissao>();
  errorMessage: string = ''; // Mensagem de erro (caso ocorra)
  cursoId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private cursosService: CursosService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location
  ) {
    this.route.params.subscribe(params => {
      this.cursoId = +params['id'];
    });
    this.loadUsuarios();
  }

  onUsuarioSelected(usuario: Usuario) {
    this.usuarioSelecionado = usuario;
  }

  loadUsuarios(): void {
    this.usuariosService.getAllUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log(this.usuarios); // Para depuração
      },
      error: (error) => {
        this.errorMessage = error.error.error;
        console.error(error); // Para depuração
      },
    });
  }

  ngOnInit() {
    this.filteredUsuarios = this.usuarioControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nome;
        return name ? this._filter(name as string) : this.usuarios.slice();
      }),
    );
  }

  displayFn(user: Usuario): string {
    return user && user.nome ? user.nome : '';
  }

  private _filter(name: string): Usuario[] {
    const filterValue = name.toLowerCase();

    return this.usuarios.filter(usuario => usuario.nome.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit() {
    this.loadPermissoes();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  confirmacao(mensagem: string): MatDialogRef<ConfirmDialogComponent> {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: { mensagem },
    });
  }

  voltar(): void {
    this.location.back(); // Retorna para a tela anterior
  }

  loadPermissoes(): void {
    this.cursosService.getAllPermissoesByCurso(this.cursoId).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log(this.dataSource); // Para depuração
      },
      error: (error) => {
        this.errorMessage = error.error.error;
        console.error(error); // Para depuração
      },
    });
  }

  removerUsuario(usuarioId: number): void {
    const dialogRef = this.confirmacao(`Tem certeza que deseja remover a permissão deste usuário para acessar este curso?`);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cursosService.removeCursoUsuario(this.cursoId, usuarioId).subscribe({
          next: (data) => {
            this.dataSource.data = data;
          },
          error: (error) => {
            this.errorMessage = error.error.error;
            console.error(error); // Para depuração
          },
        });
      }
    });
  }

  adicionarUsuario(usuarioId: number): void {
    console.log(this.usuarioSelecionado);
    this.cursosService.adicionarCursoUsuario(this.cursoId, usuarioId).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log(this.dataSource.data); // Para depuração
        this.usuarioSelecionado = undefined;
      },
      error: (error) => {
        this.errorMessage = error.error.error;
        console.error(error); // Para depuração
        this.usuarioSelecionado = undefined;
      },
    });
  }

}
