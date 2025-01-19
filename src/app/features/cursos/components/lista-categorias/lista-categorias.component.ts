import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { CursosService } from '../../services/cursos.service';
import { Categoria } from '../../../../shared/models/categoria.model';

@Component({
  selector: 'acadmanage-lista-categorias',
  imports: [MatDividerModule, CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './lista-categorias.component.html',
  styleUrl: './lista-categorias.component.css'
})
export class ListaCategoriasComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'acao'];
  dataSource: MatTableDataSource<Categoria> = new MatTableDataSource<Categoria>();
  errorMessage: string = ''; // Mensagem de erro (caso ocorra)

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private cursosService: CursosService) {}


  ngAfterViewInit() {
    this.loadCatagories();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  loadCatagories(): void {
    this.cursosService.getAllCategories().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log(this.dataSource); // Para depuração
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os cursos. Tente novamente.';
        console.error(error); // Para depuração
      },
    });
  }
}
