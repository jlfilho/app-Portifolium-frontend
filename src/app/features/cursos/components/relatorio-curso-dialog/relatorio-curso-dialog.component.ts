import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { RelatorioCursoFiltro } from '../../services/cursos-relatorios.service';

export interface RelatorioCursoDialogData {
  cursoNome: string;
  categorias: Array<{ id: number; nome: string }>;
}

export type RelatorioCursoDialogResult = RelatorioCursoFiltro;

@Component({
  selector: 'acadmanage-relatorio-curso-dialog',
  standalone: true,
  templateUrl: './relatorio-curso-dialog.component.html',
  styleUrl: './relatorio-curso-dialog.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule
  ]
})
export class RelatorioCursoDialogComponent {
  readonly maxIntroducaoLength = 2500;
  form: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<RelatorioCursoDialogComponent, RelatorioCursoDialogResult | null>,
    @Inject(MAT_DIALOG_DATA) public readonly data: RelatorioCursoDialogData,
    private readonly fb: FormBuilder,
    private readonly dateAdapter: DateAdapter<Date>
  ) {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    this.form = this.fb.group({
      dataInicio: [primeiroDiaMes, Validators.required],
      dataFim: [hoje, Validators.required],
      categorias: [[]],
      introducao: ['', [Validators.maxLength(this.maxIntroducaoLength)]]
    }, { validators: this.validarIntervaloDatas });

    this.dateAdapter.setLocale('pt-BR');
  }

  fechar(): void {
    this.dialogRef.close(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { dataInicio, dataFim, categorias, introducao } = this.form.value;
    const resultado: RelatorioCursoDialogResult = {
      dataInicio: this.formatarDataISO(dataInicio),
      dataFim: this.formatarDataISO(dataFim),
      categorias: categorias && categorias.length > 0 ? categorias : undefined,
      introducao: introducao && introducao.trim().length > 0 ? introducao.trim() : undefined
    };

    this.dialogRef.close(resultado);
  }

  private formatarDataISO(data: Date): string {
    if (!data) {
      return '';
    }
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private validarIntervaloDatas(group: FormGroup): { invalidRange: boolean } | null {
    const inicio: Date = group.get('dataInicio')?.value;
    const fim: Date = group.get('dataFim')?.value;

    if (inicio && fim && inicio > fim) {
      return { invalidRange: true };
    }

    return null;
  }

  get dataInvalida(): boolean {
    return this.form.hasError('invalidRange');
  }

  get categoriasDisponiveis(): Array<{ id: number; nome: string }> {
    return this.data.categorias ?? [];
  }
}

