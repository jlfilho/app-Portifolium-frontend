import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'acadmanage-form-curso',
  imports: [MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ],
  templateUrl: './form-curso.component.html',
  styleUrl: './form-curso.component.scss'
})
export class FormCursoComponent {
  cursoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormCursoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { curso: { id: number; nome: string } }
  ) {
    this.cursoForm = this.fb.group({
      id: [data.curso.id],
      nome: [data.curso.nome, [Validators.required, Validators.minLength(8)]],
    });
  }

  save(): void {
    if (this.cursoForm.valid) {
      this.dialogRef.close(this.cursoForm.value); // Retorna os dados para o componente pai
    }
  }

  cancel(): void {
    this.dialogRef.close(); // Fecha o diálogo sem salvar
  }
}
